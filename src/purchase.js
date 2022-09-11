// == Feature == checked boxes SSA
W.$('accept_ssa').checked=true;
//W.$('verify_country_only').checked=true;

// == Feature == add option "To inventory" and select it
if(W.location.search.includes('purchasetype=gift')){
	if(!W.$('send_self')){
		W.$J.ajax('/account/')
		.done(function(responseText) {
			var curacid = responseText.match(/g_AccountID = (\d+);/)?.[1];
			if(curacid){
				var SelectGiftRecipient_old = W.SelectGiftRecipient;
				W.SelectGiftRecipient = function(accid, name){
					if(accid!=curacid){
						W.$('send_self').checked=false;
					}
					return SelectGiftRecipient_old.apply(this, arguments);
				}
				W.$J('#current_friend_choice').after('<div class="cart_send_choice checkout_content"><input class="send_choice_radio" type="radio" id="send_self" name="send_method" onchange="if(this.checked)SelectGiftRecipient('+curacid+',\'\');CheckFriendDisplay();"><label for="send_self" class="send_choice_txt"> '+t('toInventory')+'</label></div>');
			}
		});
	}
}
