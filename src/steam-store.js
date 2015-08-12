function init() {

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