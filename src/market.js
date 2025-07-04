function init(){
	if(settings.cur.globalHideWalletBalance){
		var el = W.$J('#marketWalletBalanceAmount')[0];
		if(el){
			el.title = el.innerHTML;
			el.innerHTML = '['+t('balance')+']';
		}
	}
	var el = W.$J('.pick_and_sell_button:first').length;
	if(el){
		if(settings.cur.marketMainPageFuncs) mainPage();
	} else
	if(document.getElementById('searchResults')){
		addGotoBtn();
	} else
	if(document.getElementById('largeiteminfo_item_name')){
		itemPage();
	}
	else if(document.getElementById('market_mutlisell_maincontent')){
		// fix steam scripts with old limit per load
		if(W.Filter?.FILTER_ASSETS_PER_LOAD>2500){
			W.Filter.FILTER_ASSETS_PER_LOAD = 2500;
			W.CInventory.prototype.LoadMoreAssets_old = W.CInventory.prototype.LoadMoreAssets;
			W.CInventory.prototype.LoadMoreAssets = function(count){
				if(count>W.Filter.FILTER_ASSETS_PER_LOAD)
					count = W.Filter.FILTER_ASSETS_PER_LOAD;
				return W.CInventory.prototype.LoadMoreAssets_old.apply(this, arguments)
			}
		}

		function forceReloadJS(srcUrlContains) {
			$J('script:empty[src*="' + srcUrlContains + '"]').each((i, el)=>{
				let $el = $J(el);
				let src = $el.attr('src');
				$el.remove();
				$J('<script/>').attr('src', src).appendTo('head');
			});
		}

		let intId = setInterval(() => {
			if($J('#market_multisell_errmsg:visible').html('Page fixed by SWT').length){
				clearInterval(intId);
				$J('#market_multisell_loading').show();
				forceReloadJS('market_multisell.js')
			} else if(!$J('#market_multisell_loading:visible').length){
				clearInterval(intId);
			}
		}, 1000);

	}
}

