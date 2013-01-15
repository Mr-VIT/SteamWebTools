// ==UserScript==
// @include http://store.steampowered.com/cart/*
// @include https://store.steampowered.com/cart/*
// ==/UserScript==

(function(){

function init() {
	var el = document.querySelector('#main_content > .rightcol');

	links = [
		//{href:'#', text:'Сохранить Корзину'},
		//{href:'#', text:'Загрузить Корзину'},
		{href:'https://store.steampowered.com/checkout/?purchasetype=gift#fastbuy',blank:1, text:'Бысто купить в подарок со Steam Wallet'},
	];

	el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));
}

	
	
// block
function createBlock(title, links){
	var out='<div class="block">\
<div class="block_header"><h4>'+title+'</h4></div>\
<div class="block_content"><div class="block_content_inner">';

	var link;
	for (var i=0; i < links.length; i++) {
		link = links[i];
		out+='<a class="linkbar" href="'+link.href+'"'+(link.blank ? ' target="_blank"':'')+'><div class="rightblock">\
</div>'+link.text+'</a>'
	}

	out+='</div></div></div>';

	return out;
}

var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);
})();
