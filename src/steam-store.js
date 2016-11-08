var $ = W.$J;
function init() {

	// for age check
	if(W.location.pathname.indexOf('/agecheck')>-1){
		document.cookie = 'mature_content=1; path=/;';
		document.cookie='birthtime=-1704124799; expires=21-Dec-2025 00:00:00 GMT; path=/';
		W.location.reload();
	}

	if(settings.cur.globalHideWalletBalance){
		var el = $('#header_wallet_balance')[0];
		if(el){
			el.title = el.innerHTML;
			el.innerHTML = '['+t('balance')+']';
		}
	}

	if(settings.cur.storeShowCartBtn){
		$('#store_header_cart_btn').css('display','block');
	}

	// cc switcher
	var global_action_menu = document.getElementById('global_action_menu');
	if(global_action_menu) {
		var curCC = false;
		if(curCC = document.cookie.match(/steamCountry=(\w{2})/i)){
			curCC = curCC[1];
		}
		var changeCCmenuHTML = '\
		<style>#cc_menu_btn{display:none;min-width:59px;z-index:999}#cc_list .popup_menu_item{white-space:nowrap}</style>\
		<span class="pulldown" id="cc_menu_btn" onclick="ShowMenu(this, \'cc_menu\', \'left\', \'bottom\', true);">CC'+(curCC ?': <img src="//steamcommunity-a.akamaihd.net/public/images/countryflags/'+curCC.toLowerCase()+'.gif" /> '+curCC:'')+' </span>\
<div class="popup_block_new" id="cc_menu" style="display:none;">\
<div class="popup_body popup_menu shadow_content" id="cc_list"></div></div>';

		global_action_menu.insertAdjacentHTML('afterBegin', changeCCmenuHTML);

		_cc.updHTMLccList(curCC);
	}
	if(settings.cur.storeShowCCbtn) {
		$('#cc_menu_btn').show()
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
					tmp = $('<div><a onclick="getPrices(event, \''+itemType+'\', '+itemId+');return false" href="#getPrices">'+t('getPrices')+'</a></div>');
					el = $(el).append(tmp);
					subs.push({subid:subid,el:tmp[0]});
				}
			}
			if(settings.cur.storeShowBtnGetPrices) W.getPrices = function(e, itemType, itemId){

				function getPrice(cc){
					var type = ((itemType=='app')
						? 'app'
						: 'package'
					);
					var reqUrl = 'http://store.steampowered.com/api/'+type+'details/?filters=price_overview,packages&v=1&'+type+'ids=';
					

					reqUrl += itemId+'&cc='+cc;
					var done = function(data){
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
					};
					try{
						var xhr = window.GM_xmlhttpRequest || window.GM_xhr;
						if(xhr){
							xhr({
								url: reqUrl,
								method: 'GET',
								anonymous : true,
								onload: function( data ) {
									data=JSON.parse(data.responseText);
									done(data);
								}
							});
						} else {
							jQuery.ajaxSettings.xhr = function() {
								try {
									return new W.XMLHttpRequest({mozAnon:true}); // anon req for FF
								} catch ( e ) {}
							};
							$.ajax({
								url: reqUrl,
								method: 'GET'
							}).done(done);
						}
						

					} catch(e) {
						console.log(e)
					}
				}


				for(var k=0; k < subs.length; k++) {
					var str = t('prices')+':';
					for(var i=0; i < _cc.ListA.length; i++){
						str += '<div class="swt_price_'+k+'_'+_cc.ListA[i]+'"><a href="?cc='+_cc.ListA[i]+'"><img src="//steamcommunity-a.akamaihd.net/public/images/countryflags/'+_cc.ListA[i]+'.gif" style="width:16px"/> '+_cc.ListA[i].toUpperCase()+'</a> <span>...</span></div>';

					}
					subs[k].el.innerHTML = str;
				}
				for(var i=0; i < _cc.ListA.length; i++){
					getPrice(_cc.ListA[i]);
				}
				//setTimeout(function(){getPrice(_cc.curCC)}, 3500); // set default CC

				return false;
			}

		}
		var gamenameEl = document.querySelector('.game_title_area .pageheader') || document.querySelector('.game_title_area .apphub_AppName');
		var gamename = encodeURIComponent(gamenameEl.textContent.trim());

		var el = document.querySelector('.rightcol.game_meta_data');

		links = [
			{href:'http://steamdb.info/'+itemType+'/'+itemId+'/', icon:'https://steamdb.info/static/logos/favicon-16x16.png', text: t('viewin')+' SteamDB.info'},
			{href:'http://www.steamprices.com/'+_cc.curCC.toLowerCase()+'/'+itemType+'/'+itemId, icon:'https://www.steamprices.com/assets/images/favicons/favicon-16x16.png?v=a', text: t('viewin')+' SteamPrices.com'},
			{href:'http://plati.com/asp/find.asp?ai=111350&searchstr='+gamename, icon:'http://plati.com/favicon.ico', text: t('searchin')+' Plati.com'},
			{href:'http://steampub.ru/search/'+gamename, icon:'http://steampub.ru/favicon.ico', text: t('searchin')+' SteamPub.ru'},
			{href:'http://www.steamgifts.com/giveaways/search?q='+gamename, icon:'http://www.steamgifts.com/favicon.ico', text: t('searchin')+' SteamGifts.com'},
			{href:'https://steambroker.com/tradeoffers.php?appid=753&refid=42362508&query='+gamename, icon:'https://steambroker.com/favicon.ico', text: t('searchin')+' SteamBroker.com'},
			{href:'http://steam-trader.com/games/?r=45962&text='+gamename, icon:'http://steam-trader.com/favicon.ico', text: t('searchin')+' Steam-Trader.com'},
		];
		
		if(itemType=='app'){
			links.push({href:'http://steamcommunity.com/my/gamecards/'+itemId, icon:'http://store.akamai.steamstatic.com/public/images/v6/ico/ico_cards.png', text: t('viewMyCardsGame')})
		}

		el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));

		// ajax add to cart | cart history
		var addToCart_old = W.addToCart;
		W.addToCart = function(subid){
			var form = $('[name="add_to_cart_'+subid+'"]');
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
				$.ajax({
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

		//add btn : view logos
		var el = $({
			app : '.game_header_image_full',
			sub : '.package_header'
		}[itemType]).wrap(
			$('<a href="#viewlogos" title="View Logos"></a>').click(function(){
				var urls = [
					'capsule_616x353',
					'header',
					'header_586x192',
					'header_292x136',
					'capsule_231x87',
					'capsule_184x69',
					'capsule_sm_120',
				];
	
				var res='';
				for(var i=0;i<urls.length;i++){
					res+='<img src="http://cdn.akamai.steamstatic.com/steam/'+itemType+'s/'+itemId+'/'+urls[i]+'.jpg"><br>';
				}
	
				W.ShowDialog(t('Logos'), $(res));
				return false;
			})
		)
	} else {
		$('.icon.discounts').parent().after('<a class="gutter_item" href="http://steamdb.info/sales/"><span class="icon discounts"></span><span> SteamDB.Info/Sales</span></a>');
	}


};

_cc = {
	curCC : false,
	updHTMLccList : function(curCC){
		var s='';
		_cc.ListA = settings.cur.storeCCList.split(' ');
		for(var i=0; i < _cc.ListA.length; i++){
			s += '<a class="popup_menu_item" href="'+_cc.url+_cc.ListA[i]+'"><img src="//steamcommunity-a.akamaihd.net/public/images/countryflags/'+_cc.ListA[i]+'.gif" style="width:16px"/> '+_cc.ListA[i].toUpperCase()+'</a>';
		}

		document.getElementById('cc_list').innerHTML=s;
		_cc.curCC = curCC || _cc.ListA[0];
	},
	url : String(W.location)
};

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
