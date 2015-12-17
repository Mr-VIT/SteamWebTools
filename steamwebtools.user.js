// ==UserScript==
// @name		Steam Web Tools
// @namespace	http://v1t.su/projects/steam/webtools/
// @description	Useful tools in Steam web sites
// @version		0.5.3
// @date		2015-12-17
// @author		Mr-VIT
// @homepage	http://v1t.su/projects/steam/webtools/
// @updateURL	https://mr-vit.github.io/SteamWebTools/version.js
// @icon		http://mr-vit.github.io/SteamWebTools/icon-64.png
// @run-at		document-end
// @include		http://store.steampowered.com/*
// @include		https://store.steampowered.com/*
// @include		http://steamcommunity.com/*
// @include		https://steamcommunity.com/*
// ==/UserScript==

W = unsafeWindow;

var settings = {
	defaults : {
		version : 1,

		globalLang : 'en',
		globalFixNavbar : true,
		globalHideAccName : true,
		globalHideWalletBalance : true,

		storeShowCCbtn : true,
		storeCCList : 'ru ua us ar fr no gb au br de jp',
		storeShowCartBtn : true,
		storeCartAjax : true,
		storeShowSubid : true,
		storeShowBtnGetPrices : true,
		
		marketMainPageFuncs: true,
	},
	cur : {},
	storage : {
		key : 'SWTSettings',
		gm : window.GM_getValue ? true : false,
		set : function(data){
			if(this.gm){
				GM_setValue(this.key, data);
			} else
				W.localStorage.setItem(this.key, data);
		},
		get : function(){
			if(this.gm){
				return GM_getValue(this.key);
			} else
				return W.localStorage.getItem(this.key);
		},
		del : function(){
			if(this.gm){
				GM_deleteValue(this.key);
			} else
				W.localStorage.removeItem(this.key);
		},
	},
	load : function(){
		this.cur = W.$J.extend({}, this.defaults);

		var data = this.storage.get(this.storage.key);
		if(data) {
			W.$J.extend(this.cur, JSON.parse(data));
		} else {
			// first launch - open settings page
			this.save();
			W.location='http://steamcommunity.com/groups/SteamClientBeta#swt-settings';
		}
	},
	save : function(){
		if(this.cur) {
			this.storage.set(JSON.stringify(this.cur));
		}
	},
	reset : function(){
		this.storage.del();
		this.cur = this.defaults;
	}
}

settings.load();
W.swt_settings=settings;
function t(key){
	return t.text[key] || key;
}
t.loadText = function(text){
	if(!this.text){ //first default text
		this.text=text;
	} else if(text['lang.code']==settings.cur.globalLang){
		W.$J.extend(this.text, text);
	}
}
t.loadText({  //default text
'lang.current' : 'English',
'lang.code' : 'en',
'getMoreInfo' : 'Get more Info',
'extInfo' : 'Extended Info',
'reqErr' : 'Request Error',
'checkin' : 'Check in',
'searchinforums' : 'Search in forums',
'inventory' : 'Inventory',
'profile' : 'Profile',
'trades' : 'Trades',
'chat' : 'Chat',
'more' : 'More',
'showDropsCard' : 'Show only with cards drops remaining',
'howmany' : 'How many? of ',
'save' : 'Save',
'get' : 'Get',
'checkForSend' : 'Check for send',
'sendChecked' : 'Send checked',
'showNote' : 'Show Note',
'minMarketPrice' : 'Min. Market price',
'hideDup' : 'Hide duplicates, show amount',
'go' : 'Go',
'checkAll' : 'Check all',
'deleteChecked' : 'Delete checked',
'addSubidsToCart' : 'Add SubIDs to cart',
'add' : 'Add',
'addChecked' : 'Add checked',
'cartHist' : 'Cart history',
'clearCart' : 'Clear cart',
'quickPurchase' : 'One-Click Buy to inventory (SteamWallet only)',
'giftForSend' : 'Gifts for send',
'giftForSendNote' : 'If you want to send Gifts to different Emails enter them below one per line. Gifts will be sent on the order. If quantity of gifts greater than address the remaining Gifts will be sent to the last address',
'sent' : 'Sent',
'def' : 'Default',
'getPrices' : 'Get prices for other countries (Need logout)',
'prices' : 'Prices for other countries',
'viewin' : 'View in',
'searchin' : 'Search in',
'viewMyCardsGame' : 'View my cards/badge this game',
'adding' : 'adding',
'added' : 'Added | View in cart',
'allSpecials' : 'All Specials',
'balance' : 'Balance',
'acc' : 'Account',
'acceptAllToInv' : 'Accept all to inventory',
'listed' : 'Listed: ',
'skipped' : 'Skipped: ',
'skipSent' : 'Skip gifts sent before?',
// settings page
'set.ext' : 'extension',
'set.settings' : 'Settings',
'set.homePage' : 'Home Page',
'set.global' : 'Global',
'set.lang' : 'Language',
'set.hideAccName' : 'Hide Account name. It will be displayed in the tooltip when you hover.',
'set.hideBalance' : 'Hide Wallet Balance. It will be displayed in the tooltip when you hover.',
'set.store' : 'Store',
'set.showCCBtn' : 'Show button change country',
'set.CCList' : 'Your list of countries. Enter your country first',
'set.showCartBtn' : 'Always show Cart button',
'set.cartAjax' : 'Adding to cart without reloading the page',
'set.showSubid' : 'Show SubID',
'set.showBtnGetPrices' : 'Show button "Get prices for other countries"',
'set.def' : 'Restore the default',
'set.market' : 'Community Market',
'set.marketMainPageFuncs' : 'Enable functions in main page of Community Market',
'set.FixNavbar' : 'Fix Navbar',

});
t.loadText({
﻿'lang.current' : 'Русский',
'lang.code' : 'ru',
'getMoreInfo' : 'Получить больше Информации',
'extInfo' : 'Расширенная Информация',
'reqErr' : 'Ошибка при получении данных',
'checkin' : 'Проверить на',
'searchinforums' : 'Искать на форумах',
'inventory' : 'Инвентарь',
'profile' : 'Профиль',
'trades' : 'Трэйды',
'chat' : 'Чат',
'more' : 'Ещё',
'showDropsCard' : 'Показать с невыпавшими картами',
'howmany' : 'Сколько выбрать? из ',
'save' : 'Сохранить',
'get' : 'Получить',
'checkForSend' : 'Выбрать для отправки',
'sendChecked' : 'Отправить выбранные',
'showNote' : 'Посмотреть заметку',
'minMarketPrice' : 'Мин цена на маркете',
'hideDup' : 'Прятать дубликаты, показывая кол-во',
'go' : 'Перейти',
'checkAll' : 'Выбрать все',
'deleteChecked' : 'Удалить выбранные',
'addSubidsToCart' : 'Добавить SubID\'ы в корзину',
'add' : 'Добавить',
'addChecked' : 'Добавить выбранные',
'cartHist' : 'История корзины',
'clearCart' : 'Очистить Корзину',
'quickPurchase' : 'Купить в инвентарь за один клик (только со Steam Кошелека)',
'giftForSend' : 'Гифты для отправки',
'giftForSendNote' : 'Если хотите отправить гифты на разные Email введите их ниже по одному на строку. Гифты будут отправленны по порядку. Если гифтов больше чем адресов, оставшиеся гифты будут отправлены на последний адрес',
'sent' : 'Отправлен',
'def' : 'По умолчанию',
'getPrices' : 'Получить цены для других стран (Нужно выйти из аккаунта)',
'prices' : 'Цены для других стран',
'viewin' : 'Посмотреть на',
'searchin' : 'Искать на',
'viewMyCardsGame' : 'Посмотреть мои карты/значек этой игры',
'adding' : 'добавление',
'added' : 'Добавлено | Корзина',
'allSpecials' : 'Все спец. предложения',
'balance' : 'Баланс',
'acc' : 'Аккаунт',
'acceptAllToInv' : 'Принять все в инвентарь',
'listed' : 'Выставлено: ',
'skipped' : 'Пропущено: ',
'skipSent' : 'Пропустить отправленные ранее?',
// settings page
'set.ext' : 'расширение',
'set.settings' : 'Настройки',
'set.homePage' : 'Домашняя страница',
'set.global' : 'Глобальные',
'set.lang' : 'Язык',
'set.hideAccName' : 'Скрывать имя аккаунта. Будет показываться в подсказке при наведении',
'set.hideBalance' : 'Скрывать баланс кошелька. Будет показываться в подсказке при наведении',
'set.store' : 'Магазин',
'set.showCCBtn' : 'Показывать кнопку переключения страны',
'set.CCList' : 'Ваш список стран. Вашу страну укажите первой',
'set.showCartBtn' : 'Показывать кнопку корзины, даже если она пуста',
'set.cartAjax' : 'Добавлять в корзину без перезагрузки страницы',
'set.showSubid' : 'Отображать номер подписки',
'set.showBtnGetPrices' : 'Показывать кнопку получения цен для других стран',
'set.def' : 'Восстановить по умолчанию',
'set.market' : 'Торговая Площадка',
'set.marketMainPageFuncs' : 'Включить надстройку на главной странице торговой площадки',
'set.FixMenuBar' : 'Зафиксировать Меню Навигации',

});
t.loadText({
'lang.current' : '简体中文',
'lang.code' : 'zh-cn',
'getMoreInfo' : '获取更多信息',
'extInfo' : '详细信息',
'reqErr' : '请求失败',
'checkin' : '查询声誉',
'searchinforums' : '搜索论坛',
'inventory' : '查询库存',
'profile' : '查询资料',
'trades' : '查询交易',
'chat' : '聊天',
'more' : '更多',
'showDropsCard' : '只查看可掉卡游戏',
'howmany' : '多少个? 总共 ',
'save' : '保存',
'get' : '获取',
'checkForSend' : '选中',
'sendChecked' : '发送所选',
'showNote' : '显示备忘',
'minMarketPrice' : '最低市场价格',
'hideDup' : '合并重复项并显示数量',
'go' : '跳转',
'checkAll' : '全选',
'deleteChecked' : '删除选中',
'addSubidsToCart' : '添加 SubIDs 到购物车',
'add' : '添加',
'addChecked' : '添加选中',
'cartHist' : '购物车历史记录',
'clearCart' : '清空购物车',
'quickPurchase' : '一键购买到库存 (只支持 Steam 钱包)',
'giftForSend' : '准备发送的礼物',
'giftForSendNote' : '如果想给不同的 Email 地址发送礼物,请在下框中每行填写一个 Email. 礼物将按顺序发送. 如果礼物数量大于 Email 地址数, 余下的礼物将被全部发送到最后一个地址.',
'sent' : '已发送',
'def' : '默认',
'getPrices' : '获取其他地区的价格 (需要登出)',
'prices' : '其他地区价格',
'viewin' : '查询',
'searchin' : '搜索',
'viewMyCardsGame' : '查看该游戏的卡片/徽章',
'adding' : '正在添加',
'added' : '已添加 | 在购物车中查看',
'allSpecials' : '所有促销',
'balance' : '余额',
'acc' : '账户',
'acceptAllToInv' : '接受全部并加入库存',
// settings page
'set.ext' : '扩展',
'set.settings' : '设置',
'set.homePage' : '主页',
'set.global' : '全局',
'set.lang' : '语言',
'set.hideAccName' : '隐藏帐号. 鼠标停留在[帐号]上时显示.',
'set.hideBalance' : '隐藏余额. 鼠标停留在[余额]上时显示.',
'set.store' : '商店',
'set.showCCBtn' : '显示区域切换按钮(需要登出)',
'set.CCList' : '区域列表. 将主区域放在第一位.',
'set.showCartBtn' : '总是显示购物车按钮',
'set.cartAjax' : '添加到购物车时不重新加载页面',
'set.showSubid' : '显示 SubID',
'set.showBtnGetPrices' : '显示 "获取其他地区的价格" 按钮(需要登出)',
'set.def' : '恢复默认',

});


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

