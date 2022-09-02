// == Feature == add link to SWT settings page
W.$J('.submenu_community').append('<a class="submenuitem swt" href="https://steamcommunity.com/groups/SteamClientBeta#/swt-settings">SWT - '+t('set.settings')+'</a>');

// == Feature == fix top navbar & to top button
if(settings.cur.globalFixNavbar){
	W.$J('head').append('<style>#global_header.swtfixed{position:fixed;z-index:9999;width:100%}.responsive_page_template_content.swtfixed{padding-top:50px}#global_header.swtfixed>.content{height:50px !important}#global_header.swtfixed div.logo{display:none}#global_header.swtfixed .menuitem{padding-top:15px !important}#global_header.swtfixed .supernav_container{left:0 !important}#global_header.swtfixed .header_installsteam_btn{display:none}.swtup{display:none}#global_header.swtfixed .swtup{display:block;float:left}</style>');
	
	
	var menu = W.$J('#global_header');
	if(menu.length){
		menu.prepend('<a class="swtup" href="#"><span class="btn_grey_white_innerfade btn_medium_wide"><span>'+t('totop')+'</span></span></a>');
		var origOffsetY = menu.offset().top;

		function scroll() {
			if (W.$J(window).scrollTop() > origOffsetY) {
				W.$J('#global_header').addClass('swtfixed');
				W.$J('.responsive_page_template_content').addClass('swtfixed');
			} else {
				W.$J('#global_header').removeClass('swtfixed');
				W.$J('.responsive_page_template_content').removeClass('swtfixed');
			}

		}
		W.document.onscroll = scroll;
	}
}

// == Feature == Hide Wallet Balance
if(settings.cur.globalHideWalletBalance){
	var el = $J('#header_wallet_balance')[0];
	if(el){
		el.title = el.innerHTML;
		el.innerHTML = '['+t('balance')+']';
	}
}