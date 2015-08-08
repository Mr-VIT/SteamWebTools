// ==UserScript==
// @include https://steamcommunity.com/id/*
// @include http://steamcommunity.com/id/*
// @include https://steamcommunity.com/profiles/*
// @include http://steamcommunity.com/profiles/*
// ==/UserScript==

var $, steamid;
function init(){

	$ = W.$J;
	if (W.g_rgProfileData) {
		profileNewPageInit();
	}
	else if (W.g_strInventoryLoadURL) {
		inventoryPageInit();
	}
	else if (W.location.pathname.indexOf('/badges')>-1){
		badgesPageInit();
	}
	else if (/\/gamecards\/\d+/.test(W.location.pathname)){
		gamecardsPageInit();
	}
}


function gamecardsPageInit(){
	var app = W.location.pathname.match(/\/gamecards\/(\d+)/)[1];
	$('.gamecards_inventorylink').append('<a class="btn_grey_grey btn_small_thin" href="http://www.steamcardexchange.net/index.php?inventorygame-appid-'+app+'"><span>www.SteamCardExchange.net</span></a>');
}

function badgesPageInit(){
	$('.badge_details_set_favorite').append('<div class="btn_grey_black btn_small_thin" onclick="showWithDrop()"><span>Показать с невыпавшими картами</span></div>');
	W.showWithDrop=function(){
		$('.badge_row').filter(function(i,el){
			return !($('a.btn_green_white_innerfade',el).length)
		}).remove()
		return false;
	}

}
function inventoryPageInit(){
	// for subid detect
	var ajaxTarget = {descriptions:[]};

	W.getSubid = function(target, itemid){
		ajaxTarget.element = target;

		var item = W.UserYou.rgContexts[753][1].inventory.rgInventory[itemid];

		ajaxTarget.classid = item.classid;
		ajaxTarget.giftId = itemid;
		ajaxTarget.giftName = encodeURIComponent(item.name);

		new W.Ajax.Request( 'http://steamcommunity.com/gifts/' + ajaxTarget.giftId + '/validateunpack', {
			method: 'post',
			parameters: { sessionid: W.g_sessionID },
			onSuccess: function( transport ) {
				W.setSubID(transport.responseJSON.packageid);
			}
		});
	}

	W.setSubID=function(subid){
		var str = 'SubscriptionID = <a href="http://steamdb.info/sub/'+subid+'">'+subid+'</a>';
		ajaxTarget.element.outerHTML=str;
		var ds = ajaxTarget.descriptions[ajaxTarget.classid];
		ds[ds.length-1]={value:str};
		ds.withSubid=true;
	}


	// multi gifts sending
	document.body.insertAdjacentHTML("afterBegin",
		'<style>.checkedForSend{background:#366836!important}.itemcount{background:#292929;color:#FFF;font-weight:700;position:absolute;right:0;bottom:0}#inventory_logos{display:none}</style>'
	);
	W.checkedForSend={};
	W.checkForSend = function(giftId){
		var item = W.g_ActiveInventory.selectedItem;
		if(item.checkedForSend){
			item.checkedForSend=false;
			item.element.removeClassName('checkedForSend');
			if(item._amount>1){
				for(var i=0;i<item._amount;i++){
					delete W.checkedForSend[item._ids[i]];
				}
			} else {
				delete W.checkedForSend[giftId];
			}

		} else {
			var amount = 1;
			if(item._amount>1) {
				amount =  parseInt(prompt('Сколько выбрать? из '+item._amount, item._amount)) || 1;
				if (amount>item._amount)
					amount=item._amount;
			}
			if(amount>1){
				for(var i=0;i<amount;i++){
					W.checkedForSend[item._ids[i]]=item.name;
				}
			} else {
				W.checkedForSend[giftId]=item.name;
			}

			item.checkedForSend=true;
			item.element.addClassName('checkedForSend');


		}
	}
	W.sendChecked = function(){
		var url = 'http://store.steampowered.com/checkout/sendgift/';
		// first to gid
		for(var gid in W.checkedForSend){
			break;
		}

		url+=gid+'#multisend='+encodeURIComponent(JSON.stringify(W.checkedForSend))

		W.location.href=url;

	}
	// END multi gifts sending

	//// gifts notes
	var giftsNotes = W.localStorage.giftsNotes;
	if(giftsNotes)
		giftsNotes = JSON.parse(giftsNotes);
	else giftsNotes={};
	W.loadGiftNote = function(){
		var gid = W.g_ActiveInventory.selectedItem.id;
		if(!$('#iteminfo'+W.iActiveSelectView+'_item_tags_content textarea.giftnote').length)
			$('#iteminfo'+W.iActiveSelectView+'_item_tags_content').append('<br/><textarea class="giftnote" style="width:100%">'+(giftsNotes[gid]||'')+'</textarea><button onclick="saveGiftNote(\''+gid+'\')">Save</button>');
	}
	W.saveGiftNote = function(gid){
		giftsNotes[gid]=$('#iteminfo'+W.iActiveSelectView+'_content textarea.giftnote').val();
		W.localStorage.giftsNotes = JSON.stringify(giftsNotes);
	}

	//// action for gifts and tf2 items
	var BuildHover_orig = W.BuildHover;
	W.BuildHover = function(){
		var item = arguments[1];
		// gifts
		if(W.g_ActiveInventory && (W.g_ActiveInventory.appid == 753)){
			if ((item.contextid==1) && !item.descriptions.withClassid) {
				item.descriptions.withClassid=true;

				if(!item.descriptions)
					item.descriptions = [];

				item.descriptions.push({value:'ClassID = '+item.classid});
				if(W.g_bViewingOwnProfile)
					item.descriptions.push({value:'<a href="#" onclick="getSubid(event.target,\''+item.id+'\');return false">Получить SubscriptionID</a>',type:'html'});

				if(!ajaxTarget.descriptions[item.classid])
					ajaxTarget.descriptions[item.classid] = item.descriptions;


				if(item.owner_actions) {
					item.owner_actions.push({
						link:'javascript:checkForSend("%assetid%")',
						name:'Выбрать для отправки'
					});
					item.owner_actions.push({
						link:'javascript:sendChecked()',
						name:'Отправить выбранные'
					});
					item.owner_actions.push({
						link:'javascript:loadGiftNote()',
						name:'Посмотреть заметку'
					});
				}
			}
		}
		return BuildHover_orig.apply(this, arguments);
	}


	//// View in Market Button
	// not for me
	if (W.UserYou.strSteamId!=W.g_steamID){
		var PopulateMarketActions_orig = W.PopulateMarketActions;
		W.PopulateMarketActions = function (elActions, item) {
			var res = PopulateMarketActions_orig.apply(this, arguments);
			if (!item.marketable) {
				return res;
			}
			var market_hash_name = item.market_hash_name ? item.market_hash_name : item.market_name;
			elActions.appendChild(W.CreateMarketActionButton('blue', 'http://steamcommunity.com/market/listings/'+item.appid+'/'+market_hash_name, 'Мин цена на маркете: <span id="swt_lowestItemPrice_'+item.classid+'">?</span>'));
			$(elActions).css('display', 'block');
			$.ajax( {
				url: 'http://steamcommunity.com/market/priceoverview/',
				type: 'GET',
				data: {
					country: W.g_strCountryCode,
					currency: typeof(W.g_rgWalletInfo) != 'undefined' ? W.g_rgWalletInfo['wallet_currency'] : 1,
					appid: item.appid,
					market_hash_name: market_hash_name
				}
			} ).done( function ( data ) {
				var price='ERROR';
				if(data.success){
					price=data.lowest_price
				}
				$('#swt_lowestItemPrice_'+item.classid).html(price);
			} ).fail(function(jqxhr) {
				$('#swt_lowestItemPrice_'+item.classid).text('ERROR');
			} );


			return res;
		}
	}

	//// Hide Duplicates

	var SelectInventoryFromUser_old = W.SelectInventoryFromUser;
	W.SelectInventoryFromUser = function(){
		var appid = arguments[1];
		var contextid = arguments[2];

		var inventory = W.UserYou.getInventory( appid, contextid );
		if (W.localStorage.hideDupItems && !inventory._hiddenDup) {

			// display count
			if(!inventory.BuildItemElement_old){
				inventory.BuildItemElement_old = inventory.BuildItemElement;
				inventory.BuildItemElement = function(){
					var el = inventory.BuildItemElement_old.apply(this, arguments);
					var a = el.rgItem._amount;
					if (a)
						el.innerHTML+='<div class="itemcount">x'+a+'</div>';
					return el;
				}
			}

			var itemsA = [];

			if(inventory.rgChildInventories) {
				for(var x in inventory.rgChildInventories){
					inventory.rgChildInventories[x].BuildItemElement = inventory.BuildItemElement; // display count
					itemsA.push(inventory.rgChildInventories[x].rgInventory);
				}
			} else {
				if(inventory.rgInventory)
					itemsA.push(inventory.rgInventory);
			}

			if(itemsA.length){
				inventory._hiddenDup = true;
				var items, newItems;
				for(var i=0; i<itemsA.length; i++){
					items = itemsA[i];
					newItems=[];

					for ( var j in items ){
						if(items[j]._is_stackable || items[j].is_stackable)
							continue;
						if(newItems[items[j].classid]){
							newItems[items[j].classid]._amount +=1;
							newItems[items[j].classid]._ids.push(items[j].id);
							delete items[j];
						} else {
							items[j]._is_stackable = true;
							items[j]._amount = 1;
							items[j]._ids = [items[j].id];
							newItems[items[j].classid] = items[j];
						}
					}
				}
			}

		}

		return SelectInventoryFromUser_old.apply(this, arguments);
	}


	var HTMLHideDup = '<input type="checkbox" name="hidedup" onchange="W.onchangehidedup(event)" '+((W.localStorage.hideDupItems)?'checked="true"':'')+'/>Прятать дубликаты, показывая кол-во';
	document.getElementById('inventory_pagecontrols').insertAdjacentHTML("beforeBegin", HTMLHideDup);

	W.onchangehidedup = function(e){
		if(e.target.checked){
			W.localStorage.hideDupItems = 1
		} else {
			W.localStorage.removeItem('hideDupItems')
		}

		W.location.reload();
	};

	//// sell dialog accept ssa checked
	$('#market_sell_dialog_accept_ssa').attr('checked',true);

	//// multisell
	if(W.localStorage.hideDupItems){
		W.SellItemDialog.OnConfirmationAccept_old = W.SellItemDialog.OnConfirmationAccept;
		var SellCurrentSelection_old = W.SellCurrentSelection;
		W.SellCurrentSelection = function(){
			var res = SellCurrentSelection_old.apply(this, arguments);
			var count = W.g_ActiveInventory.selectedItem._amount;
			W.$('market_sell_dialog_ok').stopObserving();
			$('#market_sell_dialog_ok').unbind();
			if(count>1) {
				var amount =  parseInt(prompt('Сколько продавать? из '+count, count)) || 1;
				if (amount>count)
					amount=count;

				if(amount>1){
					W.SellItemDialog._amount=amount;
					W.SellItemDialog._itemNum=0;
					W.SellItemDialog.OnConfirmationAccept_new = function(event){

						W.$('market_sell_dialog_error').hide();
						W.$('market_sell_dialog_ok').fade({duration:0.25});
						W.$('market_sell_dialog_back').fade({duration:0.25});
						W.$('market_sell_dialog_throbber').show();
						W.$('market_sell_dialog_throbber').fade({duration:0.25,from:0,to:1});

						W.SellItemDialog.m_item.id=W.SellItemDialog.m_item._ids[W.SellItemDialog._itemNum];
						W.SellItemDialog._itemNum++;

						$.ajax( {
							url: 'https://steamcommunity.com/market/sellitem/',
							type: 'POST',
							data: {
								sessionid: W.g_sessionID,
								appid: W.SellItemDialog.m_item.appid,
								contextid: W.SellItemDialog.m_item.contextid,
								assetid: W.SellItemDialog.m_item.id,
								amount: W.SellItemDialog.m_nConfirmedQuantity,
								price: W.SellItemDialog.m_nConfirmedPrice
							},
							crossDomain: true,
							xhrFields: { withCredentials: true }
						} ).done( function ( data ) {
							$('#market_sell_dialog_item_availability_hint>.market_dialog_topwarning').text('Выставлен №'+W.SellItemDialog._itemNum);
							if(W.SellItemDialog._itemNum>=W.SellItemDialog._amount)
								W.SellItemDialog.OnSuccess( { responseJSON: data } );
							else {
								return W.SellItemDialog.OnConfirmationAccept_new.apply(W.SellItemDialog, arguments);
							}
						} ).fail( function( jqxhr ) {
							// jquery doesn't parse json on fail
							var data = $.parseJSON( jqxhr.responseText );
							W.SellItemDialog.OnFailure( { responseJSON: data } );
						} );
						//W.SellItemDialog.Dismiss();
						//event.stop();

					}
					W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_new;
				} else {
					W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_old;
				}


			} else
				W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_old;
			$('#market_sell_dialog_ok').on("click", $.proxy(W.SellItemDialog.OnConfirmationAccept, W.SellItemDialog));
			return res;
		}

	}

}

