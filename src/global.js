if(W.SSR && !W.SSR.reactRoot){
	await new Promise(resovle => {
		let timerId = setInterval(()=>{
			if(W.SSR.reactRoot){
				clearInterval(timerId);
				resovle();
			}
		}, 400);
	});
}

if(settings._first){
	// show settings button

	let style = ['outline','#48DA48 3px solid'],
		showPopover, outlineBtn;
	if(W.$J){
		let item = W.$J('#global_header a.menuitem.supernav[data-tooltip-content=".submenu_Community"]');
		item.css(...style);
		showPopover = ()=> item.trigger('mouseover');
		outlineBtn  = ()=> item.parent().find('.submenuitem:last').css(...style);
	} else if(W.SSR) {
		let a = document.querySelector('header nav>ul>a:nth-of-type(2)');
		a.style.setProperty(...style);
		let div = a.nextElementSibling;
		showPopover = ()=> div.showPopover();
		outlineBtn  = ()=> div.lastElementChild.style.setProperty(...style);
	} else {
		throw 'no $J/SSR'
	}
	setTimeout(showPopover, 1000);
	setTimeout(outlineBtn, 2000);
}


// == Feature == add link to SWT settings page
!function(){
	let href = '//steamcommunity.com/groups/SteamClientBeta#/swt-settings',
		text = 'SWT - '+t('set.settings'),
		menuSel = W.$J
			?'#global_header .submenu_Community'
			:'header nav>ul>div:nth-of-type(2)'

	let div = document.querySelector(menuSel);
	if(!div){
		console.error('no menu');
		return;
	}
	let el = div.lastElementChild.cloneNode(true);
	el.href = href;
	el.innerText = text;
	div.appendChild(el);
}()




// == Feature == fix top navbar & to top button
if(settings.cur.globalFixNavbar){
	let headerSel = W.$J?'#global_header':'header';
	// let pageContentSel = W.$J?'.responsive_page_template_content':'body';
	let pageContentSel = 'body';
	let fixedCssClassName = 'swtfixed'

	document.head.insertAdjacentHTML(
		'beforeend',
		`<style>${headerSel}.${fixedCssClassName}{position:fixed;z-index:998;width:100%;top:0}${pageContentSel}.${fixedCssClassName}{padding-top:var(--headerheight)}`
		//height
		+`${headerSel}.${fixedCssClassName}`
		+(W.$J
			? '>.content'
			: ''
		)+'{height:50px!important}'
		//height2
		+`${headerSel}.${fixedCssClassName} `
		+(W.$J
			? '.menuitem'
			: 'nav>ul>a'
		)+'{padding-top:16px!important}'
		//logo
		+`${headerSel}.${fixedCssClassName}`
		+(W.$J
			? ' div.logo'
			: '>div>a:nth-of-type(1)'
		)+'{display:none}'
		//other
		+(W.$J
			? `.swtup,${headerSel}.${fixedCssClassName} .header_installsteam_btn{display:none}`
			+`${headerSel}.${fixedCssClassName} .swtup{display:block;float:left}`
			+`${headerSel}.${fixedCssClassName} .supernav_container{left:0!important}` //no need for new UI
			//todo adapt swtup for SSR UI
			:''
		)
		+'</style>'
	);



	let header = document.querySelector(headerSel);
	if(header){
		if(W.$J) //todo adapt styles for SSR UI
			header.insertAdjacentHTML('afterBegin','<a class="swtup" href="#"><span class="btn_grey_white_innerfade btn_medium_wide"><span>'+t('totop')+'</span></span></a>');

		let pageContent = document.querySelector(pageContentSel);

		pageContent?.style.setProperty("--headerheight", header.clientHeight+"px");

		document.onscroll = function(){
			let down = window.scrollY > 0;
			header.classList.toggle(fixedCssClassName, down);
			pageContent.classList.toggle(fixedCssClassName, down);
		};
	}
}

if(!W.$J || W.SSR){
	console.error('newUI?');
	return
}

// == Feature == Hide Wallet Balance
if(settings.cur.globalHideWalletBalance){
	var el = $J('#header_wallet_balance')[0];
	if(el){
		el.title = el.innerHTML;
		el.innerHTML = '['+t('balance')+']';
	}
}