// ==UserScript==
// @name		Steam Web Tools
// @namespace	http://v1t.su/projects/steam/webtools/
// @description	Useful tools in Steam web sites
// @version		0.4.8
// @date		2015-08-12
// @author		Mr-VIT
// @homepage	http://v1t.su/projects/steam/webtools/
// @updateURL	http://mr-vit.github.io/SteamWebTools/version.js
// @icon		http://mr-vit.github.io/SteamWebTools/icon-64.png
// @run-at		document-end
// @include		http://store.steampowered.com/*
// @include		https://store.steampowered.com/*
// @include		http://steamcommunity.com/*
// @include		https://steamcommunity.com/*
// ==/UserScript==

W = unsafeWindow;
var url = document.URL;

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

	out+='<br/><h2>Добавить SubID\'ы в корзину</h2> <form id="addtocartsubids" method="post"><input type="hidden" name="sessionid" value="'+W.g_sessionID+'"><input type="hidden" name="action" value="add_to_cart"><input type="text" name="subids" placeholder="1, 2, 3"/><input type="submit" value="Добавить" class="btn_small btnv6_blue_hoverfade"></form><br><form method="post"><input type="submit" value="Добавить выбранные" style="float:right" class="btn_small btnv6_blue_hoverfade"><h2>История корзины</h2><input type="hidden" name="sessionid" value="'+W.g_sessionID+'"><input type="hidden" name="action" value="add_to_cart">';
	
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
	{href:'javascript:document.cookie=\'shoppingCartGID=; path=/; expires='+cookie_date.toGMTString()+'\'; location.href=\'/cart/\';', text:'Очистить Корзину'},
	{href:'https://store.steampowered.com/checkout/?purchasetype=gift#fastbuy',blank:1, text:'Быстро купить в инвентарь со Steam Wallet'},
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
﻿if(W.location.hash!="#fastbuy")
	return;

