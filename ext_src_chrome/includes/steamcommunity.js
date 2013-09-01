// ==UserScript==
// @include https://steamcommunity.com/id/*
// @include http://steamcommunity.com/id/*
// @include https://steamcommunity.com/profiles/*
// @include http://steamcommunity.com/profiles/*
// ==/UserScript==


(function(){
var $, steamid;
function init(){

	$ = window.$J;
	if (window.g_rgProfileData) {
		profileNewPageInit();
	}
	else if (window.BuildHover) {
		inventoryPageInit();
	}
	else if (window.location.pathname.indexOf('/badges')>-1){
		badgesPageInit();
	}
	else if (/\/gamecards\/\d+/.test(window.location.pathname)){
		gamecardsPageInit();
	}
}


function gamecardsPageInit(){
	$('.badge_card_to_collect_info>.badge_card_set_text:nth-child(1)').each(function(i,el){
		$(el).append(' <b>:: <a href="/market/search?q=appid%3A753+card+'+el.innerHTML+'">найти на маркете</a></b>');
	})
}

function badgesPageInit(){
	$('.profile_badges_sortoptions').append('<a href="#" onclick="showWithDrop()">Показать с невыпавшими картами</a>');
	window.showWithDrop=function(){
		$('.badge_row').filter(function(i,el){
			return !($('a.btn_green_white_innerfade',el).length)
		}).remove()
		return false;
	}
	
}

function includeJS(url){
	document.getElementsByTagName('head')[0].appendChild(document.createElement('SCRIPT')).src=url;
}

function SetRepBadges(selector){
	document.querySelector(selector).insertAdjacentHTML('afterEnd',
		'<a id="csmbadge" class="badge" href="http://check.csmania.ru/#steam:'+steamid+'">CSm: <span></sapn></a> <a id="srbadge" class="badge" href="http://steamrep.com/profiles/'+steamid+'">SR: <span></sapn></a>'
	);
	
	var badges = {
		0:{
			text : 'неизвестен',
			color : '606060'
		},
		1:{
			text : 'гарант',
			color : '5E931B'
		},
		2:{
			text : 'в белом списке',
			color : '247E9E'
		},
		3:{
			text : 'в черном списке',
			color : '9E2424'
		},
		4:{
			text : 'подозрительный',
			color : 'B47200'
		},
		error:{
			text : 'Error',
			color : '606060'
		}
	};
	

	window.setRepStatus = function(res) {
		if(!(res.csm >= 0)){
			res.csm = error;
		}
		document.querySelector('#csmbadge').style.background = '#'+badges[res.csm].color;
		document.querySelector('#csmbadge span').innerHTML = badges[res.csm].text;
		
		var srbcolor;
		if(!res.srcom){
			res.srcom = badges[0].text;
			srbcolor = badges[0].color;
		} else {
			if(res.srcom.indexOf('SCAMMER')>-1){
				srbcolor = badges[3].color;
			} else
			if(res.srcom.indexOf('CAUTION')>-1){
				srbcolor = badges[4].color;
			} else
			if(res.srcom.indexOf('MIDDLEMAN')>-1){
				srbcolor = badges[1].color;
			} else
			if((res.srcom.indexOf('TRUSTED SELLER')>-1)||(res.srcom.indexOf('ADMIN')>-1)){
				srbcolor = badges[2].color;
			} else {
				srbcolor = badges[0].color;
			}
		}
		
		document.querySelector('#srbadge').style.background = '#'+srbcolor;
		document.querySelector('#srbadge span').innerHTML = res.srcom;
		
	}
	
	// get rep status
	includeJS('http://check.csmania.ru/api/swt9Hk02yFhf/0/repforext/'+steamid);
	
}

function inventoryPageInit(){
	// for subid detect
	var ajaxTarget = {descriptions:[]};

	window.getSubid = function(target, itemid){
		ajaxTarget.element = target;
		
		var item = window.UserYou.rgContexts[753][1].inventory.rgInventory[itemid];

		ajaxTarget.classid = item.classid;
		ajaxTarget.giftId = itemid;
		ajaxTarget.giftName = encodeURIComponent(item.name);
		
		includeJS('http://v1t.su/projects/steam/class-sub.php?jsonp=setSubID&get=sub&value='+item.classid);
	}

	window.setSubID=function(subid, f){
		var str = 'SubscriptionID = ';

		if (subid=="0"){
			
			if(window.g_bViewingOwnProfile){
				new window.Ajax.Request( 'http://steamcommunity.com/gifts/' + ajaxTarget.giftId + '/validateunpack', {
					method: 'post',
					parameters: { sessionid: window.g_sessionID },
					onSuccess: function( transport ) {
						window.setSubID(transport.responseJSON.packageid, true);
					}
				});
				return;
			} else
				str += 'не известно';
		} else {
			str += '<a href="http://steamdb.info/sub/'+subid+'">'+subid+'</a>';
			if(f) {
				//send to base | Please do not spam!
				includeJS('http://v1t.su/projects/steam/set_class-sub.php?class='+ajaxTarget.classid+'&sub='+subid+'&name='+ajaxTarget.giftName);
			}
		}
		ajaxTarget.element.outerHTML=str;
		var ds = ajaxTarget.descriptions[ajaxTarget.classid];
		ds[ds.length-1]={value:str};
		ds.withSubid=true;
	}

	// multi gifts sending
	document.body.insertAdjacentHTML("afterBegin",
		'<style>.checkedForSend{background:#366836!important}.itemcount{background:#292929;color:#FFF;font-weight:700;position:absolute;right:0;bottom:0}#inventory_logos{display:none}</style>'
	);
	window.checkedForSend={};
	window.checkForSend = function(giftId){
		var item = window.g_ActiveInventory.selectedItem;
		if(item.checkedForSend){
			item.checkedForSend=false;
			item.element.removeClassName('checkedForSend');
			if(item._amount>1){
				for(var i=0;i<item._amount;i++){
					delete window.checkedForSend[item._ids[i]];
				}
			} else {
				delete window.checkedForSend[giftId];	
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
					window.checkedForSend[item._ids[i]]=item.name;
				}
			} else {
				window.checkedForSend[giftId]=item.name;
			}
		
			item.checkedForSend=true;
			item.element.addClassName('checkedForSend');
			
			
		}
	}
	window.sendChecked = function(){
		var url = 'http://store.steampowered.com/checkout/sendgift/';
		// first to gid
		for(var gid in window.checkedForSend){
			break;
		}
		
		url+=gid+'#multisend='+encodeURIComponent(JSON.stringify(window.checkedForSend))
		
		window.location.href=url;
		
	}
	// END multi gifts sending
	
	//// action for gifts and tf2 items
	var BuildHover_orig = window.BuildHover;
	window.BuildHover = function(){
		var item = arguments[1];
		if(window.g_ActiveInventory && (window.g_ActiveInventory.appid == 753)){
			if ((item.contextid==1) && !item.descriptions.withClassid) {
				item.descriptions.withClassid=true;
				
				if(!item.descriptions)
					item.descriptions = [];
					
				item.descriptions.push({value:'ClassID = '+item.classid});
				item.descriptions.push({value:'<a href="#" onclick="getSubid(event.target, \''+item.id+'\');return false">Получить SubscriptionID</a>'});
				
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
				}
			} else if ((item.contextid==6) && !item.descriptions.swt) {
				item.descriptions.swt=1;
				if(item.tags[2].internal_name=="item_class_4"){
					item.descriptions.push({value:'<img src="http://cdn.steamcommunity.com/economy/emoticon/'+item.name+'"/>'});
				}
				
			
			}
		} else
		if(window.g_ActiveInventory && (window.g_ActiveInventory.appid == 440)){
			if (item.actions.swt!=1) {
				item.actions.swt=1;
				item.actions.push({
					link:'http://backpack.tf/stats/'+item.app_data.def_index+'/'+item.app_data.quality+'/0',
					name:'Цена предмета'
				});
				
			}
		}
		return BuildHover_orig.apply(this, arguments);
	}
	
	
	//// Search on Market Button
	var PopulateMarketActions_orig = window.PopulateMarketActions;
	window.PopulateMarketActions = function (elActions, item) {
		var res = PopulateMarketActions_orig.apply(this, arguments);
		if (!item.marketable) {
			return res;
		}
		elActions.appendChild(window.CreateMarketActionButton('blue', 'http://steamcommunity.com/market/search?q='+item.market_name, 'Найти на маркете'));
		$(elActions).css('display', 'block');
	
		return res;
	}
	
	
	//// Hide Duplicates
	window.UserYou.ReloadInventory_old = window.UserYou.ReloadInventory;
	window.UserYou.ReloadInventory = function(){
		this._hiddenDup = false;
		return window.UserYou.ReloadInventory_old.apply(this, arguments);
	}
	
	var SelectInventoryFromUser_old = window.SelectInventoryFromUser;
	window.SelectInventoryFromUser = function(){
		var appid = arguments[1];
		var contextid = arguments[2];

		var inventory = window.UserYou.getInventory( appid, contextid );
		if (window.localStorage.hideDupItems && !inventory._hiddenDup) {
		
			// display count
			inventory.BuildItemElement_old = inventory.BuildItemElement;
			inventory.BuildItemElement = function(){
				var el = inventory.BuildItemElement_old.apply(this, arguments);
				el.innerHTML+='<div class="itemcount">x'+el.rgItem._amount+'</div>'
				return el;
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

	
	var HTMLHideDup = '<input type="checkbox" name="hidedup" onchange="window.onchangehidedup(event)" '+((window.localStorage.hideDupItems)?'checked="true"':'')+'/>Прятать дубликаты, показывая кол-во';
	document.getElementById('inventory_pagecontrols').insertAdjacentHTML("beforeBegin", HTMLHideDup);
	
	window.onchangehidedup = function(e){
		if(e.target.checked){
			window.localStorage.hideDupItems = 1
		} else {
			window.localStorage.removeItem('hideDupItems')
		}

		window.location.reload();
	};
	
	//// sell dialog accept ssa checked
	$('#market_sell_dialog_accept_ssa')[0].checked=true;
	
	//// multisell
	if(window.localStorage.hideDupItems){
		window.SellItemDialog.OnConfirmationAccept_old = window.SellItemDialog.OnConfirmationAccept;
		var SellCurrentSelection_old = window.SellCurrentSelection;
		window.SellCurrentSelection = function(){
			var res = SellCurrentSelection_old.apply(this, arguments);
			var count = window.g_ActiveInventory.selectedItem._amount;
			if(count>1) {
				var amount =  parseInt(prompt('Сколько продавать? из '+count, count)) || 1;
				if (amount>count)
					amount=count;
				
				window.$('market_sell_dialog_ok').stopObserving();
				if(amount>1){
					window.SellItemDialog._amount=amount;
					window.SellItemDialog._itemNum=0;
					window.SellItemDialog.OnConfirmationAccept_new = function(event){

						window.$('market_sell_dialog_error').hide();
						window.$('market_sell_dialog_ok').fade({duration:0.25});
						window.$('market_sell_dialog_back').fade({duration:0.25});
						window.$('market_sell_dialog_throbber').show();
						window.$('market_sell_dialog_throbber').fade({duration:0.25,from:0,to:1});
						
						window.SellItemDialog.m_item.id=window.SellItemDialog.m_item._ids[window.SellItemDialog._itemNum];
						window.SellItemDialog._itemNum++;

						$.ajax( {
							url: 'https://steamcommunity.com/market/sellitem/',
							type: 'POST',
							data: {
								sessionid: window.g_sessionID,
								appid: window.SellItemDialog.m_item.appid,
								contextid: window.SellItemDialog.m_item.contextid,
								assetid: window.SellItemDialog.m_item.id,
								amount: window.SellItemDialog.m_nConfirmedQuantity,
								price: window.SellItemDialog.m_nConfirmedPrice
							},
							crossDomain: true,
							xhrFields: { withCredentials: true }
						} ).done( function ( data ) {
							$('#market_sell_dialog_item_availability_hint>.market_dialog_topwarning').text('Выставлен №'+window.SellItemDialog._itemNum);
							if(window.SellItemDialog._itemNum>=window.SellItemDialog._amount)
								window.SellItemDialog.OnSuccess( { responseJSON: data } );
							else {
								return window.SellItemDialog.OnConfirmationAccept_new.apply(window.SellItemDialog, arguments);
							}
						} ).fail( function( jqxhr ) {
							// jquery doesn't parse json on fail
							var data = $.parseJSON( jqxhr.responseText );
							window.SellItemDialog.OnFailure( { responseJSON: data } );
						} );

						event.stop();
						
					}
					window.SellItemDialog.OnConfirmationAccept = window.SellItemDialog.OnConfirmationAccept_new;
				} else {
					window.SellItemDialog.OnConfirmationAccept = window.SellItemDialog.OnConfirmationAccept_old;
				}
				window.$J('#market_sell_dialog_ok').click(window.SellItemDialog.OnConfirmationAccept);
				
			}
			return res;
		}
		
	}
	
}

function profileNewPageInit(){

	steamid = window.g_rgProfileData.steamid;

	var profilesLinks = [
		{
			id:   'srch_sr',
			href: 'http://forums.steamrep.com/search/search?keywords='+steamid,
			icon: 'http://steamrep.com/favicon.ico',
			text: 'Искать на форумах SteamRep.com',
		},
		{
			id:   'srch_sop',
			href: 'http://forums.sourceop.com/search.php?do=process&query='+steamid,
			icon: 'http://forums.sourceop.com/favicon.ico',
			text: 'Искать на форумах SourceOP.com',
		},
		{hr:true},
		{	
			id:   'inv_bptf',
			href: 'http://backpack.tf/id/'+steamid,
			icon: 'http://backpack.tf/favicon.ico',
			text: 'Инвентарь Backpack.tf',
		},
		{
			id:   'inv_tf2b',
			href: 'http://tf2b.com/tf2/'+steamid,
			icon: 'http://tf2b.com/favicon.ico',
			text: 'Инвентарь TF2B.com',
		},
		{
			id:   'inv_tf2op',
			href: 'http://tf2outpost.com/backpack/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon_440.ico',
			text: 'Инвентарь TF2OutPost.com',
		},
		{
			id:   'trds_tf2op',
			href: 'http://tf2outpost.com/user/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon_440.ico',
			text: 'Трэйды на TF2OutPost.com',
		},
		{
			id:   'trds_d2lng',
			href: 'http://dota2lounge.com/profile?id='+steamid,
			icon: 'http://dota2lounge.com/favicon.ico',
			text: 'Трэйды на Dota2Lounge.com',
		},
		{
			id:   'inv_sm',
			href: 'http://steammoney.com/userpage.php?id='+steamid,
			icon: 'http://steammoney.com/favicon.ico',
			text: 'Инвентарь SteamMoney.com',
		},
		{
			id:   'inv_spub',
			href: 'http://steampub.ru/user/'+steamid,
			icon: 'http://steampub.ru/favicon.ico',
			text: 'Профиль на SteamPub.ru',
		},
		{hr:true},

	];

	
	// Styles
	document.body.insertAdjacentHTML("afterBegin", 
		'<style>.badge{border-radius:3px;box-shadow:1px 1px 0px 0px #1D1D1D;font-size:.7em;margin-top:1px;padding:3px;}#swt_info{position:absolute;top:201px}</style>'
	);
	
	
	$('.profile_header').append('<div id="swt_info"><span id="permlink"> SteamID64: <a href="http://steamcommunity.com/profiles/'+steamid+'">'+steamid+'</a> </span> <a href="#getMoreInfo" onclick="getMoreInfo();return false">Get more info</a></div>');
	
	
	SetRepBadges('#permlink');
	window.getMoreInfo = function() {
		var Modal = window.ShowDialog('Extended Info', $('<div id="swtexinfo"><img src="http://cdn.steamcommunity.com/public/images/login/throbber.gif"></div>'));
		window.setTimeout(function(){Modal.AdjustSizing();},1);
		$.ajax({
			url: window.location.href+'?xml=1',
			context: document.body,
			dataType: 'xml'
		}).done(function(responseText, textStatus, xhr) {
			var xml = $(xhr.responseXML);
			var isLimitedAccount = xml.find('isLimitedAccount').text();
			var tradeBanState = xml.find('tradeBanState').text();
			var vacBanned = xml.find('vacBanned').text();
			var accCrDate = xml.find('memberSince').text();
			$('#swtexinfo').html(
				'<table>'+
				'<tr><td><b>Registration date</b></td><td>'+accCrDate+'</td>'+
				'<tr><td><b>VAC</b></td><td>'+(vacBanned=='0'?'Clear':'Banned')+'</td>'+
				'<tr><td><b>Trade Ban</b></td><td>'+tradeBanState+'</td>'+
				'<tr><td><b>Is Limited Account</b></td><td>'+(vacBanned=='0'?'No':'Yes')+'</td>'+
				'</table>'
			);
			window.setTimeout(function(){Modal.AdjustSizing();},1);
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
	// inventory gifts link
	el = document.querySelector('.profile_count_link a[href$="inventory/"]');
	if(el)
		el.insertAdjacentHTML('afterEnd', ': <span class="linkActionSubtle"><a title="Steam Gifts" href="'+el.href+'#753_1"><img src="http://cdn.store.steampowered.com/public/images/v5/inbox_gift.png"/></a> <a title="Steam Cards" href="'+el.href+'#753_6"><img src="http://cdn.store.steampowered.com/public/images/ico/ico_cards.gif"/></a> <a title="TF2" href="'+el.href+'#440"><img src="http://media.steampowered.com/apps/tf2/blog/images/favicon.ico"/></a> <a title="Dota 2" href="'+el.href+'#570"><img src="http://www.dota2.com/images/favicon.ico"/></a></span>');
		
	

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

var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);
	
})();