function checkboxifyMyListings(){
	W.$J('.market_listing_cancel_button a').each(function(i, el){
		var res = decodeURIComponent(String(el.href)).match(/mylisting', '(\d+)', (\d+), '(\d+)', '(\d+)'/i);
		if(res){
			var $el=W.$J(el);
			$el.before('<span class="item_market_action_button_contents"><input type="checkbox" class="lfremove" data-listingid="'+res[1]+'"/></span>');
			$el.remove();
		}
	});
};

function addButtonsMyListings(){

	let btnCheckAllListings = W.$J(W.CreateMarketActionButton('blue', '', t('checkAll'))).click(function(){
		var chboxes = W.$J('div.market_listing_cancel_button input.lfremove');
		chboxes.prop('checked',!chboxes[0].checked);
		return false;
	});

	let btnRemoveListings = W.$J(W.CreateMarketActionButton('green', '', t('deleteChecked'))).click(function(){
		let self = this;

		if(self._inProcess)
			return self._inProcess = false;

		let data = W.$J('div.market_listing_cancel_button input.lfremove:checked').get();
		if(!data.length)
			return false;

		self._inProcess = true;

		function run(i){
			if(i>=data.length) return self._inProcess=false;
			var $statusIcon=W.$J('<i class="waiting_dialog_throbber"/>');
			var $el = W.$J(data[i]).after($statusIcon);
			W.$J.ajax({
				url: '/market/removelisting/'+$el.data('listingid'),
				type: 'post',
				data: {
					sessionid: W.g_sessionID,
				},
				complete: function() {
					if(self._inProcess)
						run(++i);
				},
				error: function() {
					$statusIcon.replaceWith('<img src="//community'+CDN+'public/images/economy/market/icon_alertlistings.png" />');
				},
				success:function() {
					data[i].parentElement.parentElement.parentElement.parentElement.remove();
				}
			})
		}
		run(0);

		return false;
	});

	W.$J('#tabContentsMyListings .market_home_listing_table:nth-child(1) .market_listing_table_header>.market_listing_edit_buttons')
	.append(btnCheckAllListings, btnRemoveListings);

	//if item page
	let item = Object.values(W.g_rgListingInfo)?.[0];
	if(item?.converted_price_per_unit) {
		// sometimes g_rgListingInfo does not have a lowest price
		let lowestPrice = item.converted_price_per_unit + item.converted_publisher_fee_per_unit + item.converted_steam_fee_per_unit;
		if(!W.getPriceAsInt) // prefer using SIH func for compatibility
			W.getPriceAsInt = W.GetPriceValueAsInt;

		W.$J(W.CreateMarketActionButton('green', '', t('Remove Overpriced')))
		.click(function(){
			W.$J('div.market_listing_cancel_button input.lfremove')
			.each((i,e)=>{
				let $e = W.$J(e);
				let price = W.getPriceAsInt($e.parents('#mylisting_'+$e.data('listingid')+':first').find('.market_listing_price:first>span>span:first').text());
				if(price>lowestPrice){
					$e.prop('checked', true);
				}
			});
			btnRemoveListings.click();
			return false;
		})
		.insertAfter(btnCheckAllListings)
		btnRemoveListings.prop('style', 'position:relative;z-index:13').before('<br>')
	}

	checkboxifyMyListings();
};

function mainPage(){
	// styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>.scrollbl{max-height:500px;overflow-y:scroll;} .lfremove{display:inline-block}</style>'
	);

	/*
	// scroll table:sell
	var rows = W.$J('#tabContentsMyListings .market_home_listing_table:nth-child(1) .market_listing_row').detach();
	W.$J('.market_content_block.my_listing_section.market_home_listing_table:nth-child(1)').append('<div class="scrollbl tablesell"></div>').click;
	rows.prependTo("#tabContentsMyListings .scrollbl.tablesell");
	// scroll table:buy
	var rows = W.$J('#tabContentsMyListings .market_home_listing_table:nth-child(2) .market_listing_row').detach();
	W.$J('.market_content_block.my_listing_section.market_home_listing_table:nth-child(2)').append('<div class="scrollbl tablebuy"></div>').click;
	rows.prependTo("#tabContentsMyListings .scrollbl.tablebuy");
	*/

	addButtonsMyListings();

	/* //need fix
	function countSumListings(tableClass, resultId, useCount){
		var myListings = W.$J('#tabContentsMyListings .'+tableClass+' span.market_listing_price');
		if(myListings){

			var total = 0;
			for(var i=0; myListings.length>i; i++){
				price = parseFloat(myListings[i].innerHTML.match(/(\d+(?:[.,]\d{1,2})?)/)[1].replace(',','.'))*100; // use GetPriceValueAsInt()

				if(useCount) {
					i++;
					price *= myListings[i].innerHTML;
				}

				total += price;
			}
			W.$J('#'+resultId).append(' / '+W.v_currencyformat(total, W.GetCurrencyCode(W.g_rgWalletInfo.wallet_currency))+'('+W.v_currencyformat(total/1.15, W.GetCurrencyCode(W.g_rgWalletInfo.wallet_currency))+')');
		}
	}
	countSumListings('tablesell', 'my_market_selllistings_number');
	countSumListings('tablebuy', 'my_market_buylistings_number', true);
	*/

}