function profileNewPageInit(){

	steamid = W.g_rgProfileData.steamid;

	var profilesLinks = [
		{
			href: 'http://check.csmania.ru/#steam:'+steamid,
			icon: 'http://check.csmania.ru/favicon.ico',
			text: 'Проверить на Check.CSMania.RU',
		},
		{
			href: 'http://steamrep.com/profiles/'+steamid,
			icon: 'http://steamrep.com/favicon.ico',
			text: 'Проверить на SteamRep.com',
		},
		{hr:true},
		{
			href: 'http://forums.steamrep.com/search/search?keywords='+steamid,
			icon: 'http://steamrep.com/favicon.ico',
			text: 'Искать на форумах SteamRep.com',
		},
		{
			href: 'http://www.google.com/#q='+steamid+' inurl:sourceop.com',
			icon: 'http://forums.sourceop.com/favicon.ico',
			text: 'Искать на форумах SourceOP.com',
		},
		{
			href: 'http://www.steamtrades.com/user/id/'+steamid,
			icon: 'http://www.steamgifts.com/favicon.ico',
			text: 'Профиль на SteamGifts.com',
		},
		{hr:true},
		{
			href: 'http://backpack.tf/profiles/'+steamid,
			icon: 'http://backpack.tf/favicon_440.ico',
			text: 'Инвентарь Backpack.tf',
		},
		{
			href: 'http://tf2b.com/tf2/'+steamid,
			icon: 'http://tf2b.com/favicon.ico',
			text: 'Инвентарь TF2B.com',
		},
		{
			href: 'http://tf2outpost.com/backpack/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon_440.ico',
			text: 'Инвентарь TF2OutPost.com',
		},
		{hr:true},
		{
			href: 'http://tf2outpost.com/user/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon_440.ico',
			text: 'Трэйды на TF2OutPost.com',
		},
		{
			href: 'http://dota2lounge.com/profile?id='+steamid,
			icon: 'http://dota2lounge.com/favicon.ico',
			text: 'Трэйды на Dota2Lounge.com',
		},
		{
			href: 'http://csgolounge.com/profile?id='+steamid,
			icon: 'http://csgolounge.com/favicon.ico',
			text: 'Трэйды на CSGOLounge.com',
		},
		{hr:true},
		{
			href: 'http://steammoney.com/trade/user/'+steamid,
			icon: 'http://steammoney.com/favicon.ico',
			text: 'Инвентарь SteamMoney.com',
		},
		{
			id:   'inv_spub',
			href: 'http://steampub.ru/user/'+steamid,
			icon: 'http://steampub.ru/favicon.ico',
			text: 'Профиль на SteamPub.ru',
		},
		{hr:true}

	];


	// Styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>#swt_info{position:absolute;top:201px}</style>'
	);


	$('.profile_header').append('<div id="swt_info">SteamID64: <a href="http://steamcommunity.com/profiles/'+steamid+'">'+steamid+'</a> | <a href="#getMoreInfo" onclick="getMoreInfo();return false">Get more info</a></div>');

	W.getMoreInfo = function() {
		var Modal = W.ShowDialog('Extended Info', $('<div id="swtexinfo"><img src="http://cdn.steamcommunity.com/public/images/login/throbber.gif"></div>'));
		W.setTimeout(function(){Modal.AdjustSizing();},1);
		$.ajax({
			url: W.location.href+'?xml=1',
			context: document.body,
			dataType: 'xml'
		}).done(function(responseText, textStatus, xhr) {
			var xml = $(xhr.responseXML);
			var isLimitedAccount = xml.find('isLimitedAccount').text();
			var tradeBanState = xml.find('tradeBanState').text();
			var vacBanned = xml.find('vacBanned').text();
			var accCrDate = xml.find('memberSince').text();

			// calc STEAMID
			var steamid2 = parseInt(steamid.substr(-10),10);
			var srv = steamid2 % 2;
			var accountid = steamid2 - 7960265728;
			steamid2 = "STEAM_0:" + srv + ":" + ((accountid-srv)/2);


			$('#swtexinfo').html(
				'<table>'+
				'<tr><td><b>CommunityID</b></td><td>'+steamid+'</td>'+
				'<tr><td><b>SteamID</b></td><td>'+steamid2+'</td>'+
				'<tr><td><b>AccountID</b></td><td>'+accountid+'</td>'+
				'<tr><td><b>Registration date</b></td><td>'+accCrDate+'</td>'+
				'<tr><td><b>VAC</b></td><td>'+(vacBanned=='0'?'Clear':'Banned')+'</td>'+
				'<tr><td><b>Trade Ban</b></td><td>'+tradeBanState+'</td>'+
				'<tr><td><b>Is Limited Account</b></td><td>'+(isLimitedAccount=='0'?'No':'Yes')+'</td>'+
				'</table>'
			);
			W.setTimeout(function(){Modal.AdjustSizing();},1);
		}).fail(function(){
			$('#swtexinfo').html('Request Error / Ошибка при получении данных')
		});
	};


	// chat button
	try {
		var pm_btn = $('.profile_header_actions>a.btn_profile_action[href^="javascript:LaunchWebChat"]')[0];
		pm_btn.outerHTML='<span class="btn_profile_action btn_medium"><span><a href="steam://friends/message/'+steamid+'">Chat: Steam</a> | <a href="'+pm_btn.href+'">Web</a></span></span>';
	} catch(e) {};

	// Games link - tab all games
	var el = document.querySelector('.profile_count_link a[href$="games/"]');
	if(el) el.href+='?tab=all';
	// inventory links
	el = document.querySelector('.profile_count_link a[href$="inventory/"]');
	if(el)
		el.insertAdjacentHTML('afterEnd', ': <span class="linkActionSubtle"><a title="Steam Gifts" href="'+el.href+'#753_1"><img src="http://www.iconsearch.ru/uploads/icons/basicset/16x16/present_16.png"/></a> <a title="Steam Cards" href="'+el.href+'#753_6"><img width="26" height="16" src="http://store.akamai.steamstatic.com/public/images/ico/ico_cards.png"/></a> <a title="TF2" href="'+el.href+'#440"><img src="http://media.steampowered.com/apps/tf2/blog/images/favicon.ico"/></a> <a title="Dota 2" href="'+el.href+'#570"><img src="http://www.dota2.com/images/favicon.ico"/></a> <a title="CSGO" href="'+el.href+'#730"><img src="http://blog.counter-strike.net/wp-content/themes/counterstrike_launch/favicon.ico"/></a></span>');



	var out = '', link;
	for (var i=0; i < profilesLinks.length; i++){
		link = profilesLinks[i];

		if (link.hr) {
			out +='<hr/>';
		} else {
			out += '<a class="popup_menu_item" href="'+link.href+'"><img style="width:18px;height:18px" src="'+link.icon+'"> '+link.text+'</a>';
		}

	}
	try {
		document.querySelector('#profile_action_dropdown>.popup_body.popup_menu').insertAdjacentHTML("afterBegin", out);
	} catch(err) {
		// "More" button for self profile
		$('.profile_header_actions').append('<span class="btn_profile_action btn_medium" onclick="ShowMenu(this,\'profile_action_dropdown\',\'right\')"><span>More <img src="http://cdn.steamcommunity.com/public/images/profile/profile_action_dropdown.png"/></span></span><div class="popup_block" id="profile_action_dropdown" style="visibility:visible;display:none"><div class="popup_body popup_menu">'+out+'</div></div>')
	}


}

init();