var scripts = [
	{
		match:[
			'https?://store\\.steampowered\\.com/cart.*',
		],
		run:function(){
﻿// block
function createBlock(title, links){
	var out='<h2>'+title+'</h2><div class="block"><div class="block_content">';

	var link;
	for (var i=0; i < links.length; i++) {
		link = links[i];
		out+='<a class="btn_small btnv6_blue_hoverfade" href="'+link.href+'"'+(link.blank ? ' target="_blank"':'')+'><span>'+link.text+'</span></a><br/>'
	}

	out+='<br/><h2>'+t('addSubidsToCart')+'</h2> <form id="addtocartsubids" method="post"><input type="hidden" name="sessionid" value="'+W.g_sessionID+'"><input type="hidden" name="action" value="add_to_cart"><input type="text" name="subids" placeholder="1, 2, 3"/><input type="submit" value="'+t('add')+'" class="btn_small btnv6_blue_hoverfade"></form><br><form id="formcarthist" method="post"><input type="submit" value="'+t('addChecked')+'" style="float:right" class="btn_small btnv6_blue_hoverfade"><h2>'+t('cartHist')+'</h2><input type="hidden" name="sessionid" value="'+W.g_sessionID+'"><input type="hidden" name="action" value="add_to_cart">';
	
	var cartHistory = W.localStorage['swtcarthistory'] && JSON.parse(W.localStorage['swtcarthistory']) || [];
	var chStr = '';
	for(var i=0; i<cartHistory.length; i++) {
		chStr = '<input type="checkbox" name="subid[]" value="'+cartHistory[i].subid+'">  <a href="/'+(cartHistory[i].link || 'sub/'+cartHistory[i].subid)+'/">'+(cartHistory[i].name || 'SubID: '+cartHistory[i].subid)+'</a><br>[<a href="/sub/'+cartHistory[i].subid+'/">'+cartHistory[i].subid+'</a>] ('+(cartHistory[i].price || 'N/A')+')<br><br>' + chStr;
	}

	out += chStr + '</form></div></div>';

	return out;
}

var $ = W.$J; // jQuery

var el = document.querySelector('.page_content > .rightcol');

var cookie_date = new Date();
cookie_date.setTime(cookie_date.getTime()-1);

links = [
	{href:'javascript:document.cookie=\'shoppingCartGID=; path=/; expires='+cookie_date.toGMTString()+'\'; location.href=\'/cart/\';', text:t('clearCart')},
	{href:'https://store.steampowered.com/checkout/?purchasetype=gift#quick',blank:1, text:t('quickPurchase')},
];

el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));

$('#addtocartsubids').bind('submit',function(){
	var t = $(this),
		subids = t.find('input[name="subids"]').val(),
		s,
		cartHistory = W.localStorage['swtcarthistory'] && JSON.parse(W.localStorage['swtcarthistory']) || [];
		
	subids = subids.split(',');
	for (var i=0; i < subids.length; i++) {
		s = subids[i].trim();
		t.append('<input type="hidden" name="subid[]" value="'+s+'"/>');
		
		cartHistory.push({subid: s});
	}
	while(cartHistory.length>20){
		cartHistory.shift();
	}
	W.localStorage['swtcarthistory'] = JSON.stringify(cartHistory);
})
		}
	},
	{
		match:[
			'https?://store\\.steampowered\\.com/checkout/\\?purchasetype=.+',
		],
		run:function(){
W.$('accept_ssa').checked=true;
W.$('verify_country_only').checked=true;

if(W.$('send_self')){
	W.$('send_self').checked=true;
	W.$('send_self').onchange();
}
		}
	},
	{
		match:[
			'https?://store\\.steampowered\\.com/checkout/\\?purchasetype=gift.*',
		],
		run:function(){
﻿if(W.location.hash!="#quick")
	return;

var FinalizeTransaction_old = W.FinalizeTransaction;
W.FinalizeTransaction = function(){
	W.$('accept_ssa').checked=true;
	return FinalizeTransaction_old.apply(this, arguments);
}

var OnGetFinalPriceSuccess_old = W.OnGetFinalPriceSuccess;
W.OnGetFinalPriceSuccess = function(){
	var res = OnGetFinalPriceSuccess_old.apply(this, arguments);
	W.FinalizeTransaction();
	return res;
}

W.InitializeTransaction();
		}
	},
	{
		match:[
			'https?://store\\.steampowered\\.com/checkout/sendgift/.*',
			'https?://store\\.steampowered\\.com/checkout/\\?purchasetype=gift.*'

		],
		run:function(){
﻿var divs = document.querySelectorAll('.friend_block.disabled');
if(!divs) return;
var rbtns = document.querySelectorAll('.friend_block_radio input[disabled]');
for (var i=0; i < divs.length; i++){
	divs[i].removeClassName('disabled');
	rbtns[i].disabled = false;
}

if(W.location.hash && W.location.hash.substr(1,9)=='multisend'){
	var gifts = W.location.hash.substr(11,W.location.hash.lenght);
	gifts = JSON.parse(decodeURIComponent(gifts));
	var el=document.querySelector('.checkout_tab');
	var gids=[], names=[], str='', i=0;
	for(var x in gifts){
		gids.push(x);
		names.push(gifts[x]);
		str+='<p>'+gifts[x]+' <span id="giftN'+i+'"></span></p>';
		i++;
	}
	el.innerHTML='<p><b>'+t('giftForSend')+': '+gids.length+'</b></p>'+str+'';

	W.$('email_input').insertAdjacentHTML("afterEnd",
		'<br/><br/>'+t('giftForSendNote')+'<br/><textarea id="emails" rows=3></textarea>'
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

		W.$('giftN'+curGift).innerHTML='- '+t('sent');

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


		}
	},
	{
		match:[
			'https?://store\\.steampowered\\.com/.*',
		],
		run:function(){
﻿function init() {

	// for age check
	if(W.location.pathname.indexOf('/agecheck')===0){
		document.cookie='birthtime=-1704124799; expires=21-Dec-2025 00:00:00 GMT; path=/';
		W.location.reload();
	}

	if(settings.cur.globalHideWalletBalance){
		var el = W.$J('#header_wallet_balance')[0];
		if(el){
			el.title = el.innerHTML;
			el.innerHTML = '['+t('balance')+']';
		}
	}

	if(settings.cur.storeShowCartBtn){
		var el = W.$J('#store_header_cart_btn');
		if(el.length){
			el.css('display','block');
		}
	}

	// cc switcher
	if(settings.cur.storeShowCCbtn) {
		var global_action_menu = document.getElementById('global_action_menu');
		if(global_action_menu) {
			var curCC = false;
			if(curCC = document.cookie.match(/fakeCC=(\w+?);/i)){
				curCC = curCC[1];
			}
			var changeCCmenuHTML = '\
			<style>#cc_menu_btn{min-width:59px;z-index:999;position:fixed;right:0;top:0;background-color:#000;opacity:0.5;}#cc_menu_btn:hover{opacity:1}#cc_list .popup_menu_item{white-space:nowrap}</style>\
			<span class="pulldown" id="cc_menu_btn" onclick="ShowMenu(this, \'cc_menu\', \'left\', \'bottom\', true);">CC'+(curCC ?': <img src="http://cdn.steamcommunity.com/public/images/countryflags/'+curCC.toLowerCase()+'.gif" /> '+curCC:'')+' </span>\
	<div class="popup_block_new" id="cc_menu" style="display:none;">\
	<div class="popup_body popup_menu shadow_content" id="cc_list"></div></div>';

			global_action_menu.insertAdjacentHTML('afterBegin', changeCCmenuHTML);

			_cc.updHTMLccList(curCC);
		}
	}

	// for app/sub page
	var res = String(W.location.href).match(/\/(sub|app)\/(\d+)/i);
	if(res){

		var itemType = res[1], itemId = res[2];

		var els = document.querySelectorAll('.game_area_purchase_game');
		if(settings.cur.storeShowSubid || settings.cur.storeShowBtnGetPrices){
			var subid, el, subs=[], tmp;
			for(var i=0; i < els.length; i++){
				el = els[i].querySelector('input[name="subid"]');
				if(!el) continue;
				subid = el.value;
				el = el.parentElement.parentElement
				if(settings.cur.storeShowSubid) {
					el.insertAdjacentHTML('beforeEnd', '<div>Subscription id = <a href="http://steamdb.info/sub/'+subid+'">'+subid+'</a></div>');
				}
				if(settings.cur.storeShowBtnGetPrices) {
					tmp = W.$J('<div><a onclick="getPrices(event, \''+itemType+'\', '+itemId+');return false" href="#getPrices">'+t('getPrices')+'</a></div>');
					el = W.$J(el).append(tmp);
					subs.push({subid:subid,el:tmp[0]});
				}
			}
			if(settings.cur.storeShowBtnGetPrices) W.getPrices = function(e, itemType, itemId){

				function getPrice(cc){
					var reqUrl = 'http://store.steampowered.com/api/';

					reqUrl += ((itemType=='app')
						? 'appdetails/?filters=basic,price_overview,packages&v=1&appids='
						: 'packagedetails/?filters=basic,price_overview,packages&v=1&packageids='
					)

					reqUrl += itemId+'&cc='+cc;

					W.$J.ajax( {
						url: reqUrl,
						method: 'get'
					}).done(function( data ) {
						var s='';

						if(data[itemId].success){
							var data = data[itemId].data;
							var price = data.price_overview || data.price;

							if(price.discount_percent>0){
								s += '<s>'+(price.initial/100)+'</s> <span class="discount_pct">-'+price.discount_percent+'%</span> ';
							}

							s += '<b>'+(price.final/100)+'</b> '+price.currency;

							if(data.packages)
								s += ' (subID:<a href="http://steamdb.info/sub/'+data.packages[0]+'">'+data.packages[0]+'</a>)';
							// for non-main subs
							try{
								var pg = data.package_groups[0].subs;
								if(pg.length>1){
									for(var i=1;i<pg.length;i++){
										var tmp = pg[i].option_text.match(/- \D*(\d+(?:[.,]\d{2})?)/i);
										document.querySelector('.swt_price_'+i+'_'+cc+'>span').innerHTML = '<b>'+tmp[tmp.length-1]+'</b> '+price.currency+' (subID:<a href="http://steamdb.info/sub/'+pg[i].packageid+'">'+pg[i].packageid+'</a>)';
									}
								}
							}catch(e){};
						} else {
							s+='N/A';
						}
						document.querySelector('.swt_price_0_'+cc+'>span').innerHTML = s;
					});
				}


				for(var k=0; k < subs.length; k++) {
					var str = t('prices')+':';
					for(var i=0; i < _cc.ListA.length; i++){
						str += '<div class="swt_price_'+k+'_'+_cc.ListA[i]+'"><a href="?cc='+_cc.ListA[i]+'"><img src="http://cdn.steamcommunity.com/public/images/countryflags/'+_cc.ListA[i]+'.gif" style="width:16px"/> '+_cc.ListA[i].toUpperCase()+'</a> <span>...</span></div>';

					}
					subs[k].el.innerHTML = str;
				}
				for(var i=0; i < _cc.ListA.length; i++){
					getPrice(_cc.ListA[i]);
				}
				setTimeout(function(){getPrice(_cc.curCC)}, 3500); // set default CC


				return false;
			}

		}
		var gamenameEl = document.querySelector('.game_title_area .pageheader');
		if (!gamenameEl){
			gamenameEl = document.querySelector('.game_title_area .apphub_AppName');
		}
		var gamename = encodeURIComponent(gamenameEl.textContent.trim());

		var el = document.querySelector('.rightcol.game_meta_data');

		links = [
			{href:'http://steamdb.info/'+itemType+'/'+itemId+'/', icon:'https://steamdb.info/static/logos/favicon-16x16.png', text: t('viewin')+' SteamDB.info'},
			{href:'http://www.steamprices.com/'+_cc.curCC.toLowerCase()+'/'+itemType+'/'+itemId, icon:'https://www.steamprices.com/assets/images/favicons/favicon-16x16.png?v=a', text: t('viewin')+' SteamPrices.com'},
			{href:'http://plati.ru/asp/find.asp?agent=111350&searchstr='+gamename, icon:'http://plati.ru/favicon.ico', text: t('searchin')+' Plati.ru'},
			{href:'http://steampub.ru/search/'+gamename, icon:'http://steampub.ru/favicon.ico', text: t('searchin')+' SteamPub.ru'},
		];

		if(itemType=='app'){
			links.push({href:'http://steamcommunity.com/my/gamecards/'+itemId, icon:'http://store.akamai.steamstatic.com/public/images/v6/ico/ico_cards.png', text: t('viewMyCardsGame')})
		}

		el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));

		// ajax add to cart | cart history
		var addToCart_old = W.addToCart;
		W.addToCart = function(subid){
			var form = W.$J('[name="add_to_cart_'+subid+'"]');
			var el=form.parent();
			
			var cartHistory = W.localStorage.swtcarthistory && JSON.parse(W.localStorage.swtcarthistory) || [];
			if(cartHistory.length>=20) cartHistory.shift();
			cartHistory.push({
				subid: subid,
				name: el.find('h1').text().match(/\S+\s(.+)/i)[1],
				price: el.find('.game_purchase_price.price').text().trim() || el.find('.discount_final_price').text().trim(),
				link: itemType+'/'+itemId
			});
			W.localStorage.swtcarthistory = JSON.stringify(cartHistory);
			
			if(settings.cur.storeCartAjax){
				el.find('.game_purchase_action_bg .btn_addtocart:last>a').after('<a id="swtcartdone" href="#">'+t('adding')+'</a>');
				W.$J.ajax({
					url: form.attr('action'),
					type: 'POST',
					data: {subid:subid, action:'add_to_cart', sessionid:W.g_sessionID}
				}).done(function(data){
					el.find('#swtcartdone').css('background-image','none').text('✔ '+t('added')).attr('href','/cart/');
				});
			} else {
				return addToCart_old.apply(this, arguments);
			}
		};

	} else {
		W.$J('a.btn_small_tall[href^="http://store.steampowered.com/search/?specials=1"]').after('<a class="btnv6_blue_hoverfade btn_small_tall" href="http://steamdb.info/sales/"><span>'+t('allSpecials')+' - SteamDB.Info</span></a>');
	}


};

_cc = {
	curCC : false,
	updHTMLccList : function(curCC){
		var s='';
		_cc.ListA = settings.cur.storeCCList.split(' ');
		for(var i=0; i < _cc.ListA.length; i++){
			s += '<a class="popup_menu_item" href="'+_cc.url+_cc.ListA[i]+'"><img src="http://cdn.steamcommunity.com/public/images/countryflags/'+_cc.ListA[i]+'.gif" style="width:16px"/> '+_cc.ListA[i].toUpperCase()+'</a>';
		}

		document.getElementById('cc_list').innerHTML=s;
		if (curCC)
			_cc.curCC=curCC
		else
			_cc.curCC=_cc.ListA[0];
	}
};

_cc.url = String(W.location);
if (_cc.url.indexOf('?')==-1) {
	_cc.url += '?';
} else {
	_cc.url = _cc.url.replace(/\?.+/, '?');
}
_cc.url += 'cc=';

W._cc=_cc;


// block with links on app/sub page
function createBlock(title, links){
	var out='<div class="block">\
<div class="block_header"><h4>'+title+'</h4></div>\
<div class="block_content"><div class="block_content_inner">';

	var link;
	for (var i=0; i < links.length; i++) {
		link = links[i];
		out+='<div class="game_area_details_specs"><div class="icon"><a href="'+link.href+'"><img style="height:16px" src="'+link.icon+'"></a></div><a class="name" href="'+link.href+'">'+link.text+'</a></div>';

	}

	out+='</div></div></div>';
	return out;
}

init();

		}
	},
	{
		match:[
			'https?://steamcommunity\\.com/id/[^/]+/?',
			'https?://steamcommunity\\.com/profiles/\\d+/?',
		],
		run:function(){
﻿var $ = W.$J, steamid;

function profilePageInit(){

	steamid = W.g_rgProfileData.steamid;

	var profilesLinks = [
		{
			href: 'http://check.csmania.ru/#steam:'+steamid,
			icon: 'http://check.csmania.ru/favicon.ico',
			text: t('checkin')+' Check.CSMania.RU',
		},
		{
			href: 'http://steamrep.com/profiles/'+steamid,
			icon: 'http://steamrep.com/favicon.ico',
			text: t('checkin')+' SteamRep.com',
		},
		{hr:true},
		{
			href: 'http://forums.steamrep.com/search/search?keywords='+steamid,
			icon: 'http://steamrep.com/favicon.ico',
			text: t('searchinforums')+' SteamRep.com',
		},
		{
			href: 'http://www.google.com/#q='+steamid+' inurl:sourceop.com',
			icon: 'http://forums.sourceop.com/favicon.ico',
			text: t('searchinforums')+' SourceOP.com',
		},
		{
			href: 'http://www.steamtrades.com/user/id/'+steamid,
			icon: 'http://www.steamgifts.com/favicon.ico',
			text: t('profile')+' SteamGifts.com',
		},
		{hr:true},
		{
			href: 'http://backpack.tf/profiles/'+steamid,
			icon: 'http://backpack.tf/favicon_440.ico',
			text: t('inventory')+' Backpack.tf',
		},
		{
			href: 'http://tf2b.com/tf2/'+steamid,
			icon: 'http://tf2b.com/favicon.ico',
			text: t('inventory')+' TF2B.com',
		},
		{
			href: 'http://tf2outpost.com/backpack/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon_440.ico',
			text: t('inventory')+' TF2OutPost.com',
		},
		{hr:true},
		{
			href: 'http://tf2outpost.com/user/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon_440.ico',
			text: t('trades')+' TF2OutPost.com',
		},
		{
			href: 'http://dota2lounge.com/profile?id='+steamid,
			icon: 'http://dota2lounge.com/favicon.ico',
			text: t('trades')+' Dota2Lounge.com',
		},
		{
			href: 'http://csgolounge.com/profile?id='+steamid,
			icon: 'http://csgolounge.com/favicon.ico',
			text: t('trades')+' CSGOLounge.com',
		},
		{hr:true},
		{
			href: 'http://steammoney.com/trade/user/'+steamid,
			icon: 'http://steammoney.com/favicon.ico',
			text: t('profile')+' SteamMoney.com',
		},
		{
			id:   'inv_spub',
			href: 'http://steampub.ru/user/'+steamid,
			icon: 'http://steampub.ru/favicon.ico',
			text: t('profile')+' SteamPub.ru',
		},
		{hr:true}

	];


	// Styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>#swt_info{position:absolute;top:201px}</style>'
	);


	$('.profile_header').append('<div id="swt_info">SteamID64: <a href="http://steamcommunity.com/profiles/'+steamid+'">'+steamid+'</a> | <a href="#getMoreInfo" onclick="getMoreInfo();return false">'+t('getMoreInfo')+'</a></div>');

	W.getMoreInfo = function() {
		var Modal = W.ShowDialog(t('extInfo'), $('<div id="swtexinfo"><img src="http://cdn.steamcommunity.com/public/images/login/throbber.gif"></div>'));
		W.setTimeout(function(){Modal.AdjustSizing();},1);
		$.ajax({
			url: W.location.href+'?xml=1',
			context: document.body,
			dataType: 'xml'
		}).done(function(responseText, textStatus, xhr) {
			var xml = $(xhr.responseXML);
			var isLimitedAccount = xml.find('isLimitedAccount').text();
			var tradeBanState = xml.find('tradeBanState').text();
			var vacBanned = xml.find('vacBanned').text();
			var accCrDate = xml.find('memberSince').text();

			// calc STEAMID
			var steamid2 = parseInt(steamid.substr(-10),10);
			var srv = steamid2 % 2;
			var accountid = steamid2 - 7960265728;
			steamid2 = "STEAM_0:" + srv + ":" + ((accountid-srv)/2);


			$('#swtexinfo').html(
				'<table>'+
				'<tr><td><b>CommunityID</b></td><td>'+steamid+'</td>'+
				'<tr><td><b>SteamID</b></td><td>'+steamid2+'</td>'+
				'<tr><td><b>AccountID</b></td><td>'+accountid+'</td>'+
				'<tr><td><b>Registration date</b></td><td>'+accCrDate+'</td>'+
				'<tr><td><b>VAC</b></td><td>'+(vacBanned=='0'?'Clear':'Banned')+'</td>'+
				'<tr><td><b>Trade Ban</b></td><td>'+tradeBanState+'</td>'+
				'<tr><td><b>Is Limited Account</b></td><td>'+(isLimitedAccount=='0'?'No':'Yes')+'</td>'+
				'</table>'
			);
			W.setTimeout(function(){Modal.AdjustSizing();},1);
		}).fail(function(){
			$('#swtexinfo').html(t('reqErr'));
		});
	};


	// chat button
	try {
		var pm_btn = $('.profile_header_actions>a.btn_profile_action[href^="javascript:LaunchWebChat"]')[0];
		pm_btn.outerHTML='<span class="btn_profile_action btn_medium"><span><a href="steam://friends/message/'+steamid+'">'+t('chat')+': Steam</a> | <a href="'+pm_btn.href+'">Web</a></span></span>';
	} catch(e) {};

	// Games link - tab all games
	var el = document.querySelector('.profile_count_link a[href$="games/"]');
	if(el) el.href+='?tab=all';
	// inventory links
	el = document.querySelector('.profile_count_link a[href$="inventory/"]');
	if(el)
		el.insertAdjacentHTML('afterEnd', ': <span class="linkActionSubtle"><a title="Steam Gifts" href="'+el.href+'#753_1"><img src="http://www.iconsearch.ru/uploads/icons/basicset/16x16/present_16.png"/></a> <a title="Steam Cards" href="'+el.href+'#753_6"><img width="26" height="16" src="http://store.akamai.steamstatic.com/public/images/ico/ico_cards.png"/></a> <a title="TF2" href="'+el.href+'#440"><img src="http://media.steampowered.com/apps/tf2/blog/images/favicon.ico"/></a> <a title="Dota 2" href="'+el.href+'#570"><img src="http://www.dota2.com/images/favicon.ico"/></a> <a title="CSGO" href="'+el.href+'#730"><img src="http://blog.counter-strike.net/wp-content/themes/counterstrike_launch/favicon.ico"/></a></span>');


	var out = '', link;
	for (var i=0; i < profilesLinks.length; i++){
		link = profilesLinks[i];

		if (link.hr) {
			out +='<hr/>';
		} else {
			out += '<a class="popup_menu_item" href="'+link.href+'"><img style="width:18px;height:18px" src="'+link.icon+'"> '+link.text+'</a>';
		}

	}
	try {
		document.querySelector('#profile_action_dropdown>.popup_body.popup_menu').insertAdjacentHTML("afterBegin", out);
	} catch(err) {
		// "More" button for self profile
		$('.profile_header_actions').append('<span class="btn_profile_action btn_medium" onclick="ShowMenu(this,\'profile_action_dropdown\',\'right\')"><span>'+t('more')+' <img src="http://cdn.steamcommunity.com/public/images/profile/profile_action_dropdown.png"/></span></span><div class="popup_block" id="profile_action_dropdown" style="visibility:visible;display:none"><div class="popup_body popup_menu">'+out+'</div></div>')
	}

}

if (W.g_rgProfileData) {
	profilePageInit();
}
		}
	},
	{
		match:[
			'https?://steamcommunity\\.com/id/.+?/inventory.*',
			'https?://steamcommunity\\.com/profiles/\\d+/inventory.*',
		],
		run:function(){
var $ = W.$J;

function inventoryPageInit(){
	// for subid detect
	var ajaxTarget = {descriptions:[]};

	W.getSubid = function(target, itemid){
		ajaxTarget.element = target;

		var item = W.UserYou.rgContexts[753][1].inventory.rgInventory[itemid];

		ajaxTarget.classid = item.classid;
		ajaxTarget.giftId = itemid;
		ajaxTarget.giftName = encodeURIComponent(item.name);

		new W.Ajax.Request( 'http://steamcommunity.com/gifts/' + ajaxTarget.giftId + '/validateunpack', {
			method: 'post',
			parameters: { sessionid: W.g_sessionID },
			onSuccess: function( transport ) {
				W.setSubID(transport.responseJSON.packageid);
			}
		});
	}

	W.setSubID=function(subid){
		var str = 'SubscriptionID = <a href="http://steamdb.info/sub/'+subid+'">'+subid+'</a>';
		ajaxTarget.element.outerHTML=str;
		var ds = ajaxTarget.descriptions[ajaxTarget.classid];
		ds[ds.length-1]={value:str};
		ds.withSubid=true;
	}


	// styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>.checkedForSend{background:#366836!important}.itemcount{background:#292929;color:#FFF;font-weight:700;position:absolute;right:0;bottom:0}.swt_icon{position:absolute;top:0;left:0}.swt_icon-st{background:#CF6A32;color:#fff}.swt_icon-t{background:#FDEC14;color:#000}#inventory_logos{display:none}#swt_subItemsSpoiler,.swt_hidden{display:none}</style>'
	);

	// multi gifts sending
	W.checkedForSend={};
	W.checkForSend = function(giftId){
		var item = W.g_ActiveInventory.selectedItem;
		if(item.checkedForSend){
			item.checkedForSend=false;
			item.element.removeClassName('checkedForSend');
			if(item._amount>1){
				for(var i=0;i<item._amount;i++){
					delete W.checkedForSend[item._ids[i]];
				}
			} else {
				delete W.checkedForSend[giftId];
			}

		} else {
			var amount = 1;
			if(item._amount>1) {
				amount =  parseInt(prompt(t('howmany')+item._amount, item._amount)) || 1;
				if (amount>item._amount)
					amount=item._amount;
			}
			if(amount>1){
				if(!confirm(t('Skip sent?'))) for(var i=0;i<amount;i++){
					W.checkedForSend[item._ids[i]]=item.name;
					item._subItems[i].element.addClassName('checkedForSend');
				}
				else for(var i=0;i<amount;i++){
					var sitem = item._subItems[i],
						skipit = false;
					if(sitem.owner_descriptions) for(var j=0;j<sitem.owner_descriptions.length;j++){
						if(sitem.owner_descriptions[j].value.indexOf('<persona>')>=0){
							skipit = true;
							break;
						}
					}
					if(!skipit) {
						W.checkedForSend[item._subItems[i].id]=item.name;
						item._subItems[i].element.addClassName('checkedForSend');
					}
				}
			} else {
				W.checkedForSend[giftId]=item.name;
			}

			item.checkedForSend=true;
			item.element.addClassName('checkedForSend');

		}
	}
	W.sendChecked = function(){
		var url = 'http://store.steampowered.com/checkout/sendgift/';
		// first to gid
		for(var gid in W.checkedForSend){
			break;
		}

		url+=gid+'#multisend='+encodeURIComponent(JSON.stringify(W.checkedForSend));

		W.location.href=url;

	}
	// END multi gifts sending


	if(W.g_bViewingOwnProfile){

		//// gifts notes
		var giftsNotes = W.localStorage.giftsNotes;
		if(giftsNotes)
			giftsNotes = JSON.parse(giftsNotes);
		else giftsNotes={};
		W.loadGiftNote = function(){
			var gid = W.g_ActiveInventory.selectedItem.id;
			if(!$('#iteminfo'+W.iActiveSelectView+'_item_tags_content textarea.giftnote').length)
				$('#iteminfo'+W.iActiveSelectView+'_item_tags_content').append('<br/><textarea class="giftnote" style="width:100%">'+(giftsNotes[gid]||'')+'</textarea><button onclick="saveGiftNote(\''+gid+'\')">'+t('save')+'</button>');
		}
		W.saveGiftNote = function(gid){
			giftsNotes[gid]=$('#iteminfo'+W.iActiveSelectView+'_content textarea.giftnote').val();
			W.localStorage.giftsNotes = JSON.stringify(giftsNotes);
		}

		// accept all gifts Btn
		var el = $('div.pending_gift:first');
		if(el.length){
			el.before('<a id="swt_acceptAllGifts" class="btn_darkblue_white_innerfade btn_medium new_trade_offer_btn" href="#"><span>'+t('acceptAllToInv')+'</span></a>');
			$('#swt_acceptAllGifts').click(function(){
				var pg = $('div.pending_gift');
				if(pg.length){
					var gid;
					pg=pg.find('>div[id^="pending_gift_"]');
					for(var i=0; i<pg.length; i++){
						gid = pg[i].id.split('_')[2];
						DoAcceptGift(gid, false);
					}
				}
			});
		}
	}

	//// action for gifts and items
	var BuildHover_orig = W.BuildHover;
	W.BuildHover = function(){
		var item = arguments[1];
		// gifts
		if(W.g_ActiveInventory && (W.g_ActiveInventory.appid == 753)){
			if ((item.contextid==1) && !item.descriptions.withClassid) {
				item.descriptions.withClassid=true;

				if(!item.descriptions)
					item.descriptions = [];

				item.descriptions.push({value:'ClassID = '+item.classid});
				if(W.g_bViewingOwnProfile)
					item.descriptions.push({value:'<a href="#" onclick="getSubid(event.target,\''+item.id+'\');return false">'+t('get')+' SubscriptionID</a>',type:'html'});

				if(!ajaxTarget.descriptions[item.classid])
					ajaxTarget.descriptions[item.classid] = item.descriptions;


				if(item.owner_actions) {
					item.owner_actions.push({
						link:'javascript:checkForSend("%assetid%")',
						name:t('checkForSend')
					});
					item.owner_actions.push({
						link:'javascript:sendChecked()',
						name:t('sendChecked')
					});
					item.owner_actions.push({
						link:'javascript:loadGiftNote()',
						name:t('showNote')
					});
				}
			}
		}
		if(item._amount>1){
			$('#swt_subItemsSpoiler .swt_hidden').hide().empty().append(item._subItems);
			$('#swt_subItemsSpoiler #swt_subItemsMore').text(item._amount-1);
			$('#swt_subItemsSpoiler').show();
		} else{
			$('#swt_subItemsSpoiler').hide();
		}
		return BuildHover_orig.apply(this, arguments);
	}


	//// View in Market Button
	// for foreign inventory
	if (!W.g_bViewingOwnProfile){
		var PopulateMarketActions_orig = W.PopulateMarketActions;
		W.PopulateMarketActions = function (elActions, item) {
			var res = PopulateMarketActions_orig.apply(this, arguments);
			if (!item.marketable) {
				return res;
			}
			var market_hash_name = item.market_hash_name ? item.market_hash_name : item.market_name;
			elActions.appendChild(W.CreateMarketActionButton('blue', 'http://steamcommunity.com/market/listings/'+item.appid+'/'+market_hash_name, t('minMarketPrice')+': <span id="swt_lowestItemPrice_'+item.classid+'">?</span>'));
			$(elActions).css('display', 'block');
			$.ajax( {
				url: 'http://steamcommunity.com/market/priceoverview/',
				type: 'GET',
				data: {
					country: W.g_strCountryCode,
					currency: typeof(W.g_rgWalletInfo) != 'undefined' ? W.g_rgWalletInfo['wallet_currency'] : 1,
					appid: item.appid,
					market_hash_name: market_hash_name
				}
			} ).done( function ( data ) {
				var price=t('reqErr');
				if(data.success){
					price=data.lowest_price
				}
				$('#swt_lowestItemPrice_'+item.classid).html(price);
			} ).fail(function(jqxhr) {
				$('#swt_lowestItemPrice_'+item.classid).text(t('reqErr'));
			} );


			return res;
		}
	}

	//// inv

	// hide dup witth filters
	W.Filter.UpdateTagFiltering_old = W.Filter.UpdateTagFiltering;
	W.Filter.UpdateTagFiltering = function(rgNewTags){
		if (W.localStorage.hideDupItems) {
			rgNewTags['SWT']=['notdup'];
		}
		return this.UpdateTagFiltering_old.apply(this, [rgNewTags]);
	}

	var SelectInventoryFromUser_old = W.SelectInventoryFromUser;
	W.SelectInventoryFromUser = function( user, appid, contextid, bForceSelect ){
		if (!bForceSelect) {
			return SelectInventoryFromUser_old.apply(this, arguments);
		}
		var inventory = W.UserYou.getInventory( appid, contextid );
		if(!inventory.BuildItemElement_old){
			inventory.BuildItemElement_old = inventory.BuildItemElement;
			inventory.BuildItemElement = function(){
				var el = inventory.BuildItemElement_old.apply(this, arguments);
				var fncs = this.BuildItemElement.fncs;
				for (var i=0;i<fncs.length;i++) {
					fncs[i].apply(this, [el]);
				}
				return el;
			};
			inventory.BuildItemElement.fncs=[];
		}

		if (appid==730) { //CSGO
			// Item color by Rarity
			if(!inventory.BuildItemElement.fncs.csgoItemColor) {
				inventory.BuildItemElement.fncs.csgoItemColor = true;
				inventory.BuildItemElement.fncs.push(function(el){
					var icons='<div class="swt_icon">',
						tags = el.rgItem.tags;
					for (var i=0;i<tags.length;i++) {
						switch (tags[i].category) {
							case "Quality":
								switch (tags[i].internal_name) {
									case "strange":
										icons+='<span class="swt_icon-st">ST</span>';
										break;
									case "unusual":
										el.style.borderColor='#'+tags[i].color;
										tags.colored=true;
										break;
									case "tournament":
										icons+='<span class="swt_icon-t">S</span>';
										break;
								}
								break;
							case "Rarity":
								if (!tags.colored)
									el.style.borderColor='#'+tags[i].color;
								break;
						}
					};
					el.innerHTML+=icons+'</div>';
				});
			}
		}

		if (!inventory._hiddenDup) {
			// display amount
			if(!inventory.BuildItemElement.fncs.itemcount) {
				inventory.BuildItemElement.fncs.itemcount = true;
				inventory.BuildItemElement.fncs.push(function(el){
					if (el.rgItem._dup) {
						$(el).addClass("swt_itemdup");
					}
					var a = el.rgItem._amount;
					if (!a) return;
					el.innerHTML+='<div class="itemcount">x'+a+'</div>';
				});
			}

			inventory.MakeActive_old = inventory.MakeActive;
			inventory.MakeActive = function(){
				var res = inventory.MakeActive_old.apply(this, arguments);
				if(W.localStorage.hideDupItems){
					W.Filter.rgCurrentTags['SWT']=['notdup'];
					W.Filter.OnFilterChange();
					$('.itemcount').show();
				} else {
					delete W.Filter.rgCurrentTags.SWT;
					W.Filter.rgLastTags['SWT']=['notdup'];
					W.Filter.OnFilterChange();
					$('.itemcount').hide();
				}
				return res;
			}


			var itemsA = [];

			if(inventory.rgChildInventories) {
				for(var x in inventory.rgChildInventories){
					inventory.rgChildInventories[x].BuildItemElement = inventory.BuildItemElement; // display count
					inventory.rgChildInventories[x].MakeActive = inventory.MakeActive; // display count
					itemsA.push(inventory.rgChildInventories[x].rgInventory);
				}
			} else {
				if(inventory.rgInventory)
					itemsA.push(inventory.rgInventory);
			}

			if(itemsA.length){
				inventory._hiddenDup = true;
				var items, newItems;
				for(var i=0; i<itemsA.length; i++){
					items = itemsA[i];
					newItems=[];

					for ( var j in items ){
						if(items[j]._is_stackable || items[j].is_stackable)
							continue;
						if(newItems[items[j].classid]){
							newItems[items[j].classid]._amount +=1;
							newItems[items[j].classid]._ids.push(items[j].id);
							newItems[items[j].classid]._subItems.push(items[j]);
						} else {
							items[j]._is_stackable = true;
							items[j]._amount = 1;
							items[j]._ids = [items[j].id];
							items[j]._subItems = [items[j]];

							items[j].tags.push({category: "SWT",
								category_name: "SteamWebTools",
								internal_name: "notdup",
								name: "HideDup"}
							);
							newItems[items[j].classid] = items[j];
						}
					}
				}
			}

		}

		return SelectInventoryFromUser_old.apply(this, arguments);
	}


	var HTMLHideDup = '<input type="checkbox" name="hidedup" onchange="window.onchangehidedup(event)" '+((W.localStorage.hideDupItems)?'checked="true"':'')+'/>'+t('hideDup');
	document.getElementById('inventory_pagecontrols').insertAdjacentHTML("beforeBegin", HTMLHideDup);

	W.onchangehidedup = function(e){
		if(e.target.checked){
			W.localStorage.hideDupItems = 1;
		} else {
			W.localStorage.removeItem('hideDupItems');
		}
		g_ActiveInventory.MakeActive();
	};

	//// sell dialog accept ssa checked
	$('#market_sell_dialog_accept_ssa').attr('checked',true);

	//// multisell
	W.SellItemDialog.OnConfirmationAccept_old = W.SellItemDialog.OnConfirmationAccept;
	var SellCurrentSelection_old = W.SellCurrentSelection;
	W.SellCurrentSelection = function(){
		var res = SellCurrentSelection_old.apply(this, arguments);
		var count = W.g_ActiveInventory.selectedItem._amount;

		// unbind Sell btn
		W.$('market_sell_dialog_ok').stopObserving();
		$('#market_sell_dialog_ok').unbind();

		if(count>1) {
			var amount =  parseInt(prompt(t('howmany')+count, count)) || 1;
			if (amount>count)
				amount=count;

			if(amount>1){
				W.SellItemDialog._amount=amount;
				W.SellItemDialog._itemNum=0;
				W.SellItemDialog._itemsFailNum=0;
				W.SellItemDialog.OnConfirmationAccept_new = function(event){

					W.$('market_sell_dialog_error').hide();
					W.$('market_sell_dialog_ok').fade({duration:0.25});
					W.$('market_sell_dialog_back').fade({duration:0.25});
					W.$('market_sell_dialog_throbber').show();
					W.$('market_sell_dialog_throbber').fade({duration:0.25,from:0,to:1});

					var item;
					do {
						item = W.SellItemDialog.m_item._subItems[W.SellItemDialog._itemNum];
						W.SellItemDialog._itemNum++;
					} while(!item.marketable);
					W.SellItemDialog.m_item.id=item.id;

					$.ajax( {
						url: 'https://steamcommunity.com/market/sellitem/',
						type: 'POST',
						data: {
							sessionid: W.g_sessionID,
							appid: W.SellItemDialog.m_item.appid,
							contextid: W.SellItemDialog.m_item.contextid,
							assetid: W.SellItemDialog.m_item.id,
							amount: W.SellItemDialog.m_nConfirmedQuantity,
							price: W.SellItemDialog.m_nConfirmedPrice
						},
						crossDomain: true,
						xhrFields: { withCredentials: true }
					} ).done( function ( data ) {
						$('#market_sell_dialog_item_availability_hint>.market_dialog_topwarning').text(t('listed')+W.SellItemDialog._itemNum+(W.SellItemDialog._itemsFailNum ? ' | '+t('skipped')+W.SellItemDialog._itemsFailNum : ''));
						if(W.SellItemDialog._itemNum>=W.SellItemDialog._amount)
							W.SellItemDialog.OnSuccess.apply(W.SellItemDialog, [{ responseJSON: data }])
						else {
							return W.SellItemDialog.OnConfirmationAccept_new.apply(W.SellItemDialog, arguments);
						}
					} ).fail( function( jqxhr ) {
						// jquery doesn't parse json on fail
						var data = $.parseJSON( jqxhr.responseText );
						W.SellItemDialog._itemsFailNum++;
						if(W.SellItemDialog._itemNum>=W.SellItemDialog._amount)
							W.SellItemDialog.OnFailure( { responseJSON: data } );
						else {
							return W.SellItemDialog.OnConfirmationAccept_new.apply(W.SellItemDialog, arguments);
						}
					} );

				}
				W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_new;
			} else {
				W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_old;
			}


		} else
			W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_old;
		$('#market_sell_dialog_ok').on("click", $.proxy(W.SellItemDialog.OnConfirmationAccept, W.SellItemDialog));
		//W.$('market_sell_dialog_ok').observe( 'click', W.SellItemDialog.OnConfirmationAccept.bindAsEventListener(W.SellItemDialog) );

		return res;
	}



}


if (W.g_strInventoryLoadURL) {
	inventoryPageInit();
}

		}
	},
	{
		match:[
			'https?://steamcommunity\\.com/id/.+?/gamecards/\\d+.*',
			'https?://steamcommunity\\.com/profiles/\\d+/gamecards/\\d+.*',
		],
		run:function(){
var app = W.location.pathname.match(/\/gamecards\/(\d+)/)[1];
W.$J('.gamecards_inventorylink').append('<a class="btn_grey_grey btn_small_thin" href="http://www.steamcardexchange.net/index.php?inventorygame-appid-'+app+'"><span>www.SteamCardExchange.net</span></a>');
		}
	},
	{
		match:[
			'https?://steamcommunity\\.com/id/.+?/badges.*',
			'https?://steamcommunity\\.com/profiles/\\d+/badges.*',
		],
		run:function(){
W.$J('.badge_details_set_favorite').append('<div class="btn_grey_black btn_small_thin" onclick="showWithDrop()"><span>'+t('showDropsCard')+'</span></div>');
W.showWithDrop=function(){
	W.$J('.badge_row').filter(function(i,el){
		return !(W.$J('a.btn_green_white_innerfade',el).length)
	}).remove()
	return false;
}
		}
	},
	{
		match:[
			'https?://steamcommunity\\.com/app/\\d+/guides*'
		],
		run:function(){
$J('.workshopItemCollection').wrap(function() {
	var el = $J( this )
		url = el.attr('onclick').match(/href='(.+)'/)[1];
	el.attr('onclick', false);
	return "<a href='" + url + "'></a>";
});
		}
	},
	{
		match:[
			'http://steamcommunity\\.com/market.*'
		],
		run:function(){
﻿function init(){
	if(settings.cur.globalHideWalletBalance){
		var el = W.$J('#marketWalletBalanceAmount')[0];
		if(el){
			el.title = el.innerHTML;
			el.innerHTML = '['+t('balance')+']';
		}
	}
	var el = W.$J('.pick_and_sell_button').length;
	if(el)
	{
		if(settings.cur.marketMainPageFuncs) mainPage();
	} else
	if(document.getElementById('searchResults'))
	{
		addGotoBtn();
	} else
	if(document.getElementById('largeiteminfo_item_name'))
	{
		itemPage();
	}
}

function mainPage(){
	// styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>.scrollbl{max-height:500px;overflow-y:scroll;} .lfremove{display:inline-block}</style>'
	);

	//// Remove button
	// add
	var el = document.querySelector('#tabContentsMyListings .market_home_listing_table:nth-child(1) .market_listing_edit_buttons').innerHTML='<a href="#checkAllListings" id="btnCheckAllListings" class="item_market_action_button item_market_action_button_blue"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">'+t('checkAll')+'</span><span class="item_market_action_button_edge item_market_action_button_right"></span></a> <a href="#removeListings" id="btnRemoveListings" class="item_market_action_button item_market_action_button_green"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">'+t('deleteChecked')+'</span><span class="item_market_action_button_edge item_market_action_button_right"></span></a>';

	// set function
	W.$J('#btnCheckAllListings').click(function(){
		W.$J('.lfremove').attr('checked',!W.$J('.lfremove:first')[0].checked)
		return false;
	});
	W.$J('#btnRemoveListings').click(function(){
		var data = [];

		W.$J('.lfremove').each(function(i, el){
			if(el.checked)
				data.push(el);
		});

		function run(i){
			if(i<data.length)
				new W.Ajax.Request('http://steamcommunity.com/market/removelisting/'+W.$J(data[i]).data('listingid'), {
					method: 'post',
					parameters: {
						sessionid: W.g_sessionID,
					},
					onComplete: function() {
						run(++i);
					},
					onSuccess: function() {
						data[i].parentElement.parentElement.parentElement.parentElement.remove();
					}
				});
		}
		if(data.length)
			run(0);

		return false;
	});


	// scroll table:sell
	var rows = W.$J('#tabContentsMyListings .market_home_listing_table:nth-child(1) .market_listing_row').detach();
	W.$J('.market_content_block.my_listing_section.market_home_listing_table:nth-child(1)').append('<div class="scrollbl tablesell"></div>').click;
	rows.prependTo("#tabContentsMyListings .scrollbl.tablesell");
	// scroll table:buy
	var rows = W.$J('#tabContentsMyListings .market_home_listing_table:nth-child(2) .market_listing_row').detach();
	W.$J('.market_content_block.my_listing_section.market_home_listing_table:nth-child(2)').append('<div class="scrollbl tablebuy"></div>').click;
	rows.prependTo("#tabContentsMyListings .scrollbl.tablebuy");

	W.$J('.market_listing_cancel_button a').each(function(i, el){
		var res = decodeURIComponent(String(el.href)).match(/mylisting', '(\d+)', (\d+), '(\d+)', '(\d+)'/i);
		if(res){
			W.$J(el).before('<span class="item_market_action_button_contents"><input type="checkbox" class="lfremove" data-listingid="'+res[1]+'"/></span>');
			W.$J(el).remove();
		}
	});

	/////
	function countSumListings(tableClass, resultId, useCount){
		var myListings = W.$J('#tabContentsMyListings .'+tableClass+' span.market_listing_price');
		if(myListings){

			var total = 0;
			for(var i=0; myListings.length>i; i++){
				price = parseFloat(myListings[i].innerHTML.match(/(\d+(?:[.,]\d{1,2})?)/)[1].replace(',','.'))*100;

				if(useCount) {
					i++
					price *= myListings[i].innerHTML
				}

				total += price;
			}
			W.$J('#'+resultId).append(' / '+W.v_currencyformat(total, W.GetCurrencyCode(W.g_rgWalletInfo.wallet_currency)));
		}
	}
	countSumListings('tablesell', 'my_market_selllistings_number');
	countSumListings('tablebuy', 'my_market_buylistings_number', true);

}

function itemPage(){
	//// accept ssa checked
	W.$('market_buynow_dialog_accept_ssa').checked=true;
	addGotoBtn();
	//numerate listings
	$J('#searchResultsRows .market_listing_item_name_block').each(function(i,e) {
		$J(e).prepend('<div style="float:right">#'+(i+1)+'</div>')
	});
}

function addGotoBtn(){
	W.$J("#searchResults_btn_next").after(' <input id="swt_gotopagevl" type="text" value="1" size="3"/><span class="pagebtn" id="swt_gotopagebtn">'+t('go')+'</span>');
	W.$('swt_gotopagebtn').onclick=function(){
		W.g_oSearchResults.GoToPage(W.$('swt_gotopagevl').value-1);
	}
}

init();
		}
	},
	{
		match:[
			'http://steamcommunity\\.com/groups/SteamClientBeta#swt-settings'
		],
		run:function(){
var $ = W.$J;

$('#group_tab_content_overview').show().attr('id','swt_content1');

$('head').append($('<link href="http://steamcommunity-a.akamaihd.net/public/css/skin_1/groupadmin.css" rel="stylesheet" type="text/css">'));

$('.grouppage_logo').css('background-image','none');
$('.grouppage_logo>img')[0].src='http://v1t.su/projects/steam/webtools/imgs/steam-big-icon.png';

$('.grouppage_header_label').text('Steam '+t('set.ext'));
$('.grouppage_header_name').html('Steam Web Tools <span class="grouppage_header_abbrev" style="font-size:21px">'+t('set.settings')+'</span>');
$('.grouppage_join_area a')[0].href='http://v1t.su/projects/steam/webtools/';
$('.grouppage_join_area a span').text(t('set.homePage'));
$('.grouppage_friendsingroup').remove();
$('.grouppage_member_tiles').remove();
$('.group_tabs').remove();
$('.rightcol ').remove();


var createForm = function(data){
	var res = '';
	createForm.fields = [];

	var rows, row, i, j;
	for(i=0;i<data.length;i++){
		res+=createForm.create_groupStart(data[i].group);
		rows = data[i].rows;
		for(j=0;j<rows.length;j++){
			row=rows[j];

			createForm.fields.push(row.name);

			row.value = settings.cur[row.name];

			res+='<div class="formRow">';
			res+=createForm['create_'+row.type](row);
			res+='</div>';
		}
		res+=createForm.create_groupEnd();
	}
	$('.maincontent>.leftcol ')[0].innerHTML='<form class="smallForm" id="editForm" name="editForm">'+res+'<div class="group_content_bodytext"><div class="forum_manage_actions"><a href="#swt-settings" class="btn_grey_white_innerfade btn_medium" id="swt_btnDef"><span>'+t('set.def')+'</span></a><button type="submit" class="btn_green_white_innerfade btn_medium"><span>'+t('save')+'</span></button></div></div></form>';
}
createForm.create_groupStart = function(title){
	return '<div class="group_content group_summary"><div class="formRow"><h1>'+title+'</h1></div>';
}
createForm.create_groupEnd = function(){
	return '</div>';
}
createForm.create_checkbox = function(data){
	return '<input type="checkbox"'+(data.value?' checked="checked"':'')+' name="'+data.name+'" id="'+data.name+'"><label for="'+data.name+'">'+data.title+'</label>';
}
createForm.create_select = function(data){
	var res = '<div class="formRowTitle">'+data.title+'</div><div class="formRowFields"><select name="'+data.name+'" id="'+data.name+'" class="gray_bevel">';

	var ops = data.options;
	for(var i=0;i<ops.length;i++){
		res+='<option value="'+ops[i].value+'"'+(ops[i].value==data.value ?' selected="selected"':'')+'>'+ops[i].text+'</option>';
	}

	res+='</select></div>';
	return res;
}
createForm.create_textLong = function(data){
	return '<div>'+data.title+'</div><div class="formRowFields"><div class="gray_bevel for_text_input fullwidth"><input type="text" name="'+data.name+'" id="'+data.name+'" value="'+data.value+'"></div></div>';
}

createForm([
	{
		group:t('set.global'),
		rows:[
			{
				type:'select',
				title:t('set.lang'),
				name:'globalLang',
				options:[
					{
						text : 'English',
						value : 'en'
					},
					{
						text : 'Русский',
						value : 'ru',
					},
					{
						text : '简体中文',
						value : 'zh-cn',
					},
				],
			},
			{
				type:'checkbox',
				title:t('set.FixNavbar'),
				name:'globalFixNavbar',
			},
			{
				type:'checkbox',
				title:t('set.hideAccName'),
				name:'globalHideAccName',
			},
			{
				type:'checkbox',
				title:t('set.hideBalance'),
				name:'globalHideWalletBalance',
			},
		],
	},
	{
		group:t('set.store'),
		rows:[
			{
				type:'checkbox',
				title:t('set.showCCBtn'),
				name:'storeShowCCbtn',
			},
			{
				type:'textLong',
				title:t('set.CCList'),
				name:'storeCCList',
			},
			{
				type:'checkbox',
				title:t('set.showCartBtn'),
				name:'storeShowCartBtn',
			},
			{
				type:'checkbox',
				title:t('set.cartAjax'),
				name:'storeCartAjax',
			},
			{
				type:'checkbox',
				title:t('set.showSubid'),
				name:'storeShowSubid',
			},
			{
				type:'checkbox',
				title:t('set.showBtnGetPrices'),
				name:'storeShowBtnGetPrices',
			},
		],
	},
	{
		group:t('set.market'),
		rows:[
			{
				type:'checkbox',
				title:t('set.marketMainPageFuncs'),
				name:'marketMainPageFuncs',
			}
		],
	},
]);

$('#swt_btnDef').click(function(){
	settings.reset();
	settings.save();
	if(!settings.storage.gm) {
		W.location.href="http://store.steampowered.com/about/#swt-settings-del";
	} else
		W.location.reload();
});

$("form#editForm").submit(function(event) {
	var i, f, el;
	for(i=0;i<createForm.fields.length;i++){
		f=createForm.fields[i];
		el=$('#'+f);
		settings.cur[f] = (el.prop('type')=='checkbox') ? el.prop('checked') : el.val();
	}
	settings.save();

	event.preventDefault();
	if(!settings.storage.gm) {
		W.location.href="http://store.steampowered.com/about/#swt-settings-save="+encodeURIComponent(JSON.stringify(settings.cur));
	} else
		W.location.reload();
});


		}
	},
	{
		match:[
			'http://store\\.steampowered\\.com/about/#swt-settings.*',
		],
		run:function(){
var h = W.location.hash;
if(h && h.substr(1,13)=='swt-settings-'){
	if(h.substr(14,4)=='save'){
		var data = h.substr(19);
		data = decodeURIComponent(data);
		settings.storage.set(data);
	} else if(h.substr(14,3)=='del'){
		settings.storage.del();
	}
}
W.location.href="http://steamcommunity.com/groups/SteamClientBeta#swt-settings";
		}
	}
];

var url = document.URL;
for(var i = 0; i<scripts.length; i++) {
	for(var j = 0; j < scripts[i].match.length; j++) {
		var expr = new RegExp('^'+scripts[i].match[j]+'$', 'i');
		if(expr.test(url)) {
			scripts[i].run();
			break;
		}
	}
}

