// == Feature == add link to SWT settings page
W.$J('.submenu_community').append('<a class="submenuitem swt" href="https://steamcommunity.com/groups/SteamClientBeta#/swt-settings">SWT - '+t('set.settings')+'</a>');

// == Feature == fix top navbar & to top button
if(settings.cur.globalFixNavbar){
	W.$J('head').append('<style>#global_header.swtfixed{position:fixed;z-index:998;width:100%}.responsive_page_template_content.swtfixed{padding-top:var(--headerheight)}#global_header.swtfixed>.content{height:50px!important}.swtup,#global_header.swtfixed .header_installsteam_btn,#global_header.swtfixed div.logo{display:none}#global_header.swtfixed .menuitem{padding-top:15px!important}#global_header.swtfixed .supernav_container{left:0!important}#global_header.swtfixed .swtup{display:block;float:left}</style>');


	var menu = W.$J('#global_header');
	if(menu.length){
		menu.prepend('<a class="swtup" href="#"><span class="btn_grey_white_innerfade btn_medium_wide"><span>'+t('totop')+'</span></span></a>');
		var origOffsetY = menu.offset().top;

		var cssClassName = 'swtfixed',
			header = W.$J('#global_header'),
			pageContent = W.$J('.responsive_page_template_content');

		pageContent[0].style.setProperty("--headerheight", header[0].clientHeight+"px");
		$w = W.$J(window);

		W.document.onscroll = ()=>{
			if ($w.scrollTop() > origOffsetY) {
				header.addClass(cssClassName);
				pageContent.addClass(cssClassName);
			} else {
				header.removeClass(cssClassName);
				pageContent.removeClass(cssClassName);
			}

		};
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