function itemPage(){
	//// accept ssa checked
	W.$J('#market_buynow_dialog_accept_ssa, #market_buyorder_dialog_accept_ssa').prop('checked',true);

	addGotoBtn();

	addButtonsMyListings(); // for comodity items only

	//numerate listings
	W.$J('#searchResultsRows .market_listing_item_name_block').each(function(i,e) {
		W.$J(e).prepend('<div style="float:right">#'+(i+1)+'</div>')
	});

	var assets = W.g_rgAssets;
	if(!assets) { // listings
		return;
	}


	// == Feature == replace inventory modal by "multisell" on "Sell" button for commodity items
	var ShowModalContent_old = W.ShowModalContent;
	W.ShowModalContent = function(){
		var item = W.$('largeiteminfo').builtFor;
		if(item.commodity){
			arguments[0] = 'https://steamcommunity.com/market/multisell?appid='+item.appid+'&contextid='+item.contextid+'&qty[]=1&items[]='+item.market_hash_name;
		}
		return ShowModalContent_old.apply(this, arguments);
	}


	// == Feature == links for cards & booster packs
	// check 753_6 context
	assets= assets[753] && (assets[753][6] || assets[753][0]); // sometimes wrong (0) context
	if(!assets) return;
	var itemdata= Object.values(assets)[0];

	if(!itemdata) return;

	// detect item
	var itemlink = itemdata.owner_actions?.[0]?.link;
	if(!itemlink) return;

	// is card/bpack
	+function(){
		var marketSearchUrl = '/market/search?appid=753&category_753_Game%5B%5D=tag_app_'+itemdata.market_fee_app+'&category_753_item_class%5B%5D=tag_item_class_';
		//check for card
		if(itemlink.match(/\/my\/gamecards\/\d+/)){
			var btn= {name:'Booster Pack',
					link:marketSearchUrl+'5' }
		} else
		//check for bpack
		if(itemlink.includes("javascript:OpenBooster")){
			var btn= {name:t('SearchCardsOnMarket'),
					link:marketSearchUrl+'2' };
		} else return;

		//add btns

		var place = W.$J('<div class="item_actions" id="largeiteminfo_item_actions"></div>').insertAfter( W.$J('#largeiteminfo_game_info') );
		var links = [btn,
			{name: t('viewMyCardsGame'),
			link: '/my/gamecards/'+itemdata.market_fee_app}
		]
		for (var i=links.length; i>0; --i, place.append('<a class="btn_small btn_grey_white_innerfade" href="'+links[i].link+'"><span>'+links[i].name+'</span></a>'));

		return true;
	}()
	// is emoticon
	|| +function(){
		if( !W.g_steamID ||
			!itemdata.descriptions.last()?.value.includes('/emoticon/')) return;

		W.$J.ajax({
			url: '/actions/EmoticonList',
			type: 'GET',
			cache: true
		}).done(list=>{
			W.$J('#largeiteminfo_item_descriptors').append(t('inInv')+': '+(list.includes(itemdata.name) ? '✅' : '❌'))
		})

		return true;
	}()

	// all types GetGooValue
	for(let act of itemdata.owner_actions){
		let res;
		if(res=act.link.match(/^javascript:GetGooValue\( '%contextid%', '%assetid%', (\d+), (\d+), (\d+)/)){
			W.$J.ajax({
				url: '/auction/ajaxgetgoovalueforitemtype/',
				type: 'GET',
				cache: true,
				data: {
					appid: res[1],
					item_type: res[2],
					border_color: res[3]
				}
			}).done(res=>{
				let str='<p>Goo Value: '+res.goo_value,
					gv = parseInt(res.goo_value),
					price = parseInt(CreateBuyOrderDialog.m_nBestBuyPrice);
				if(gv && price){
					str+= '<br>1000 gems: '+
					W.v_currencyformat( 1000*price/gv,
						W.GetCurrencyCode( W.g_rgWalletInfo['wallet_currency'] ) )
				}
				W.$J('#largeiteminfo_item_descriptors').append(str+'</p>')
			})
		}
	}

}

function addGotoBtn(){
	W.$J(' <input id="swt_gotopagevl" type="text" value="1" size="3"/><span class="pagebtn" id="swt_gotopagebtn">'+t('go')+'</span>')
	.insertAfter('#searchResults_btn_next')
	.filter('#swt_gotopagebtn').click(function(){
		W.g_oSearchResults.GoToPage(W.$('swt_gotopagevl').value-1);
	})
}

init();
