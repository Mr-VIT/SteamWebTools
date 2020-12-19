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
		W.FinishCraft_old = W.FinishCraft;

		W.FinishCraft = function(){
			if(!W.g_rgBadgeCraftData)
				return;
			W.FinishCraft = W.FinishCraft_old;

			if(sessionStorage.swt_craftAllAvailable){
				W.parent.swt_craftBadgeDone();
			}
			W.FinishCraft_old();
		};

		$('.badge_craft_button').last().click(); // start

		return false;
	};

	// multi badges craft
	if(W.location.hash=="#swt_craft" && sessionStorage.swt_craftAllAvailable){
		W.craftAllAvailable();
	}
}

// == Feature == link to foreign steamcards page
$(".badge_friendwithgamecard_actions").each(function(i, el){
	var $el=$(el);
	$el.append('<a class="btn_grey_grey btn_medium" title="Steam Cards" href="'
		+$el.prev('a.persona').attr('href')+'/gamecards/'+app
		+'"><img style="height:16px;transform:scale(1.5)" src="//steamstore-a.akamaihd.net/public/images/ico/ico_cards.png"></a>');
});