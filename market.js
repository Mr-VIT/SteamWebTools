// ==UserScript==
// @include http://steamcommunity.com/market*
// ==/UserScript==


(function(){

function init(){

	var el = window.$J('.pick_and_sell_button').length;
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
	window.$J('#btnCheckAllListings').click(function(){
		window.$J('.lfremove').attr('checked',!window.$J('.lfremove:first')[0].checked)
		return false;
	});
	window.$J('#btnRemoveListings').click(function(){
		var data = [];

		window.$J('.lfremove').each(function(i, el){
			if(el.checked)
				data.push(el);
		});

		function run(i){
			if(i<data.length)
				new window.Ajax.Request('http://steamcommunity.com/market/removelisting/'+window.$J(data[i]).data('listingid'), {
					method: 'post',
					parameters: {
						sessionid: window.g_sessionID,
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
	var rows = window.$J('#tabContentsMyListings .market_home_listing_table:nth-child(1) .market_listing_row').detach();
	window.$J('.market_content_block.my_listing_section.market_home_listing_table:nth-child(1)').append('<div class="scrollbl tablesell"></div>').click;
	rows.prependTo("#tabContentsMyListings .scrollbl.tablesell");
	// scroll table:buy
	var rows = window.$J('#tabContentsMyListings .market_home_listing_table:nth-child(2) .market_listing_row').detach();
	window.$J('.market_content_block.my_listing_section.market_home_listing_table:nth-child(2)').append('<div class="scrollbl tablebuy"></div>').click;
	rows.prependTo("#tabContentsMyListings .scrollbl.tablebuy");

	window.$J('.market_listing_cancel_button a').each(function(i, el){
		var res = decodeURIComponent(String(el.href)).match(/mylisting', '(\d+)', (\d+), '(\d+)', '(\d+)'/i);
		if(res){
			window.$J(el).before('<span class="item_market_action_button_contents"><input type="checkbox" class="lfremove" data-listingid="'+res[1]+'"/></span>');
			window.$J(el).remove();
		}
	});

	/////
	function countSumListings(tableClass, resultId, useCount){
		var myListings = window.$J('#tabContentsMyListings .'+tableClass+' span.market_listing_price');
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
			window.$J('#'+resultId).append(' / '+window.v_currencyformat(total, window.GetCurrencyCode(window.g_rgWalletInfo.wallet_currency)));
		}
	}
	countSumListings('tablesell', 'my_market_selllistings_number');
	countSumListings('tablebuy', 'my_market_buylistings_number', true);

}

function itemPage(){
	//// accept ssa checked
	window.$('market_buynow_dialog_accept_ssa').checked=true;
	addGotoBtn()
}

function addGotoBtn(){
	window.$J("#searchResults_btn_next").after(' <input id="swt_gotopagevl" type="text" value="1" size="3"/><span class="pagebtn" id="swt_gotopagebtn">Go</span>');
	window.$('swt_gotopagebtn').onclick=function(){
		window.g_oSearchResults.GoToPage(window.$('swt_gotopagevl').value-1);
	}
}

var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);

})();