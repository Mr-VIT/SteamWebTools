// ==UserScript==
// @include http://store.steampowered.com/cart*
// @include https://store.steampowered.com/cart*
// ==/UserScript==

// block
function createBlock(title, links){
	var out='<h2>'+title+'</h2><div class="block"><div class="block_content">';

	var link;
	for (var i=0; i < links.length; i++) {
		link = links[i];
		out+='<a class="btn_small btnv6_blue_hoverfade" href="'+link.href+'"'+(link.blank ? ' target="_blank"':'')+'><span>'+link.text+'</span></a><br/>'
	}

	out+='Добавить SubID\'ы в корзину: <form id="addtocartsubids" method="post"><input type="hidden" name="action" value="add_to_cart"><input type="text" name="subids" placeholder="1, 2, 3"/><input type="submit" value="Добавить"></form></div></div>';

	return out;
}

var $ = W.$J; // jQuery

var el = document.querySelector('.page_content > .rightcol');

links = [
	{href:'javascript:document.cookie=\'shoppingCartGID=0; path=/\';location.href=\'/cart/\';', text:'Очистить Корзину'},
	{href:'https://store.steampowered.com/checkout/?purchasetype=gift#fastbuy',blank:1, text:'Быстро купить в инвентарь со Steam Wallet'},
];

el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));

$('#addtocartsubids').bind('submit',function(){
	var t = $(this);
	var subids = t.find('input[name="subids"]').val();
	subids = subids.split(',');
	for (var i=0; i < subids.length; i++) {
		t.append('<input type="hidden" name="subid[]" value="'+subids[i].trim()+'"/>')
	}
})