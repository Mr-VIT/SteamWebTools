var btns={},
	selector='div.DialogInputLabelGroup';

function btnTemplate(title){
	return `<button type="button" class="DialogButton _DialogLayout Primary">${title}</button>`
}

$J(document).on('focus', selector, function(){
	if(location.href.endsWith('/background')){
		if(!btns.FilterBg) {
			btns.FilterBg = $J(btnTemplate(t('prEd.showanim')))
			.click(function(){
				$J("div[class^='profilebackground_BackgroundOption_']")
				.not("[class*='WithVideo']")
				.hide()
			})
		}
		btns.FilterBg.insertAfter(selector)
	}else
	if(location.href.endsWith('/favoritebadge')){
		if(!btns.removeBadge) {
			btns.removeBadge = $J(btnTemplate(t('prEd.hideFbdg')))
			.click(function(){
				$J.post( 'https://api.steampowered.com/IPlayerService/SetFavoriteBadge/v1', {
					access_token: $J("#profile_edit_config").data("profile-edit").webapi_token,
					badgeid: 0
				}).then(function(){location.href='/my'});
			})
		}
		btns.removeBadge.insertAfter(selector)
	}
})
