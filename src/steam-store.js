var $ = W.$J;
function init() {

	// == Feature == skip age check
	// mostly for incognito tab with cc
	//if(location.pathname.includes('/agecheck/')){
	if(W.app_agegate){
		document.cookie='birthtime=1;path=/;max-age=31536000';
		location.replace(location.href.replace('/agecheck/','/'));
		return;
	}

	if(settings.cur.storeShowCartBtn){
		let $cart = $('#cart_status_data>div[data-featuretarget="shoppingcart-count-widget"]');
		if(!$cart.data('props')?.count){
			$cart.after($('div.responsive_menu_user_cart>a').clone().css('background', '#5c7e10'))
		}
	}

	// == Feature == cc switch
	var ccListA = settings.cur.storeCCList.split(' ');
	var curCC = W.location.search.match(/(?:\?|&)cc=(\w{2})/i)?.[1]; // forced

	// check if cc is forced
	if(curCC){
		// add cc to all store links
		$(document).on('click auxclick', 'a', e=>{
			let a = e.currentTarget;
			if(a.swt_cc) return;
			a.swt_cc=true;
			let url = new URL(a.href, W.location.origin);
			if( (W.location.origin != url.origin) || url.searchParams.has('cc')) return;

			url.searchParams.append('cc', curCC)
			a.href= url.href;
		})
	} else {
		curCC = $('#application_config').data('config')?.COUNTRY || ccListA[0];
	}

	var global_action_menu = document.getElementById('global_action_menu');

	if(global_action_menu && settings.cur.storeShowCCbtn) {

		var changeCCmenuHTML = '\
		<span class="pulldown" onclick="ShowMenu(this, \'cc_menu\', \'left\', \'bottom\', true);">CC'+
		(curCC ?': <img src="//community'+CDN+'public/images/countryflags/'+curCC.toLowerCase()+'.gif"/> '+curCC:'')+
		' </span>\
<div class="popup_block_new dropdownhidden" id="cc_menu">\
<div class="popup_body popup_menu shadow_content" id="cc_list"></div></div>';

		global_action_menu.insertAdjacentHTML('afterBegin', changeCCmenuHTML);

		var s= '',
			url= W.location.origin+W.location.pathname+'?cc=';

		for(var i=0; i < ccListA.length; i++){
			s += '<a class="popup_menu_item" href="'+url+ccListA[i]+'"><img src="//community'+CDN+'public/images/countryflags/'+ccListA[i]+'.gif" style="width:16px"/> '+ccListA[i].toUpperCase()+'</a>';
		}

		document.getElementById('cc_list').innerHTML=s;

		if(W.g_AccountID) // if logged in need use private tab
			$('#cc_menu').on('click', 'a.popup_menu_item', (e)=>{
				GM_openInTab(e.currentTarget.href, {incognito:true});
				return false;
			})

	}


	// for app/sub page
	var res = String(W.location.pathname).match(/^\/(sub|app)\/(\d+)/i);
	if(res){
		var itemType = res[1], itemId = res[2];

		// check if not available in current region
		if(!document.getElementById('appHubAppName') && document.getElementById('error_box')){
			$('<p style="display:table" class="btn_blue_steamui btn_medium"><span>'+t('viewAnon')+'</span></p>')
			.appendTo('#error_box')
			.click(()=>{
				var xhr = window.GM_xmlhttpRequest || window.GM_xhr;
				var url = W.location.origin+`/${itemType}/${itemId}?cc=us`;
				if(xhr){
					xhr({
						url: url, method: 'GET',
						anonymous : true,
						cookie: 'birthtime=1', // agecheck broken if cc provided
						responseType: 'blob',
						onload: data=>{
							W.open(URL.createObjectURL(data.response), "_self");
						}
					});
				}
				else if(GM_openInTab)
					GM_openInTab(url, {incognito:true})
				else
					alert('unsupported');

			})

			if(itemType=='app'){
				$('#error_box').append(`<iframe src="https://store.steampowered.com/widget/${itemId}/?dynamiclink=1&cc=us" frameborder="0" width="100%" height="190"></iframe>`)
			}


			return; // cz no elements on page
		}


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
					var reqUrl = 'https://store.steampowered.com/api/'+type+'details/?filters=price_overview,packages&v=1&'+type+'ids=';


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
								s += ' (subID:<a href="https://steamdb.info/sub/'+data.packages[0]+'">'+data.packages[0]+'</a>)';
							// for non-main subs
							try{
								var pg = data.package_groups[0].subs;
								if(pg.length>1){
									for(var i=1;i<pg.length;i++){
										var tmp = pg[i].option_text.match(/- \D*(\d+(?:[.,]\d{2})?)/i);
										document.querySelector('.swt_price_'+i+'_'+cc+'>span').innerHTML = '<b>'+tmp[tmp.length-1]+'</b> '+price.currency+' (subID:<a href="https://steamdb.info/sub/'+pg[i].packageid+'">'+pg[i].packageid+'</a>)';
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
					for(var i=0; i < ccListA.length; i++){
						str += '<div class="swt_price_'+k+'_'+ccListA[i]+'"><a href="?cc='+ccListA[i]+'"><img src="//community'+CDN+'public/images/countryflags/'+ccListA[i]+'.gif" style="width:16px"/> '+ccListA[i].toUpperCase()+'</a> <span>...</span></div>';

					}
					subs[k].el.innerHTML = str;
				}
				for(var i=0; i < ccListA.length; i++){
					getPrice(ccListA[i]);
				}

				return false;
			}

		}
		var gamenameEl = document.querySelector('.game_title_area .pageheader') || document.querySelector('.game_title_area .apphub_AppName');
		var gamename = encodeURIComponent(gamenameEl.textContent.trim());

		var el = document.querySelector('.rightcol.game_meta_data');

		let links;
		try{
			let storeItemExtLinks = settings.cur.storeItemExtLinks;
			if(!storeItemExtLinks) throw 0;
			storeItemExtLinks = storeItemExtLinks.split('\n').map(el=>{
				el = el.match(/^(.+?);(.+)$/);
				if(el) return {
					text: el[1].replace(/{T:(.+?)}/, function replacer(match, p1) {
						return t(p1);
					}),
					href: el[2].replace('{TYPE}', itemType).replace('{ID}', itemId).replace('{NAME}', gamename)
				};
				else {
					return {hr:true};
				}
			})
			links = storeItemExtLinks;
		} catch(e){}

		if(itemType=='app'){
			links.push({href:'//steamcommunity.com/my/gamecards/'+itemId, icon:'//store'+CDN+'public/images/v6/ico/ico_cards.png', text: t('viewMyCardsGame')});
			links.push({href:'//steamcommunity.com/market/search?q=&category_753_Game%5B%5D=tag_app_'+itemId+'&category_753_item_class%5B%5D=tag_item_class_2&appid=753', icon:'//store'+CDN+'public/images/v6/ico/ico_cards.png', text: t('SearchCardsOnMarket')})
		}

		el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));

		// cart history
		var addToCart_old = W.addToCart;
		W.addToCart = function(subid){
			try {
				var form = $('[name="add_to_cart_'+subid+'"]');
				var el=form.parent();

				var cartHistory = W.localStorage.swtcarthistory && JSON.parse(W.localStorage.swtcarthistory) || [];
				if(cartHistory.length>=20) cartHistory.shift();

				if(cartHistory.at(-1)?.subid!=subid){
					cartHistory.push({
						subid: subid,
						name: el.find('h1,h2').text().match(/\S+\s(.+)/i)[1],
						price: el.find('.game_purchase_price.price').text().trim() || el.find('.discount_final_price').text().trim(),
						link: itemType+'/'+itemId
					});
					W.localStorage.swtcarthistory = JSON.stringify(cartHistory);
				}
			} catch (e) {
				console.error(e)
			}

			return addToCart_old.apply(this, arguments);

		};

		//add btn : view logos
		var el = $({
			app : '.game_header_image_full',
			sub : '.package_header'
		}[itemType]).wrap(
			$('<a href="#viewlogos" title="View Logos"></a>').click(function(){

				function makeImgEl(url, stl){
					stl = stl ? `style="${stl}" ` : '';
					return `<img ${stl}src="https://cdn${CDN}steam/${itemType}s/${itemId}/${url}"><br>`;
				}

				var urls = [
					'capsule_616x353.jpg',
					'header.jpg',
					'capsule_467x181.jpg',
					'header_292x136.jpg',
					'capsule_231x87.jpg',
					'capsule_184x69.jpg',
					'capsule_sm_120.jpg',
				];
				if(itemType=='sub') {
					urls.unshift('header_586x192.jpg');
				}
				res = urls.map(makeImgEl).join('');

				if(itemType=='app'){
					res =
						makeImgEl('library_hero.jpg', 'max-width:100%')+
						makeImgEl('logo.png', 'position:absolute;left:0;top:0;border:1px #0f0 solid')+
						'<div style="float:right">'+
						[	'library_600x900_2x.jpg',
							'library_600x900.jpg',
							'portrait.png',
						].map(makeImgEl).join('')+
						'</div>' + res;
				}
				//W.ShowDialog(t('Logos'), $(res));

				window.open(URL.createObjectURL(
					new Blob([res], { type: "text/html" })
				));

				return false;
			})
		)
	} else {
		$('.icon.discounts').parent().after('<a class="gutter_item" href="http://steamdb.info/sales/"><span class="icon discounts"></span><span> SteamDB.Info/Sales</span></a>');
	}


};

// block with links on app/sub page
function createBlock(title, links){
	var out='<div class="block">\
<div class="block_header"><h4>'+title+'</h4></div>\
<div class="block_content"><div class="block_content_inner">';

	var link;
	for (var i=0; i < links.length; i++) {
		link = links[i];
		link.icon??= 'https://www.google.com/s2/favicons?sz=16&domain='+encodeURIComponent(link.href?.match(/\/\/(.+?)(\/|$)/)?.[1]);
		out+='<div class="game_area_details_specs"><div class="icon"><a href="'+link.href+'"><img style="height:16px" src="'+link.icon+'" referrerpolicy="no-referrer"></a></div><a class="name" href="'+link.href+'">'+link.text+'</a></div>';
	}

	out+='</div></div></div>';
	return out;
}

init();
