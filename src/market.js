function init(){
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
			W.$J('#'+resultId).append(' / '+W.v_currencyformat(total, W.GetCurrencyCode(W.g_rgWalletInfo.wallet_currency))+'('+W.v_currencyformat(total/1.15, W.GetCurrencyCode(W.g_rgWalletInfo.wallet_currency))+')');
		}
	}
	countSumListings('tablesell', 'my_market_selllistings_number');
	countSumListings('tablebuy', 'my_market_buylistings_number', true);

}

function itemPage(){
	//// accept ssa checked
	W.$J('#market_buynow_dialog_accept_ssa, #market_buyorder_dialog_accept_ssa').prop('checked',true);

	addGotoBtn();

	//numerate listings
	W.$J('#searchResultsRows .market_listing_item_name_block').each(function(i,e) {
		$J(e).prepend('<div style="float:right">#'+(i+1)+'</div>')
	});
}

function addGotoBtn(){
	W.$J("#searchResults_btn_next").after(' <input id="swt_gotopagevl" type="text" value="1" size="3"/><span class="pagebtn" id="swt_gotopagebtn">'+t('go')+'</span>');
	W.$J('#swt_gotopagebtn').click(function(){
		W.g_oSearchResults.GoToPage(W.$('swt_gotopagevl').value-1);
	})
}

init();