alert('fastbuy');

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


		}
	},
	{
		match:[
			'https?://store\\.steampowered\\.com/.*',
		],
		run:function(){
﻿function init() {

	// for age check
	if(W.location.pathname.indexOf('/agecheck')==0){
		document.cookie='birthtime=-1704124799; expires=21-Dec-2025 00:00:00 GMT; path=/';
		W.location.reload();
	}

	// cc switcher
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
<div class="popup_body popup_menu shadow_content" id="cc_list"></div></div>\
	<div class="popup_block_new" id="cc_list_edit" style="display:none;">\
	<div class="popup_body popup_menu shadow_content">\
	<input id="ccListEdit" type="text" value="'+_cc.curList+'"/><br/><a title="OK" href="#" id="cc_okbtn">[OK]</a> <a title="Default" href="#" id="cc_defbtn">[D]</a>\
	</div></div>';

		global_action_menu.insertAdjacentHTML('afterBegin', changeCCmenuHTML);

		_cc.updHTMLccList(curCC);

		document.getElementById('cc_defbtn').onclick = _cc.setDefCcList;
		document.getElementById('cc_okbtn' ).onclick = _cc.saveNewList;
	}

	// for app/sub page
	var res = String(W.location.href).match(/\/(sub|app)\/(\d+)/i);
	if(res){

		var itemType = res[1], itemId = res[2];

		var els = document.querySelectorAll('.game_area_purchase_game');

		var subid, el, subs=[], tmp;
		for(var i=0; i < els.length; i++){
			el = els[i].querySelector('input[name="subid"]');
			if(!el) continue;
			subid = el.value;
			el = el.parentElement.parentElement
			el.insertAdjacentHTML('beforeEnd', '<div>Subscription id = <a href="http://steamdb.info/sub/'+subid+'">'+subid+'</a></div>');
			tmp = W.$J('<div><a onclick="getPrices(event, \''+itemType+'\', '+itemId+');return false" href="#getPrices">Получить цены для других стран</a></div>');
			el = W.$J(el).append(tmp);
			subs.push({subid:subid,el:tmp[0]});
		}

		W.getPrices = function(e, itemType, itemId){

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
						s+='NA';
					}
					document.querySelector('.swt_price_0_'+cc+'>span').innerHTML = s;
				});
			}


			for(var k=0; k < subs.length; k++) {
				var str = 'Цены для других стран:';
				for(var i=0; i < _cc.ListA.length; i++){
					str += '<div class="swt_price_'+k+'_'+_cc.ListA[i]+'"><a href="?cc='+_cc.ListA[i]+'"><img src="http://cdn.steamcommunity.com/public/images/countryflags/'+_cc.ListA[i]+'.gif" style="width:16px"/> '+_cc.ListA[i].toUpperCase()+'</a> <span>...</span></div>';

				}
				subs[k].el.innerHTML = str;
			}
			for(var i=0; i < _cc.ListA.length; i++){
				getPrice(_cc.ListA[i]);
			}
			setTimeout(function(){getPrice(_cc.curCC)}, 3500);


			return false;
		}


		var gamenameEl = document.querySelector('.game_title_area .pageheader');
		if (!gamenameEl){
			gamenameEl = document.querySelector('.game_title_area .apphub_AppName');
		}
		var gamename = encodeURIComponent(gamenameEl.textContent.trim());
		
		var el = document.querySelector('.rightcol.game_meta_data');

		links = [
			{href:'http://steamdb.info/'+itemType+'/'+itemId+'/', icon:'https://steamdb.info/static/logos/favicon-16x16.png', text:'Посмотреть в SteamDB.info'},
			{href:'http://www.steamprices.com/'+_cc.curCC.toLowerCase()+'/'+itemType+'/'+itemId, icon:'https://www.steamprices.com/assets/images/favicons/favicon-16x16.png?v=a', text:'Посмотреть на SteamPrices.com'},
			{href:'http://plati.ru/asp/find.asp?agent=111350&searchstr='+gamename, icon:'http://plati.ru/favicon.ico', text:'Искать на Plati.ru'},
			{href:'http://steampub.ru/search/'+gamename, icon:'http://steampub.ru/favicon.ico', text:'Искать на SteamPub.ru'},
		];

		if(itemType=='app'){
			links.push({href:'http://steamcommunity.com/my/gamecards/'+itemId, icon:'http://store.akamai.steamstatic.com/public/images/v6/ico/ico_cards.png', text:'Посмотреть мои карты этой игры'})
		}

		el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));

		// ajax add to cart
		W.addToCart = function(subid){
			var form = W.$J('[name="add_to_cart_'+subid+'"]');
			var el=form.parent();
			el.find('.game_purchase_action_bg .btn_addtocart:last>a').after('<a id="swtcartdone" href="#">Wait...</a>');
			W.$J.ajax({
				url: form.attr('action'),
				type: 'POST',
				data: {subid:subid, action:'add_to_cart', sessionid:W.g_sessionID}
			}).done(function(data){
				var cartHistory = W.localStorage['swtcarthistory'] && JSON.parse(W.localStorage['swtcarthistory']) || [];
				if(cartHistory.length>=20) cartHistory.shift();
				cartHistory.push({
					subid: subid,
					name: el.find('h1').text().match(/\S+\s(.+)/i)[1],
					price: el.find('.game_purchase_price.price').text().trim() || el.find('.discount_final_price').text().trim(),
					link: itemType+'/'+itemId
				});
				W.localStorage['swtcarthistory'] = JSON.stringify(cartHistory);
				
				el.find('#swtcartdone').css('background-image','none').text('✔ Added').attr('href','/cart/');
			})
		};

	} else {
		W.$J('a.btn_small_tall[href^="http://store.steampowered.com/search/?specials=1"]').after('<a class="btnv6_blue_hoverfade btn_small_tall" href="http://steamdb.info/sales/"><span>All Specials - SteamDB.Info</span></a>');
	}


};

_cc = {
	defList : 'ru ua us ar fr no gb au br de jp',
	curCC : false,
	updHTMLccList : function(curCC){
		var s='';
		_cc.ListA = _cc.curList.split(' ');
		for(var i=0; i < _cc.ListA.length; i++){
			s += '<a class="popup_menu_item" href="'+_cc.url+_cc.ListA[i]+'"><img src="http://cdn.steamcommunity.com/public/images/countryflags/'+_cc.ListA[i]+'.gif" style="width:16px"/> '+_cc.ListA[i].toUpperCase()+'</a>';
		}
		s += '<a class="popup_menu_item" title="Редактировать" href="#" onclick="ShowMenu(this, \'cc_list_edit\', \'right\', \'bottom\', true);return false"><img src="http://cdn.steamcommunity.com/public/images/skin_1/iconEdit.gif" style="width:16px"/></a>';
		document.getElementById('cc_list').innerHTML=s;
		if (curCC)
			_cc.curCC=curCC
		else
			_cc.curCC=_cc.ListA[0];
	},
	saveNewList : function(){
		_cc.curList=document.getElementById('ccListEdit').value;
		W.localStorage.ccList=_cc.curList;
		_cc.updHTMLccList();
		return false;
	},
	setDefCcList : function(){
		document.getElementById('ccListEdit').value = _cc.defList;
		return false;
	}
};

