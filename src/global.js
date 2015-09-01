W.$J('.submenu_community').append('<a class="submenuitem" href="http://steamcommunity.com/groups/SteamClientBeta#swt-settings">SWT - '+t('set.settings')+'</a>');

if(settings.cur.globalHideAccName){
	var acBtnEl = W.$J('#account_pulldown')[0];
	if(acBtnEl){
		acBtnEl.title = acBtnEl.innerHTML;
		acBtnEl.innerHTML = '['+t('acc')+']';
	}
}