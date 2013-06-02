// ==UserScript==
// @include http://steamcommunity.com/market*
// ==/UserScript==


(function(){

function init(){

	var el = document.getElementById('tabContentsMyListings');
	if(el)
	{
		mainPage(el);
	}

}

function includeJS(url){
	document.getElementsByTagName('head')[0].appendChild(document.createElement('SCRIPT')).src=url;
}

function mainPage(tabContentsMyListings){
	var listingid;
	
	// styles
	document.body.insertAdjacentHTML("afterBegin", 
		'<style>.scrollbl_listing{max-height:500px;overflow-y:scroll;} .lfremove{display:inline-block}</style>'
	);
	/* for future | DON'T WORK, after removal item have new id
	document.body.insertAdjacentHTML("afterBegin", 
		'		<div id="market_sell_dialog" class="market_modal_dialog" style="display: none;"><div class="market_dialog_title"><span id="market_sell_dialog_title">Put an item up for sale</span><span class="market_dialog_cancel"><a id="market_sell_dialog_cancel" href="#" class="market_dialog_title_cancel">Cancel<span class="market_dialog_title_cancel_X">X</span></a></span></div><div class="market_dialog_contents"><div class="market_dialog_content_frame"><div class="market_dialog_content"><div id="market_sell_dialog_item_availability_hint"><div class="market_dialog_topwarning"></div></div><div class="itemHolder" style="float: left; margin: 0 15px 0 0;"><div id="market_sell_dialog_item" class="item"><img id="market_sell_dialog_item_img" src="http://cdn.steamcommunity.com/public/images/trans.gif" /></div></div><div class="market_dialog_iteminfo"><div class="market_dialog_itemname hover_item_name" id="market_sell_dialog_item_name"></div><div class="item_desc_game_info" id="market_sell_dialog_game_info"><div class="item_desc_game_icon"><img id="market_sell_dialog_game_icon" src="http://cdn.steamcommunity.com/public/images/trans.gif" /></div><div id="market_sell_dialog_game_name" class="ellipsis"></div><div id="market_sell_dialog_item_type" class=""></div></div></div><div style="clear: left"></div></div><div class="market_dialog_content_separator"></div><div class="market_dialog_content market_dialog_content_dark"><div id="market_sell_dialog_input_area" class="market_sell_dialog_input_area"><div><span id="market_sell_quantity_label" class="market_sell_dialog_field_label">Quantity:</span><input type="text" name="market_sell_quantity_input" class="market_dialog_input" id="market_sell_quantity_input"><span id="market_sell_quantity_available">of <span id="market_sell_quantity_available_amt"></span></span><span class="market_sell_dialog_field_label" id="market_price_label">You receive:</span><input type="text" name="market_sell_currency_input" class="market_dialog_input" id="market_sell_currency_input"><span class="market_sell_dialog_field_label" id="market_buyerprice_label">Buyer pays:</span><input type="text" name="market_sell_currency_input" class="market_dialog_input" id="market_sell_buyercurrency_input"><span id="market_price_includesfees">(includes fees)</span></div><br/><a id="market_sell_dialog_accept" href="#" class="btn_green_white_innerfade btn_small_wide"><span>OK, put it up for sale</span></a><div id="marker_sell_dialog_terms"><div id="market_sell_dialog_accept_ssa_container"><input id="market_sell_dialog_accept_ssa" type="checkbox" checked="1" value="0" name="accept_ssa"><label id="market_sell_dialog_accept_ssa_label" for="market_sell_dialog_accept_ssa">I agree to the terms of the Steam Subscriber Agreement</label></div></div><div style="clear:both"></div></div><div id="market_sell_dialog_error"></div></div></div><div id="market_sell_dialog_confirm_buttons" style="display: none"><div class="market_dialog_bottom_buttons"><a id="market_sell_dialog_ok" href="#" class="btn_green_white_innerfade btn_medium_wide"><span>OK</span></a><a id="market_sell_dialog_back" href="#" class="btn_grey_white_innerfade btn_medium_wide"><span>Back</span></a><div style="clear: both"></div></div></div></div><div id="market_sell_dialog_background"></div></div>'
	);
	//// Remove listing before set new price
	//	new function for [OK] button
	window.SellItemDialog.OnConfirmationAccept_new = function(){
		window.$('market_sell_dialog_ok').stopObserving();
		if(listingid)
			new window.Ajax.Request('http://steamcommunity.com/market/removelisting/', {
				method: 'post',
				parameters: {
					sessionid: window.g_sessionID,
					listingid: listingid
				},
				onComplete: function() {
					listingid = false;
					return window.SellItemDialog.OnConfirmationAccept.apply(window.SellItemDialog, arguments);
				}
			});
	}
	window.$J('#market_sell_dialog_ok').click(window.SellItemDialog.OnConfirmationAccept_new);
	*/
	
	
	//// Remove button
	// add
	var el = document.querySelector('#tabContentsMyListings .market_listing_edit_buttons').innerHTML='<a href="#removeListings" id="btnRemoveListings" class="item_market_action_button item_market_action_button_green"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">Удалить выбранные</span><span class="item_market_action_button_edge item_market_action_button_right"></span><span class="item_market_action_button_preload"></span></a>';
	
	// set function
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

	var rows = window.$J('#tabContentsMyListings .market_listing_row').detach();
	window.$J('.market_content_block.my_listing_section.market_home_listing_table').append('<div class="scrollbl_listing"></div>').click;
	rows.prependTo("#tabContentsMyListings .scrollbl_listing");

	window.$J('.market_listing_cancel_button a').each(function(i, el){
		var res = decodeURIComponent(String(el.href)).match(/mylisting', '(\d+)', (\d+), '(\d+)', '(\d+)'/i), market_name;
		if(res){
			market_name = window.g_rgAssets[res[2]][res[3]][res[4]].market_name;
			
			window.$J('#mylisting_'+res[1]+'_name').before('<a target="_blank" href="http://steamcommunity.com/market/search?q=appid%3A'+res[2]+'+'+encodeURIComponent(market_name)+'"><img src="http://cdn.steamcommunity.com/public/images/economy/search_icon.gif"></a> ');
			
			window.$J(el).before('<span class="item_market_action_button_contents"><input type="checkbox" class="lfremove" data-listingid="'+res[1]+'"/></span>');
			//window.$J(el).before('<a class="editprice" href="#editprice" data-listingid="'+res[1]+'" data-app="'+res[2]+'" data-context="'+res[3]+'" data-id="'+res[4]+'">Выставить с новой ценой</a>');
			window.$J(el).remove();
		}
	});

	/*
	window.$J('a.editprice').click(function(){
		$t = window.$J(this);
		listingid = $t.data('listingid');
		window.SellItemDialog.Show( window.g_rgAssets[$t.data('app')][$t.data('context')][$t.data('id')] );
	});
	*/

}



var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);
	
})();