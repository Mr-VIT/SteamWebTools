var $=W.$J;

$('div.tradeoffer_footer>div.tradeoffer_footer_actions').prepend('<span class="pulldown global_action_link persona_name_text_content" onclick="ShowMenu(this,\'dropdownmenutradeoffer\',\'right\',\'bottom\',true );">[SWT]</span> | ').last().append('<div class="popup_block_new" id="dropdownmenutradeoffer" style="display:none;"><div class="popup_body popup_menu"><a class="popup_menu_item" href="#" onclick="swt_checkcardswap();return false">Check cards swap 1:1</a></div></div>');

var itemsDescriptions = {};
W.swt_checkcardswap = async function(){
	// TODO multi lang
	// 		load data from badge page: cards in set, cards in inv for fair swap check

	var $trade = $('div.tradeoffer:has(span.pulldown.focus)');
	var modalId = $trade.prop('id')+'_swt_modal';


	var $table = $('<div id="'+modalId+'"><div id="swt_loadstate"></div><img src="//steamcommunity-a.akamaihd.net/public/images/login/throbber.gif"></div>');
	var $loadstate = $table.find('#swt_loadstate');
	var Modal = W.ShowDialog('Check cards swap 1:1', $table);

	var tagsToType = {
		cardborder: {cardborder_0 :'card',
					 cardborder_1 :'foil'},
		item_class: {item_class_4 :'emot',
					 item_class_3 :'bg'},
	}
	function parseItemType(data){
		let item = JSON.parse(data);
		if(item.appid=='753')
			for (let tag of item.tags) {
				let type = tagsToType[tag.category];
				if(type && (type=type[tag.internal_name])) {
					item._type = type;
					break;
				}
			}
		return item;
	}


	var reItemSearch = /BuildHover\( '.*', (.*)\);/i;

	// load data for all items in trade
	let elements = $trade.find('div.tradeoffer_items div.trade_item').get();
	for (let i=0, n=elements.length; i<n; ++i) {
		let el = elements[i];

		var key = el.dataset.economyItem;
		if(itemsDescriptions[key]) continue;

		$loadstate.text(i+' / '+n);

		var data = await $J.ajax({
			url: "//steamcommunity.com/" + getUrl(key),
			cache: true,
		});
		var match = reItemSearch.exec(data);
		if (match) {
			let item = itemsDescriptions[key] = parseItemType(match[1]);
			item.hoverkey=key;
		} else {console.error('no data for item', key);}
	}

	// check items
	var items={
		all: [],
		other: {},
		typed: {},
	}
	function groupItems(_items, group){
		items.all[group]=_items;
		for(let item of _items){
			let type;
			if(item._type) {
				let key = item._type+'_'+item.market_fee_app;
				if( ! (type = items.typed[key]) ){
					type = items.typed[key]           = {type: item.type, app: item.market_fee_app, "0":0, "1":0};
				}
			} else {
				if( ! (type = items.other[item.hoverkey]) ){
					type = items.other[item.hoverkey] = {item: item, "0":0, "1":0};
				}
			}
			++type[group];
		}
	}


	var senderId = $trade.find("div.tradeoffer_items.primary > div.tradeoffer_items_avatar_ctn > a.tradeoffer_avatar[data-miniprofile]").data('miniprofile'),
		myId = $('#responsive_page_menu div.responsive_menu_user_area > div.responsive_menu_user_persona > a[data-miniprofile]').data('miniprofile'),
		senderIsMe = senderId==myId;


	// recipient, sender
	['secondary', 'primary'].forEach((el, i) =>
		groupItems(
			$trade.find('div.tradeoffer_items.'+el+' div.trade_item').get()
			.map(el => itemsDescriptions[el.dataset.economyItem])
		, senderIsMe ? 1-i : i ) // my=0, Their=1
	);

	var str='', checkRes=true;
	for(let type of Object.keys(items.typed)){
		let item = items.typed[type],
			curRes = item[0] <= item[1];
		checkRes &&= curRes;
		str+=`<tr><td><a target="_blank" href="/my/gamecards/${item.app}">[B]</a> ${item.type}</td><td>${(item[0])}</td><td>${compCount(1, curRes)}</td><td>${item[1]}</td></tr>`
	}
	// TODO set checkRes = false if others ?

	var body = '<h2>Community items</h2><table class="swt_swpcheck"><tr><td></td><td>My</td><td>'+compCount(1, checkRes)+'</td><td>Their</td></tr>'
		+'<tr><td><b><i>Total</i></b></td><td>'  +items.all[0].length +'</td><td>'
		+compCount(items.all[0].length, items.all[1].length)
		+'</td><td>' +items.all[1].length +'</td></tr>'
		+str
		+'</table><style>table.swt_swpcheck td{border-bottom:1px solid} table.swt_swpcheck td:nth-child(1){text-align:right} table.swt_swpcheck img{float:left;height:3em}</style>';


	items.other=Object.values(items.other);

	if(items.other.length){
		body+= '<br/><h2>Other</h2><table class="swt_swpcheck"><tr><td>My</td><td>Item type</td><td>Their</td></tr>';
		for(let i=0, n=items.other.length ; i<n; ++i) {
			let el = items.other[i], item = el.item;
			body+='<tr><td>'+(el[0]||'')
			+'</td><td data-economy-item="'+item.hoverkey+'"><img src="https://community.akamai.steamstatic.com/economy/image/'+item.icon_url+'/96fx96f">'
			+(item.is_stackable ? item.amount+'x ' : '')
			+item.name+'<br>'+item.type+'</td><td>'
			+(el[1]||'')+'</td></tr>';
		}
		body+='</table>';
	}
	$table.html(body);
	Modal.AdjustSizing();
	function compCount(a, b) {
		return a > b ? '<b style="color:red">&gt;</b>' : '<b style="color:limegreen">&lt;=</b>';
	}

	function getUrl( key ) { // based on steam's global.js
		var rgItemKey = key.split('/');

		// pop amount off the end first if it's present
		var nAmount;
		var strLastEntry = rgItemKey[rgItemKey.length - 1];
		if ( strLastEntry && strLastEntry.length > 2 && strLastEntry.substr( 0, 2 ) == 'a:' )
		{
			nAmount = strLastEntry.substr( 2 );
			rgItemKey.pop();
		}

		var strURL = null;
		var appid = rgItemKey[0];
		if ( appid == 'classinfo' )
		{
			// class info style
			appid = rgItemKey[1];
			var classid = rgItemKey[2];
			var instanceid = ( rgItemKey.length > 3 ? rgItemKey[3] : 0 );
			strURL = 'economy/itemclasshover/' + appid + '/' + classid + '/' + instanceid
				+ '?content_only=1';
		}
		else
		{
			// real asset
			var contextid = rgItemKey[1];
			var assetid = rgItemKey[2];
			var strURL = 'economy/itemhover/' + appid + '/' + contextid + '/' + assetid
				+ '?content_only=1&omit_owner=1';
			if ( rgItemKey.length == 4 && rgItemKey[3] )
			{
				var strOwner = rgItemKey[3];
				if ( strOwner.startsWith( 'id:' ) )
					strURL += '&o_url=' + strOwner.substr( 3 );
				else
					strURL += '&o=' + strOwner;
			}
		}
		if ( nAmount && nAmount > 1 )
			strURL += '&amount=' + nAmount;
		return strURL;

	};
}
