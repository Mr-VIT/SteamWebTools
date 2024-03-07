/* Features:
*	* button: 1-click purchase
*	* cart history list, add to cart from history
*/
function createBlock(title, links){
	var out='<h2>'+title+'</h2><div class="block"><div class="block_content">';

	var link;
	for (var i=0; i < links.length; i++) {
		link = links[i];
		out+='<a class="btn_small btnv6_blue_hoverfade" href="'+link.href+'"'+(link.blank ? ' target="_blank"':'')+'><span>'+link.text+'</span></a><br/>'
	}

	out+=`<br/><h2>${t('addSubidsToCart')}</h2> <form id="addtocartsubids" method="post"><input type="hidden" name="sessionid" value="${W.g_sessionID}"><input type="hidden" name="action" value="add_to_cart"><input type="text" name="subids" placeholder="1, 2, 3"/><input type="submit" value="${t('add')}" class="btn_small btnv6_blue_hoverfade"></form><label><input type="checkbox" id="swt_cb_asbundleid">Bundle Id</label><br>
	<form id="formcarthist" method="post"><h2>${t('cartHist')}</h2><input type="submit" value="${t('addChecked')}" class="btn_small btnv6_blue_hoverfade"><input type="hidden" name="sessionid" value="${W.g_sessionID}"><input type="hidden" name="action" value="add_to_cart">`;

	var cartHistory = W.localStorage['swtcarthistory'] ? JSON.parse(W.localStorage['swtcarthistory']) : [];
	var chStr = '';
	for(let i=cartHistory.length-1; i>=0; --i) {
		let itm = cartHistory[i];
		chStr+= '<br><br><input type="checkbox" name="subid[]" value="'+itm.subid+'">  <a href="/'+(itm.link || 'sub/'+itm.subid)+'/">'+(itm.name || 'SubID: '+itm.subid)+'</a><br>[<a href="/sub/'+itm.subid+'/">'+itm.subid+'</a>] ('+(itm.price || 'N/A')+')';
	}

	out += chStr + '</form></div></div>';

	return out;
}

var $ = W.$J; // jQuery
// TODO test for new cart
links = [
	{href:'https://store.steampowered.com/checkout/?purchasetype=gift#quick',blank:1, text:t('quickPurchase')},
];

$('#page_root').after(createBlock('Steam Web Tools', links));

$('#addtocartsubids').bind('submit',function(){
	var t = $(this);

	if(t.next().find('#swt_cb_asbundleid').prop('checked')){
		t.find('input[name="subids"]').prop('name', 'bundleid');
		return;
	}

	var
		subids = t.find('input[name="subids"]').val(),
		s,
		cartHistory = W.localStorage['swtcarthistory'] ? JSON.parse(W.localStorage['swtcarthistory']) : [];

	subids = subids.split(',');
	for (var i=0; i < subids.length; i++) {
		s = subids[i] = Number(subids[i].trim());
		t.append('<input type="hidden" name="subid[]" value="'+s+'"/>');
		if(cartHistory.at(-1).subid!=s)
			cartHistory.push({subid: s});
	}
	while(cartHistory.length>20){
		cartHistory.shift();
	}
	W.localStorage['swtcarthistory'] = JSON.stringify(cartHistory);

	if(W.g_bUseNewCartAPI && W.AddItemToCart){
		W.AddItemToCart(subids);
		return false;
	}
});

$('#formcarthist').bind('submit',function(){

	if(W.g_bUseNewCartAPI && W.AddItemToCart){
		let subids = $('input[name="subid[]"]:checked', this).toArray().map(i=>Number(i.value));
		W.AddItemToCart(subids);
		return false;
	}
});
