// ==UserScript==
// @include http://store.steampowered.com/checkout/*
// @include https://store.steampowered.com/checkout/*
// ==/UserScript==

(function(){

function init() {
	var divs = document.querySelectorAll('.friend_block.disabled');
	if(!divs) return;
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
		
		window.$('email_input').insertAdjacentHTML("afterEnd", 
			'<br/><br/>Если хотите отправить гифты на разыне Email введите их ниже по одному на строку. Гифты будут отправленны по порядку. Если гифтов больше чем адресов, оставшиеся гифты будут отправлены на последний адрес<br/><textarea id="emails" rows=3></textarea>'
		);
		
		var curGift = 0, emails=[];
		window.g_gidGift = gids[0];
		
		var SubmitGiftDeliveryForm_old = window.SubmitGiftDeliveryForm;
		window.SubmitGiftDeliveryForm = function(){
			if (!window.$('send_via_email').checked)
				return SubmitGiftDeliveryForm_old.apply(this, arguments);
			
			if (!window.$('emails').value)
				return SubmitGiftDeliveryForm_old.apply(this, arguments);
				
			emails = window.$('emails').value.split(/\r?\n/);
			
			if(emails.length){
				window.$('email_input').value = emails[0];
			}
			
			return SubmitGiftDeliveryForm_old.apply(this, arguments);

		}
		
		var OnSendGiftSuccess_old = window.OnSendGiftSuccess;
		window.OnSendGiftSuccess = function(){

			alert('Гифт #'+(curGift+1)+' '+names[curGift]+' отправлен.')
			var r = OnSendGiftSuccess_old.apply(this, arguments);
			
			if(window.g_gidGift = gids[++curGift]){
				if(emails.length>1){
					window.$('email_input').value = emails[Math.min(curGift, (emails.length-1))]
				}
			
				window.SendGift();
				
			}
			
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