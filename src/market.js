function init(){
	if(settings.cur.globalHideWalletBalance){
		var el = W.$J('#marketWalletBalanceAmount')[0];
		if(el){
			el.title = el.innerHTML;
			el.innerHTML = '['+t('balance')+']';
		}
	}
	var el = W.$J('.pick_and_sell_button').length;
	if(el){
		if(settings.cur.marketMainPageFuncs) mainPage();
	} else
	if(document.getElementById('searchResults')){
		addGotoBtn();
	} else
	if(document.getElementById('largeiteminfo_item_name')){
		itemPage();
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
	W.$J('#tabContentsMyListings .market_home_listing_table:nth-child(1) .market_listing_table_header>.market_listing_edit_buttons').html('<a href="#checkAllListings" id="btnCheckAllListings" class="item_market_action_button item_market_action_button_blue"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">'+t('checkAll')+'</span><span class="item_market_action_button_edge item_market_action_button_right"></span></a> <a href="#removeListings" id="btnRemoveListings" class="item_market_action_button item_market_action_button_green"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">'+t('deleteChecked')+'</span><span class="item_market_action_button_edge item_market_action_button_right"></span></a>');

	// set function
	W.$J('#btnCheckAllListings').click(function(){
		var chboxes = W.$J('div.market_listing_cancel_button input.lfremove');
		chboxes.prop('checked',!chboxes[0].checked);
		return false;
	});
	W.$J('#btnRemoveListings').click(function(){
		var data = [];

		W.$J('div.market_listing_cancel_button input.lfremove').each(function(i, el){
			if(el.checked)
				data.push(el);
		});

		function run(i){
			if(i>=data.length) return;
			var $statusIcon=W.$J('<img src="//community.cloudflare.steamstatic.com/public/images/login/throbber.gif" style="width: 25px; opacity: 1;">');
			var $el = W.$J(data[i]).after($statusIcon);
			new W.Ajax.Request('//steamcommunity.com/market/removelisting/'+$el.data('listingid'), {
				method: 'post',
				parameters: {
					sessionid: W.g_sessionID,
				},
				onComplete: function() {
					run(++i);
				},
				onFailure: function() {
					$statusIcon.prop('src', '//community.cloudflare.steamstatic.com/public/images/economy/market/icon_alertlistings.png');
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

	// check for card/bpack
	var tmp = itemdata.owner_actions && itemdata.owner_actions[0] && itemdata.owner_actions[0].link;
	if(!tmp) return;

	var marketSearchUrl = '//steamcommunity.com/market/search?appid=753&category_753_Game%5B%5D=tag_app_'+itemdata.market_fee_app+'&category_753_item_class%5B%5D=tag_item_class_';
	//check for card
	if(tmp.match(/\/my\/gamecards\/\d+/)){
		var btn= {name:'Booster Pack',
				  link:marketSearchUrl+'5' }
	} else
	//check for bpack
	if(tmp.indexOf("javascript:OpenBooster")>-1){
		var btn= {name:t('SearchCardsOnMarket'),
				  link:marketSearchUrl+'2' };
	} else return;

	//add btns

	var place = W.$J('<div class="item_actions" id="largeiteminfo_item_actions"></div>').insertAfter( W.$J('#largeiteminfo_game_info') );
	var links = [btn,
		{name: t('viewMyCardsGame'),
		 link: '//steamcommunity.com/my/gamecards/'+itemdata.market_fee_app}
	]
	for (var i=links.length; i>0; --i, place.append('<a class="btn_small btn_grey_white_innerfade" href="'+links[i].link+'"><span>'+links[i].name+'</span></a>'));
}

function addGotoBtn(){
	W.$J("#searchResults_btn_next").after(' <input id="swt_gotopagevl" type="text" value="1" size="3"/><span class="pagebtn" id="swt_gotopagebtn">'+t('go')+'</span>');
	W.$J('#swt_gotopagebtn').click(function(){
		W.g_oSearchResults.GoToPage(W.$('swt_gotopagevl').value-1);
	})
}

init();
