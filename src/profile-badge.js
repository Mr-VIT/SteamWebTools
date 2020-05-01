var $= W.$J;

var app = W.location.pathname.match(/\/gamecards\/(\d+)/)[1];

// == Feature == link to steamcardexchange.net
var $bar = $('.gamecards_inventorylink:first');
if(!$bar.length){ // foreign profile
	$bar=$('<div class="gamecards_inventorylink"></div>').prependTo( $('.badge_detail_tasks:first') )
	.append('<a class="btn_grey_grey btn_medium" href="/my/gamecards/'+app+'"><span>'+t('viewMyCardsGame')+'</span></a> ');
}
$bar.append('<a class="btn_grey_grey btn_small_thin" href="https://steamcommunity.com/market/search?appid=753&category_753_item_class%5B%5D=tag_item_class_5&category_753_Game%5B%5D=tag_app_'+app+'"><span>Booster Pack</span></a> ');
$bar.append('<a class="btn_grey_grey btn_small_thin" href="http://www.steamcardexchange.net/index.php?inventorygame-appid-'+app+'"><span>www.SteamCardExchange.net</span></a> ');

// == Feature == craft all lvls
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

	$bar.prepend('<div style="float:right;margin-left:5px" class="btn_grey_black btn_small_thin" onclick="craftAllAvailable()"><span>'+t('craftAllAvailable')+'</span></div>');
}

// == Feature == link to foreign steamcards page
$(".badge_friendwithgamecard_actions").each(function(i, el){
	var $el=$(el);
	$el.append('<a class="btn_grey_grey btn_medium" title="Steam Cards" href="'
		+$el.prev('a.persona').attr('href')+'/gamecards/'+app
		+'"><img style="height:16px;transform:scale(1.5)" src="//steamstore-a.akamaihd.net/public/images/ico/ico_cards.png"></a>');
});