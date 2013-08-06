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
	
	
	//// Remove button
	// add
	var el = document.querySelector('#tabContentsMyListings .market_listing_edit_buttons').innerHTML='<a href="#checkAllListings" id="btnCheckAllListings" class="item_market_action_button item_market_action_button_blue"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">Выбрать все</span><span class="item_market_action_button_edge item_market_action_button_right"></span></a> <a href="#removeListings" id="btnRemoveListings" class="item_market_action_button item_market_action_button_green"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">Удалить выбранные</span><span class="item_market_action_button_edge item_market_action_button_right"></span></a>';
	
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

	var rows = window.$J('#tabContentsMyListings .market_listing_row').detach();
	window.$J('.market_content_block.my_listing_section.market_home_listing_table').append('<div class="scrollbl_listing"></div>').click;
	rows.prependTo("#tabContentsMyListings .scrollbl_listing");

	window.$J('.market_listing_cancel_button a').each(function(i, el){
		var res = decodeURIComponent(String(el.href)).match(/mylisting', '(\d+)', (\d+), '(\d+)', '(\d+)'/i), market_name;
		if(res){
			market_name = window.g_rgAssets[res[2]][res[3]][res[4]].market_name;
			
			window.$J(el).before('<span class="item_market_action_button_contents"><input type="checkbox" class="lfremove" data-listingid="'+res[1]+'"/></span>');

			window.$J(el).remove();
		}
	});



}



var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);
	
})();