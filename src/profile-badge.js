var $= W.$J;

var app = W.location.pathname.match(/\/gamecards\/(\d+)/)?.[1];
if(!app) return;

// == Feature == link to another version of badge
$('div.badge_title:first').append('<a class="btn_grey_grey btn_small_thin" href="'+(
		W.location.search.includes('border=1')
		? W.location.origin+W.location.pathname
		: W.location.href+'?&border=1'
	)+'"><span><img src="https://community.cloudflare.steamstatic.com/public/images/skin_1/icon_tradeoffer.png"> '+t('badgeAnotherVersion')+'</span></a>');


// == Feature == link to steamcardexchange.net
var $bar = $('.gamecards_inventorylink:first');
if(!$bar.length){ // foreign profile
	$bar=$('<div class="gamecards_inventorylink"></div>').prependTo( $('.badge_detail_tasks:first') )
	.append('<a class="btn_grey_grey btn_medium" href="/my/gamecards/'+app+W.location.search+'"><span>'+t('viewMyCardsGame')+'</span></a> ');
}
$bar
.append(`<a class="btn_grey_grey btn_small_thin" href="https://steamcommunity.com/market/search?appid=753&category_753_item_class%5B%5D=tag_item_class_5&category_753_Game%5B%5D=tag_app_${app}"><span>Booster Pack</span></a>
<a class="btn_grey_grey btn_small_thin" href="http://www.steamcardexchange.net/index.php?inventorygame-appid-${app}"><span>SteamCardExchange.net</span></a> `);

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


// == Feature == dropdown menu for actions: link to foreign steamcards page, SteamTradeMatcher

var friendsCards = $('div.badge_friendwithgamecard_actions');
if(friendsCards.length) {
	friendsCards
	.addClass('popup_body popup_menu')
	.each(function(i, el){
		var $el=$(el),
			personaUrl = $el.prev('a.persona').attr('href');
		$el.append(`<a class="btn_grey_grey btn_medium" title="Steam Cards" href="${personaUrl}/gamecards/${app+W.location.search}" target="_blank"><img style="height:16px;transform:scale(1.5)" src="//steamstore-a.akamaihd.net/public/images/ico/ico_cards.png"></a>
		<a class="btn_grey_grey btn_medium" href="//steamtradematcher.com/tools/specscan/${personaUrl.split('/').pop()}" target="_blank"><img src="//community.akamai.steamstatic.com/public/images/skin_1/icon_tradeoffer.png"> TradeMatcher</a>`)
	})
	.wrap('<div style="display:none" class="popup_block_new"/>')
	.parent().prev() // a nick
	.click(function(){
		ShowMenu( this, this.nextElementSibling, 'left', 'bottom', true );
		return false
	})
	.addClass('pulldown').removeAttr('data-miniprofile')
	.append('<br/>📃...')
	.next().find('.btn_medium').each((i,el)=>{
		el.innerHTML += ' '+el.title;
		el.classList.add("popup_menu_item");
	})
}