_cc.curList = W.localStorage.ccList || _cc.defList;

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
			text: 'Проверить на Check.CSMania.RU',
		},
		{
			href: 'http://steamrep.com/profiles/'+steamid,
			icon: 'http://steamrep.com/favicon.ico',
			text: 'Проверить на SteamRep.com',
		},
		{hr:true},
		{
			href: 'http://forums.steamrep.com/search/search?keywords='+steamid,
			icon: 'http://steamrep.com/favicon.ico',
			text: 'Искать на форумах SteamRep.com',
		},
		{
			href: 'http://www.google.com/#q='+steamid+' inurl:sourceop.com',
			icon: 'http://forums.sourceop.com/favicon.ico',
			text: 'Искать на форумах SourceOP.com',
		},
		{
			href: 'http://www.steamtrades.com/user/id/'+steamid,
			icon: 'http://www.steamgifts.com/favicon.ico',
			text: 'Профиль на SteamGifts.com',
		},
		{hr:true},
		{
			href: 'http://backpack.tf/profiles/'+steamid,
			icon: 'http://backpack.tf/favicon_440.ico',
			text: 'Инвентарь Backpack.tf',
		},
		{
			href: 'http://tf2b.com/tf2/'+steamid,
			icon: 'http://tf2b.com/favicon.ico',
			text: 'Инвентарь TF2B.com',
		},
		{
			href: 'http://tf2outpost.com/backpack/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon_440.ico',
			text: 'Инвентарь TF2OutPost.com',
		},
		{hr:true},
		{
			href: 'http://tf2outpost.com/user/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon_440.ico',
			text: 'Трэйды на TF2OutPost.com',
		},
		{
			href: 'http://dota2lounge.com/profile?id='+steamid,
			icon: 'http://dota2lounge.com/favicon.ico',
			text: 'Трэйды на Dota2Lounge.com',
		},
		{
			href: 'http://csgolounge.com/profile?id='+steamid,
			icon: 'http://csgolounge.com/favicon.ico',
			text: 'Трэйды на CSGOLounge.com',
		},
		{hr:true},
		{
			href: 'http://steammoney.com/trade/user/'+steamid,
			icon: 'http://steammoney.com/favicon.ico',
			text: 'Инвентарь SteamMoney.com',
		},
		{
			id:   'inv_spub',
			href: 'http://steampub.ru/user/'+steamid,
			icon: 'http://steampub.ru/favicon.ico',
			text: 'Профиль на SteamPub.ru',
		},
		{hr:true}

	];


	// Styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>#swt_info{position:absolute;top:201px}</style>'
	);


	$('.profile_header').append('<div id="swt_info">SteamID64: <a href="http://steamcommunity.com/profiles/'+steamid+'">'+steamid+'</a> | <a href="#getMoreInfo" onclick="getMoreInfo();return false">Get more info</a></div>');

	W.getMoreInfo = function() {
		var Modal = W.ShowDialog('Extended Info', $('<div id="swtexinfo"><img src="http://cdn.steamcommunity.com/public/images/login/throbber.gif"></div>'));
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
			$('#swtexinfo').html('Request Error / Ошибка при получении данных')
		});
	};


	// chat button
	try {
		var pm_btn = $('.profile_header_actions>a.btn_profile_action[href^="javascript:LaunchWebChat"]')[0];
		pm_btn.outerHTML='<span class="btn_profile_action btn_medium"><span><a href="steam://friends/message/'+steamid+'">Chat: Steam</a> | <a href="'+pm_btn.href+'">Web</a></span></span>';
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
		$('.profile_header_actions').append('<span class="btn_profile_action btn_medium" onclick="ShowMenu(this,\'profile_action_dropdown\',\'right\')"><span>More <img src="http://cdn.steamcommunity.com/public/images/profile/profile_action_dropdown.png"/></span></span><div class="popup_block" id="profile_action_dropdown" style="visibility:visible;display:none"><div class="popup_body popup_menu">'+out+'</div></div>')
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


	// multi gifts sending
	document.body.insertAdjacentHTML("afterBegin",
		'<style>.checkedForSend{background:#366836!important}.itemcount{background:#292929;color:#FFF;font-weight:700;position:absolute;right:0;bottom:0}#inventory_logos{display:none}</style>'
	);
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
				amount =  parseInt(prompt('Сколько выбрать? из '+item._amount, item._amount)) || 1;
				if (amount>item._amount)
					amount=item._amount;
			}
			if(amount>1){
				for(var i=0;i<amount;i++){
					W.checkedForSend[item._ids[i]]=item.name;
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

		url+=gid+'#multisend='+encodeURIComponent(JSON.stringify(W.checkedForSend))

		W.location.href=url;

	}
	// END multi gifts sending

	//// gifts notes
	var giftsNotes = W.localStorage.giftsNotes;
	if(giftsNotes)
		giftsNotes = JSON.parse(giftsNotes);
	else giftsNotes={};
	W.loadGiftNote = function(){
		var gid = W.g_ActiveInventory.selectedItem.id;
		if(!$('#iteminfo'+W.iActiveSelectView+'_item_tags_content textarea.giftnote').length)
			$('#iteminfo'+W.iActiveSelectView+'_item_tags_content').append('<br/><textarea class="giftnote" style="width:100%">'+(giftsNotes[gid]||'')+'</textarea><button onclick="saveGiftNote(\''+gid+'\')">Save</button>');
	}
	W.saveGiftNote = function(gid){
		giftsNotes[gid]=$('#iteminfo'+W.iActiveSelectView+'_content textarea.giftnote').val();
		W.localStorage.giftsNotes = JSON.stringify(giftsNotes);
	}

	//// action for gifts and tf2 items
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
					item.descriptions.push({value:'<a href="#" onclick="getSubid(event.target,\''+item.id+'\');return false">Получить SubscriptionID</a>',type:'html'});

				if(!ajaxTarget.descriptions[item.classid])
					ajaxTarget.descriptions[item.classid] = item.descriptions;


				if(item.owner_actions) {
					item.owner_actions.push({
						link:'javascript:checkForSend("%assetid%")',
						name:'Выбрать для отправки'
					});
					item.owner_actions.push({
						link:'javascript:sendChecked()',
						name:'Отправить выбранные'
					});
					item.owner_actions.push({
						link:'javascript:loadGiftNote()',
						name:'Посмотреть заметку'
					});
				}
			}
		}
		return BuildHover_orig.apply(this, arguments);
	}


	//// View in Market Button
	// not for me
	if (W.UserYou.strSteamId!=W.g_steamID){
		var PopulateMarketActions_orig = W.PopulateMarketActions;
		W.PopulateMarketActions = function (elActions, item) {
			var res = PopulateMarketActions_orig.apply(this, arguments);
			if (!item.marketable) {
				return res;
			}
			var market_hash_name = item.market_hash_name ? item.market_hash_name : item.market_name;
			elActions.appendChild(W.CreateMarketActionButton('blue', 'http://steamcommunity.com/market/listings/'+item.appid+'/'+market_hash_name, 'Мин цена на маркете: <span id="swt_lowestItemPrice_'+item.classid+'">?</span>'));
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
				var price='ERROR';
				if(data.success){
					price=data.lowest_price
				}
				$('#swt_lowestItemPrice_'+item.classid).html(price);
			} ).fail(function(jqxhr) {
				$('#swt_lowestItemPrice_'+item.classid).text('ERROR');
			} );


			return res;
		}
	}

	//// Hide Duplicates

	var SelectInventoryFromUser_old = W.SelectInventoryFromUser;
	W.SelectInventoryFromUser = function(){
		var appid = arguments[1];
		var contextid = arguments[2];

		var inventory = W.UserYou.getInventory( appid, contextid );
		if (W.localStorage.hideDupItems && !inventory._hiddenDup) {

			// display count
			if(!inventory.BuildItemElement_old){
				inventory.BuildItemElement_old = inventory.BuildItemElement;
				inventory.BuildItemElement = function(){
					var el = inventory.BuildItemElement_old.apply(this, arguments);
					var a = el.rgItem._amount;
					if (a)
						el.innerHTML+='<div class="itemcount">x'+a+'</div>';
					return el;
				}
			}

			var itemsA = [];

			if(inventory.rgChildInventories) {
				for(var x in inventory.rgChildInventories){
					inventory.rgChildInventories[x].BuildItemElement = inventory.BuildItemElement; // display count
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
							delete items[j];
						} else {
							items[j]._is_stackable = true;
							items[j]._amount = 1;
							items[j]._ids = [items[j].id];
							newItems[items[j].classid] = items[j];
						}
					}
				}
			}

		}

		return SelectInventoryFromUser_old.apply(this, arguments);
	}


	var HTMLHideDup = '<input type="checkbox" name="hidedup" onchange="window.onchangehidedup(event)" '+((W.localStorage.hideDupItems)?'checked="true"':'')+'/>Прятать дубликаты, показывая кол-во';
	document.getElementById('inventory_pagecontrols').insertAdjacentHTML("beforeBegin", HTMLHideDup);

	W.onchangehidedup = function(e){
		if(e.target.checked){
			W.localStorage.hideDupItems = 1
		} else {
			W.localStorage.removeItem('hideDupItems')
		}

		W.location.reload();
	};

	//// sell dialog accept ssa checked
	$('#market_sell_dialog_accept_ssa').attr('checked',true);

	//// multisell
	if(W.localStorage.hideDupItems){
		W.SellItemDialog.OnConfirmationAccept_old = W.SellItemDialog.OnConfirmationAccept;
		var SellCurrentSelection_old = W.SellCurrentSelection;
		W.SellCurrentSelection = function(){
			var res = SellCurrentSelection_old.apply(this, arguments);
			var count = W.g_ActiveInventory.selectedItem._amount;
			W.$('market_sell_dialog_ok').stopObserving();
			$('#market_sell_dialog_ok').unbind();
			if(count>1) {
				var amount =  parseInt(prompt('Сколько продавать? из '+count, count)) || 1;
				if (amount>count)
					amount=count;

				if(amount>1){
					W.SellItemDialog._amount=amount;
					W.SellItemDialog._itemNum=0;
					W.SellItemDialog.OnConfirmationAccept_new = function(event){

						W.$('market_sell_dialog_error').hide();
						W.$('market_sell_dialog_ok').fade({duration:0.25});
						W.$('market_sell_dialog_back').fade({duration:0.25});
						W.$('market_sell_dialog_throbber').show();
						W.$('market_sell_dialog_throbber').fade({duration:0.25,from:0,to:1});

						W.SellItemDialog.m_item.id=W.SellItemDialog.m_item._ids[W.SellItemDialog._itemNum];
						W.SellItemDialog._itemNum++;

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
							$('#market_sell_dialog_item_availability_hint>.market_dialog_topwarning').text('Выставлен №'+W.SellItemDialog._itemNum);
							if(W.SellItemDialog._itemNum>=W.SellItemDialog._amount)
								W.SellItemDialog.OnSuccess( { responseJSON: data } );
							else {
								return W.SellItemDialog.OnConfirmationAccept_new.apply(W.SellItemDialog, arguments);
							}
						} ).fail( function( jqxhr ) {
							// jquery doesn't parse json on fail
							var data = $.parseJSON( jqxhr.responseText );
							W.SellItemDialog.OnFailure( { responseJSON: data } );
						} );
						//W.SellItemDialog.Dismiss();
						//event.stop();

					}
					W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_new;
				} else {
					W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_old;
				}


			} else
				W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_old;
			$('#market_sell_dialog_ok').on("click", $.proxy(W.SellItemDialog.OnConfirmationAccept, W.SellItemDialog));
			return res;
		}

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
W.$J('.badge_details_set_favorite').append('<div class="btn_grey_black btn_small_thin" onclick="showWithDrop()"><span>Показать с невыпавшими картами</span></div>');
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
			'http://steamcommunity.com/market.*'
		],
		run:function(){
﻿function init(){
	var el = W.$J('.pick_and_sell_button').length;
	if(el)
	{
		mainPage();
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
	var el = document.querySelector('#tabContentsMyListings .market_home_listing_table:nth-child(1) .market_listing_edit_buttons').innerHTML='<a href="#checkAllListings" id="btnCheckAllListings" class="item_market_action_button item_market_action_button_blue"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">Выбрать все</span><span class="item_market_action_button_edge item_market_action_button_right"></span></a> <a href="#removeListings" id="btnRemoveListings" class="item_market_action_button item_market_action_button_green"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">Удалить выбранные</span><span class="item_market_action_button_edge item_market_action_button_right"></span></a>';

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
	addGotoBtn()
}

function addGotoBtn(){
	W.$J("#searchResults_btn_next").after(' <input id="swt_gotopagevl" type="text" value="1" size="3"/><span class="pagebtn" id="swt_gotopagebtn">Go</span>');
	W.$('swt_gotopagebtn').onclick=function(){
		W.g_oSearchResults.GoToPage(W.$('swt_gotopagevl').value-1);
	}
}

init();
		}
	}
];

for(var i = 0; i<scripts.length; i++) {
	for(var j = 0; j < scripts[i].match.length; j++) {
		var expr = new RegExp('^'+scripts[i].match[j]+'$', 'i');
		if(expr.test(url)) {
			scripts[i].run();
			break;
		}
	}
}
