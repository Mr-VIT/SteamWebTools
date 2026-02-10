// == Feature == custom App for status
$J('<a>[Set AppID]</a>').click(()=>{
	let val = prompt('AppID');
	$('blotter_poststatus_appid').value = val;
	$('_swt_poststatus_appid').innerHTML = val;
})
.appendTo('div.blotter_status_submit_ctn:first')
.after('&nbsp;<span id="_swt_poststatus_appid"></span>')

// == Feature == repair logos for unavailable games on the Activity page
let imgs = $J('div.blotter_gamepurchase_content a.blotter_gamepurchase_logo>img[src=""]');
if(!imgs.length) return;

const STOREURL= '//store.steampowered.com/';
const campaign= encodeURIComponent(GM_info?.script?.name?.replaceAll(' ',''));

async function getSubImage(subid, cc='us'){
	let res = await GM.xmlHttpRequest({
		url: STOREURL+'api/packagedetails/?v=1&cc='+cc+'&packageids='+subid,
		anonymous: true,
		responseType: 'json'
	});
	return res.response[subid]?.data?.small_logo
}

imgs.each(async (i,el)=>{
	let aEl = el.parentElement
	let appid = aEl.dataset?.appid;

	if(appid) {
		aEl.outerHTML=`<iframe src="${STOREURL}widget/${appid}/?dynamiclink=1&hidebuttons=1&cc=us&utm_campaign=${campaign}&utm_source=steamcommunity" frameborder="0" width="100%" height="190"></iframe>`;
		return
	}

	let subid = aEl.href.match(/\/sub\/(\d+)/)?.[1];
	if(!subid) return;

	el.src = (await getSubImage(subid) ?? await getSubImage(subid, 'eu'));
})
