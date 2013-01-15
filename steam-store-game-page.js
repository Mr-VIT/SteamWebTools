// ==UserScript==
// @include https://store.steampowered.com/app/*
// @include http://store.steampowered.com/app/*
// @include https://store.steampowered.com/sub/*
// @include http://store.steampowered.com/sub/*
// ==/UserScript==

(function(){

function init() {
	alert(1);
	var els = document.querySelectorAll('input[name="subid"]');

	var subid, el;
	for(var i=0; i < els.length; i++){
		el = els[i];
		subid = el.value;
		el.parentElement.parentElement.insertAdjacentHTML('beforeEnd', '<div>Subscription id = <a href="http://cdr.thebronasium.com/sub/'+subid+'">'+subid+'</a></div>');
	}
	
	alert(2);
	
	var res = String(window.location.href).match(/\/(sub|app)\/(\d+)/i);
	var gamenameEl = document.querySelector('.game_title_area .game_name .blockbg');
	if (!gamenameEl){
		gamenameEl = document.querySelector('.apphub_AppName');
	}
	var gamename = encodeURIComponent(gamenameEl.textContent.trim());
	el = document.querySelector('#main_content > .rightcol');

	links = [
		{href:'http://steamgamesales.com/'+res[1]+'/'+res[2], icon:'http://steamgamesales.com/favicon.ico', text:'Посмотреть на SteamGameSales.com'},
		{href:'http://www.steamprices.com/ru/'+res[1]+'/'+res[2], icon:'http://www.steamprices.com/favicon.png', text:'Посмотреть на SteamPrices.com'},
		{href:'http://steammoney.com/?price=up&s='+gamename, icon:'http://steammoney.com/favicon.ico', text:'Искать на SteamMoney.com'},
	];
	
	alert(3);
	el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));
	alert(4);
};


// block
function createBlock(title, links){
	alert('createBlock1');
	var out='<div class="block">\
<div class="block_header"><h4>'+title+'</h4></div>\
<div class="block_content"><div class="block_content_inner">';

	var link;
	for (var i=0; i < links.length; i++) {
		link = links[i];
		out+='<a class="linkbar" href="'+link.href+'" target="_blank"><div class="rightblock">\
<img src="'+link.icon+'" width="16" height="16" border="0" align="top"></div>'+link.text+'</a>'
	}

	out+='</div></div></div>';
	alert('createBlock1');
	return out;
}



var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);

})();

