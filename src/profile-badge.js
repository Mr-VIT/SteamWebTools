var $= W.$J;

var app = W.location.pathname.match(/\/gamecards\/(\d+)/)[1];
$('.gamecards_inventorylink').append('<a class="btn_grey_grey btn_small_thin" href="http://www.steamcardexchange.net/index.php?inventorygame-appid-'+app+'"><span>www.SteamCardExchange.net</span></a> ');

// Craft all available lvls
if($('.badge_craft_button').length){
	W.craftAllAvailable=function(){
		var totalCrafts = $('.badge_card_set_text_qty').text().match(/\d+/g).min(),
			curCraft = 0,
			done = 0,
			droppedItems = [];
		W.FinishCraft_old = W.FinishCraft;
		W.FinishCraft = function(){
			if(done){ // onece only call orig. FinishCraft
				if(done==1){  // Preventing re-adding items after the end of the last animation
					if ( g_rgBadgeCraftData && g_bBadgeCraftAnimationReady ){
						done++;
					}
					W.FinishCraft_old();
				}
				return;
			}

			if (!W.g_rgBadgeCraftData)
				return;

			curCraft++;

			droppedItems=droppedItems.concat(W.g_rgBadgeCraftData.rgDroppedItems); //save all items

			if(curCraft>=totalCrafts){
				done = 1;
				if(multiCraft){
					W.parent.swt_craftBadgeDone();
					//return;
				}
				W.g_rgBadgeCraftData.rgDroppedItems = droppedItems; //restore items
				W.FinishCraft(); // done
			} else {
				$('.badge_craft_button').click(); //craft one more
			}
		};

		$('.badge_craft_button').click(); // start

		return false;
	};

	// multi badges craft
	var multiCraft = false;
	if(W.location.hash=="#swt_craft"){
		multiCraft = true;
		W.craftAllAvailable();
	}

	$('.gamecards_inventorylink').prepend('<div style="float:right;margin-left:5px" class="btn_grey_black btn_small_thin" onclick="craftAllAvailable()"><span>'+t('craftAllAvailable')+'</span></div>');
}
