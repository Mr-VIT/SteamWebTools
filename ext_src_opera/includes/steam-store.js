// ==UserScript==
// @include https://store.steampowered.com/*
// @include http://store.steampowered.com/*
// ==/UserScript==

(function(){

function init() {

	// for age check
	if(window.location.pathname.indexOf('/agecheck')==0){
		document.cookie='birthtime=-1704124799; expires=21-Dec-2015 00:00:00 GMT; path=/';
		window.location.reload();
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
<div class="popup_block" id="cc_menu" style="display:none;">\
<div class="popup_body popup_menu shadow_content" id="cc_list"></div></div>\
	<div class="popup_block" id="cc_list_edit" style="display:none;">\
	<div class="popup_body popup_menu shadow_content">\
	<input id="ccListEdit" type="text" value="'+_cc.curList+'"/><br/><a title="OK" href="#" id="cc_okbtn">[OK]</a> <a title="Default" href="#" id="cc_defbtn">[D]</a>\
	</div></div>';
	
		global_action_menu.insertAdjacentHTML('afterBegin', changeCCmenuHTML);
	
		_cc.updHTMLccList();
		
		document.getElementById('cc_defbtn').onclick = _cc.setDefCcList;
		document.getElementById('cc_okbtn' ).onclick = _cc.saveNewList;
	}

	// for app/sub page
	var res = String(window.location.href).match(/\/(sub|app)\/(\d+)/i);
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
			tmp = window.$J('<div><a onclick="getPrices(event, \''+itemType+'\', '+itemId+');return false" href="#getPrices">Получить цены для других стран</a></div>');
			el = window.$J(el).append(tmp);
			subs.push({subid:subid,el:tmp[0]});
		}
		
		window.getPrices = function(e, itemType, itemId){
			
			function getPrice(cc){
				var reqUrl = 'http://store.steampowered.com/api/';
				
				reqUrl += ((itemType=='app')
					? 'appdetails/?l=english&v=1&appids='
					: 'packagedetails/?l=english&v=1&packageids='
				)
				
				reqUrl += itemId+'&cc='+cc;
				
				new window.Ajax.Request( reqUrl, {
					method: 'get',
					onSuccess: function( transport ) {
						var s='';
						
						if(transport.responseJSON[itemId].success){
							var data = transport.responseJSON[itemId].data;
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
					}
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
			
			
			return false;
		}
		

		var gamenameEl = document.querySelector('.game_title_area .game_name .blockbg');
		if (!gamenameEl){
			gamenameEl = document.querySelector('.apphub_AppName');
		}
		var gamename = encodeURIComponent(gamenameEl.textContent.trim());
		el = document.querySelector('#demo_block');
		if(el)
			el = el.parentElement;
		else
			el = document.querySelector('.share').parentElement.parentElement;
			

		links = [
			{href:'http://steamdb.info/'+itemType+'/'+itemId+'/', icon:'http://steamdb.info/favicon.ico', text:'Посмотреть в SteamDB.info'},
			{href:'http://steamgamesales.com/'+itemType+'/'+itemId, icon:'http://steamgamesales.com/favicon.ico', text:'Посмотреть на SteamGameSales.com'},
			{href:'http://www.steamprices.com/ru/'+itemType+'/'+itemId, icon:'http://www.steamprices.com/favicon.png', text:'Посмотреть на SteamPrices.com'},
			//{href:'http://steammoney.com/?price=up&s='+gamename, icon:'http://steammoney.com/favicon.ico', text:'Искать на SteamMoney.com'}, don't work
			{href:'http://plati.ru/asp/find.asp?agent=111350&searchstr='+gamename, icon:'http://plati.ru/favicon.ico', text:'Искать на Plati.ru'},
			{href:'http://steampub.ru/search/'+gamename, icon:'http://steampub.ru/favicon.ico', text:'Искать на SteamPub.ru'},
		];
		
		if(itemType=='app'){
			links.push({href:'http://steamcommunity.com/my/gamecards/'+itemId, icon:'http://cdn.steamcommunity.com/public/images/skin_1/notification_icon_guide.png', text:'Посмотреть мои карты этой игры'})
		}
		
		el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));
		
		// ajax add to cart
		window.addToCart = function(subid){
			var el = window.$J('[name="add_to_cart_'+subid+'"]').parent().find('.game_purchase_action_bg .btn_addtocart_content');
			window.$J.ajax( {
				url: 'http://store.steampowered.com/cart/',
				type: 'POST',
				data: {subid:subid, action:'add_to_cart'}
			} ).done( function ( data ) {
				el.css('background-image','none').text('✔ Added').attr('href','/cart');
			} )
			
		};
		
	} else {
		window.$J('a.linkbar[href^="http://store.steampowered.com/search/?specials=1"]').after('<a class="linkbar" href="http://steamdb.info/sales/">All Specials - SteamDB.Info</a>');
	}
	
	
};

_cc = {
	defList : 'ru ua us ar fr no gb au br de jp',
	updHTMLccList : function(){
		var s='';
		_cc.ListA = _cc.curList.split(' ');
		for(var i=0; i < _cc.ListA.length; i++){
			s += '<a class="popup_menu_item" href="'+_cc.url+_cc.ListA[i]+'"><img src="http://cdn.steamcommunity.com/public/images/countryflags/'+_cc.ListA[i]+'.gif" style="width:16px"/> '+_cc.ListA[i].toUpperCase()+'</a>';
		}
		s += '<a class="popup_menu_item" title="Редактировать" href="#" onclick="ShowMenu(this, \'cc_list_edit\', \'right\', \'bottom\', true);return false"><img src="http://cdn.steamcommunity.com/public/images/skin_1/iconEdit.gif" style="width:16px"/></a>';
		document.getElementById('cc_list').innerHTML=s;
	},
	saveNewList : function(){
		_cc.curList=document.getElementById('ccListEdit').value;
		window.localStorage.ccList=_cc.curList;
		_cc.updHTMLccList();
		return false;
	},
	setDefCcList : function(){
		document.getElementById('ccListEdit').value = _cc.defList;
		return false;
	}
};

_cc.curList = window.localStorage.ccList || _cc.defList;

_cc.url = String(window.location);
if (_cc.url.indexOf('?')==-1) {
	_cc.url += '?';
} else {
	_cc.url = _cc.url.replace(/\?.+/, '?');
}
_cc.url += 'cc=';

window._cc=_cc;


// block with links on app/sub page
function createBlock(title, links){
	var out='<div class="block">\
<div class="block_header"><h4>'+title+'</h4></div>\
<div class="block_content"><div class="block_content_inner">';

	var link;
	for (var i=0; i < links.length; i++) {
		link = links[i];
		out+='<a class="linkbar" href="'+link.href+'" target="_blank"><div class="rightblock">\
<img src="'+link.icon+'" width="16" height="16" border="0" align="top"></div>'+link.text+'</a>'
	}

	out+='</div></div></div>';
	return out;
}


var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);

})();