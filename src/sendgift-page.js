var divs = document.querySelectorAll('.friend_block.disabled');
if(!divs) return;
var rbtns = document.querySelectorAll('.friend_block_radio input[disabled]');
for (var i=0; i < divs.length; i++){
	divs[i].removeClassName('disabled');
	rbtns[i].disabled = false;
}

if(W.location.hash && W.location.hash.substr(1,9)=='multisend'){
	var gifts = W.location.hash.substr(11,W.location.hash.lenght);
	gifts = JSON.parse(decodeURIComponent(gifts))
	var el=document.querySelector('.checkout_tab');
	var gids=[], names=[], str='', i=0;
	for(var x in gifts){
		gids.push(x);
		names.push(gifts[x]);
		str+='<p>'+gifts[x]+' <span id="giftN'+i+'"></span></p>';
		i++;
	}
	el.innerHTML='<p><b>Гифты для отправки: '+gids.length+'</b></p>'+str+'';

	W.$('email_input').insertAdjacentHTML("afterEnd",
		'<br/><br/>Если хотите отправить гифты на разыне Email введите их ниже по одному на строку. Гифты будут отправленны по порядку. Если гифтов больше чем адресов, оставшиеся гифты будут отправлены на последний адрес<br/><textarea id="emails" rows=3></textarea>'
	);

	var curGift = 0, emails=[];
	W.g_gidGift = gids[0];

	var SubmitGiftDeliveryForm_old = W.SubmitGiftDeliveryForm;
	W.SubmitGiftDeliveryForm = function(){
		if (!W.$('send_via_email').checked)
			return SubmitGiftDeliveryForm_old.apply(this, arguments);

		if (!W.$('emails').value)
			return SubmitGiftDeliveryForm_old.apply(this, arguments);

		emails = W.$('emails').value.split(/\r?\n/);

		if(emails.length){
			W.$('email_input').value = emails[0];
		}

		return SubmitGiftDeliveryForm_old.apply(this, arguments);

	}

	var OnSendGiftSuccess_old = W.OnSendGiftSuccess;
	W.OnSendGiftSuccess = function(){

		W.$('giftN'+curGift).innerHTML='- Отправлен';

		if(W.g_gidGift = gids[++curGift]){
			if(emails.length>1){
				W.$('email_input').value = emails[Math.min(curGift, (emails.length-1))]
			}

			W.SendGift();
		} else {
			OnSendGiftSuccess_old.apply(this, arguments);
		}
	}
}

