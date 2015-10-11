W.$J('.submenu_community').append('<a class="submenuitem" href="http://steamcommunity.com/groups/SteamClientBeta#swt-settings">SWT - '+t('set.settings')+'</a>');

if(settings.cur.globalHideAccName){
	var acBtnEl = W.$J('#account_pulldown')[0];
	if(acBtnEl){
		acBtnEl.title = acBtnEl.innerHTML;
		acBtnEl.innerHTML = '['+t('acc')+']';
	}
}

if(settings.cur.globalFixNavbar){
	W.$J('head').append('<style>#global_header{position:fixed;z-index:9999;width:100%}.responsive_page_template_content{padding-top:74px}#global_header>.content{height:74px !important}</style>');
}