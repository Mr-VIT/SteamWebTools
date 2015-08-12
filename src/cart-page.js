// block
function createBlock(title, links){
	var out='<h2>'+title+'</h2><div class="block"><div class="block_content">';

	var link;
	for (var i=0; i < links.length; i++) {
		link = links[i];
		out+='<a class="btn_small btnv6_blue_hoverfade" href="'+link.href+'"'+(link.blank ? ' target="_blank"':'')+'><span>'+link.text+'</span></a><br/>'
	}

	out+='<br/><h2>Добавить SubID\'ы в корзину</h2> <form id="addtocartsubids" method="post"><input type="hidden" name="sessionid" value="'+W.g_sessionID+'"><input type="hidden" name="action" value="add_to_cart"><input type="text" name="subids" placeholder="1, 2, 3"/><input type="submit" value="Добавить" class="btn_small btnv6_blue_hoverfade"></form><br><form method="post"><input type="submit" value="Добавить выбранные" style="float:right" class="btn_small btnv6_blue_hoverfade"><h2>История корзины</h2><input type="hidden" name="sessionid" value="'+W.g_sessionID+'"><input type="hidden" name="action" value="add_to_cart">';
	
	var cartHistory = W.localStorage['swtcarthistory'] && JSON.parse(W.localStorage['swtcarthistory']) || [];
	var chStr = '';
	for(var i=0; i<cartHistory.length; i++) {
		chStr = '<input type="checkbox" name="subid[]" value="'+cartHistory[i].subid+'">  <a href="/'+(cartHistory[i].link || 'sub/'+cartHistory[i].subid)+'/">'+(cartHistory[i].name || 'SubID: '+cartHistory[i].subid)+'</a><br>[<a href="/sub/'+cartHistory[i].subid+'/">'+cartHistory[i].subid+'</a>] ('+(cartHistory[i].price || 'N/A')+')<br><br>' + chStr;
	}

	out += chStr + '</form></div></div>';

	return out;
}

var $ = W.$J; // jQuery

var el = document.querySelector('.page_content > .rightcol');

var cookie_date = new Date();
cookie_date.setTime(cookie_date.getTime()-1);

links = [
	{href:'javascript:document.cookie=\'shoppingCartGID=; path=/; expires='+cookie_date.toGMTString()+'\'; location.href=\'/cart/\';', text:'Очистить Корзину'},
	{href:'https://store.steampowered.com/checkout/?purchasetype=gift#fastbuy',blank:1, text:'Быстро купить в инвентарь со Steam Wallet'},
];

el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));

$('#addtocartsubids').bind('submit',function(){
	var t = $(this),
		subids = t.find('input[name="subids"]').val(),
		s,
		cartHistory = W.localStorage['swtcarthistory'] && JSON.parse(W.localStorage['swtcarthistory']) || [];
		
	subids = subids.split(',');
	for (var i=0; i < subids.length; i++) {
		s = subids[i].trim();
		t.append('<input type="hidden" name="subid[]" value="'+s+'"/>');
		
		cartHistory.push({subid: s});
	}
	while(cartHistory.length>20){
		cartHistory.shift();
	}
	W.localStorage['swtcarthistory'] = JSON.stringify(cartHistory);
})