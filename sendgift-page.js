// ==UserScript==
// @include http://store.steampowered.com/checkout/*
// @include https://store.steampowered.com/checkout/*
// ==/UserScript==

(function(){

function init() {
	if(!window.g_bIsGiftForm) return; // only on send gift page
	var divs = document.querySelectorAll('.friend_block.disabled');
	var rbtns = document.querySelectorAll('.friend_block_radio input[disabled]');
	for (var i=0; i < divs.length; i++){
		divs[i].removeClassName('disabled');
		rbtns[i].disabled = false;
	}
	

	if(window.location.hash && window.location.hash.substr(1,9)=='multisend'){
		var gifts = window.location.hash.substr(11,window.location.hash.lenght);
		gifts = JSON.parse(decodeURIComponent(gifts))
		var el=document.querySelector('.checkout_tab');
		var gids=[], names=[], str='';
		for(x in gifts){
			gids.push(x);
			names.push(gifts[x]);
			str+='<p>'+gifts[x]+'</p>'
		}
		el.innerHTML='<p><b>Гифты для отправки: '+gids.length+'</b></p>'+str+'';
	
		var curGift = 0;
		window.g_gidGift = gids[0];
		
		var OnSendGiftSuccess_old = window.OnSendGiftSuccess;
		window.OnSendGiftSuccess = function(){

			alert('Гифт #'+(curGift+1)+' '+names[curGift]+' отправлен.')
			var r = OnSendGiftSuccess_old.apply(this, arguments);
			
			window.g_gidGift = gids[++curGift];
			window.SendGift();
			
			return r;
		}
	
	}

	
}


var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);
	
})();