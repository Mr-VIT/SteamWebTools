var $= W.$J;

var app = W.location.pathname.match(/\/gamecards\/(\d+)/)?.[1];
if(!app) return;

// == Feature == link to another version of badge
$('div.badge_title:first').append('<a class="btn_grey_grey btn_small_thin" href="'
	+W.location.origin+W.location.pathname
	+(W.location.search.includes('border=1') ? '' : '?border=1')
	+'"><span><img src="https://community'+CDN+'public/images/skin_1/icon_tradeoffer.png"> '+t('badgeAnotherVersion')+'</span></a>');


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
		$el.append(`<a class="btn_grey_grey btn_medium" href="${personaUrl}/gamecards/${app+W.location.search}" target="_blank"><img style="height:16px;transform:scale(1.5)" src="//store${CDN}public/images/ico/ico_cards.png">Their Cards</a>
		<a class="btn_grey_grey btn_medium" href="//steamtradematcher.com/tools/specscan/${personaUrl.split('/').at(-1)}" target="_blank"><img src="//community${CDN}public/images/skin_1/icon_tradeoffer.png"> TradeMatcher</a>`)
		$('<div class="btn_grey_grey btn_medium" title="good for both">Find matching</div>')
		.appendTo($el)
		.click(matchCardsShowModal)

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
		el.classList.add("popup_menu_item");
		//console.log(el.innerText, el.innerText?1:2);
		if(el.innerText?.trim()) return;
		el.innerHTML += ' '+el.title;

	})
}

// == Feature ==  Сard swap matcher - good for both

/**
 * @typedef {object} CardData
 * @property {string} name
 * @property {number} count
 * @property {number} i
 */

/**
 *
 * @param {jQueryEl} $el
 * @returns {[CardData]}
 */
function extractCards($el){
	let cardsArray=[], maxCount=0;
	$el.each((i,el)=>{
		let countEl = el.firstElementChild;
		let count = countEl.innerText;
		count = count ? Number(count.substring(1,count.length-1)) : 0;
		if(maxCount<count) maxCount=count;
		let nameEl = count ? countEl.nextSibling : el.firstChild
		cardsArray.push({
			i,
			name: nameEl.wholeText?.trim(),
			count
		})
	});
	cardsArray.maxCount=maxCount;
	cardsArray.sorted = cardsArray.toSorted((a,b)=>b.count-a.count);
	return cardsArray;
}

/**
 *
 * @returns {[CardData]}
 */
function getMyCards(){
	return getMyCards._cache ?? (getMyCards._cache = extractCards($J('.badge_card_set_cards .badge_card_set_title')));
}

/**
 *
 * @param {string} url partner profile url
 * @returns {Promise<[CardData]>}
 */
async function getPartnerCards(url){
	// todo better gamecards url
	const GC = '/gamecards/';
	url += GC+location.href.split(GC).at(-1);
	let res = await fetch(url)
	res = await res.text();
	res = res.match(/<div class="badge_card_set_cards">.+?<div style="clear: left;"><\/div>/s)?.[0];
	if(!res) throw 'no partner data';
	return extractCards(
		$J(res+'</div>').find('.badge_card_set_title')
	);
}
/**
 *
 * @param {[CardData]} myCards
 * @param {string} partnerUrl
 * @returns {Promise<string>}
 */
async function matchWithPartner(myCards, partnerUrl){
	let theirСards = await getPartnerCards(partnerUrl);

	if(!theirСards.maxCount || theirСards.maxCount<2) return false;

	let res='';
	for(let mc of myCards.sorted){
		mc._count=mc.count;
		if(mc.count<=1) continue;
		for(let tc of theirСards.sorted){

			if( (mc.i==tc.i) || (tc.count<=1) ) continue;

			let mCanGiveCnt = Math.floor(mc.count/2) - (myCards[tc.i].count);
			if(mCanGiveCnt<=0) continue;

			let tCanGiveCnt = Math.floor(tc.count/2) - (theirСards[mc.i].count);
			if(tCanGiveCnt<=0) continue;

			mCanGiveCnt = Math.min(mCanGiveCnt, tCanGiveCnt);

			mc.count-=mCanGiveCnt;
			tc.count-=mCanGiveCnt;

			//todo card icons
			res+=`${mCanGiveCnt}x [${mc.name}] ⇄ [${tc.name}]<br>`;
		}
	}
	// restore amount
	for(let mc of myCards){
		mc.count=mc._count;
	}
	return res;
}

async function matchWithAll(e){
	$(e.target).remove();
	$out = 	$('<div class="badge_detail_tasks"></div>').insertAfter('div.badge_detail_tasks.footer');
	$out[0].scrollIntoView();


	myCards = getMyCards();
	if(!myCards.maxCount || myCards.maxCount<2) {
		$out.append(t('cm.noMatch'));
		return false;
	}

	let partners = new Set();

	$('.badge_friendwithgamecard>a.persona').each((i,el)=>{
		partners.add(el.href)
	});

	for(let purl of partners){
		$out.append('🔹'+purl);
		let goodRes='', badRes='';
		try{
			goodRes = await matchWithPartner(myCards, purl)
		}catch(e){
			badRes='Error: '+(e.message||e.toString());
		} finally {
			if(goodRes){
				$out.append($('.badge_friendwithgamecard>a.persona[href="'+purl+'"]').parent().css('float','none'));
				$out.append(goodRes);
			} else {
				$out.append('<br>❌'+(badRes||t('cm.noMatch')));
			}
		}
		$out.append('<br><br>');
	}

	return false;
}
$(`<a class="btn_grey_grey btn_medium"><span>${t('cm.matchall')}</span></a>`)
.appendTo('div.gamecards_inventorylink').click(matchWithAll);

async function matchCardsShowModal(e){
	const modalTitl = 'Сard swap matcher';
	let modal = W.ShowBlockingWaitDialog(modalTitl);


	let showRes='', $popup;
	try {

		myCards = getMyCards()
		if(!myCards.maxCount || myCards.maxCount<2) throw false;


		$popup = $(e.target).parents('div.badge_friendwithgamecard_actions');
		let partnerUrl = $popup.parents('div.badge_friendwithgamecard').find('>a.persona').attr('href');

		showRes =  await matchWithPartner(myCards, partnerUrl);
		console.log(showRes);

	} catch(e){
		console.error(e);
		showRes='Error: '+(e.message||e.toString());
	} finally {
		modal.Dismiss();
		console.log(showRes);
		modal = W.ShowDialog(modalTitl, showRes||t('cm.noMatch'));
		if(showRes) // add btn "Offer a trade"
			modal.m_$StandardContent.append($popup.children('div:first').clone());
	}
}