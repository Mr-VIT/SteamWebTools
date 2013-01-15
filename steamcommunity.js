// ==UserScript==
// @include https://steamcommunity.com/id/*
// @include http://steamcommunity.com/id/*
// @include https://steamcommunity.com/profiles/*
// @include http://steamcommunity.com/profiles/*
// ==/UserScript==


(function(){

function init(){

	// for profile page
	if (window.ajaxFriendUrl) {

		var steamid = window.invitee
		if(!steamid){
			steamid = window.ajaxFriendUrl.split('/');
			steamid = steamid[steamid.length-1];
		}
		
		document.body.insertAdjacentHTML("afterBegin", 
			'<style>#csmbadge{border-radius:3px;box-shadow:1px 1px 0px 0px #1D1D1D;float:right;font-size:.7em;margin-right:10px;margin-top:1px;padding:3px;}</style>'
		);
		
		
		document.querySelector('#namehistory_link').insertAdjacentHTML('afterEnd',
			'<a id="csmbadge" href="http://check.csmania.ru/#steam:'+steamid+'">CSm: <span></sapn></a>'
		);
		
		// permanent URL and names history
		document.querySelector('#profileBlock').insertAdjacentHTML('beforeBegin', '<div><a href="http://steamcommunity.com/profiles/'+steamid+'/namehistory">Последние 10 имен</a><br/>\
		Постоянная ссылка:<br/><a href="http://steamcommunity.com/profiles/'+steamid+'">http://steamcommunity.com/profiles/'+steamid+'</a><br/><br/></div>');
		
		
		var badge;
		
		window.CSMsetStatus = function(res) {
			switch(res.status) {
				case 0:
					badge = {
						text : 'неизвестный пользователь',
						color : '606060'
					}
					break;
				case 1:
					badge = {
						text : 'гарант',
						color : '5E931B'
					}
					break;
				case 2:
					badge = {
						text : 'в белом списке',
						color : '247E9E'
					}
					break;
				case 3:
					badge = {
						text : 'в черном списке',
						color : '9E2424'
					}
					break;
				case 4:
					badge = {
						text : 'подозрительный',
						color : 'B47200'
					}
					break;
				default:
					badge = {
						text : 'Error',
						color : '606060'
					}
					break;
			}
			document.querySelector('#csmbadge').style.background = '#'+badge.color;
			document.querySelector('#csmbadge span').innerHTML = badge.text;
			
		}
		
		document.getElementsByTagName('head')[0].appendChild(document.createElement('SCRIPT')).src='http://check.csmania.ru/api/swt9HkO2yFhf/0/getstatus/steam:'+steamid+'/jsonp:CSMsetStatus';
		
		
		
		// Games link - tab all games
		document.querySelector('a.linkActionMinor[href$="games/"]').href+='?tab=all'


		var links = [];

		// "add friend" & "del friend"
		if(!window.g_steamID) {
			links.push({
				href: 'steam://friends/add/'+steamid,
				icon: 'http://cdn.steamcommunity.com/public/images/skin_1/iconAddFriend.png',
				text: 'Добавить в друзья',
			});
			links.push({hr:true});
		} else if(document.querySelector('#inCommon .YouAreFriends')) {
			window.ajaxFriendUrl = "http://steamcommunity.com/actions/RemoveFriendAjax/"+steamid;

			addLinks('<div class="notificationSpacer"><div id="NotificationArea" style="display:none"></div><div class="actionItem" id="AddFriendItem"><div class="actionItemIcon"><a  href="javascript:ajaxAddFriend()"><img src="http://cdn.steamcommunity.com/public/images/skin_1/iconFriends.png" width="16" height="16" border="0" /></a></div><a class="linkActionMinor " href="javascript:ajaxAddFriend()">Удалить из друзей</a></div></div>');
			
		}

		// base links
		links = links.concat([
			{
				href: 'http://check.csmania.ru/#steam:'+steamid,
				icon: 'http://check.csmania.ru/favicon.ico',
				text: 'Проверить на Check.CSmania.RU',
			},
			{
				href: 'http://steamrep.com/profiles/'+steamid,
				icon: 'http://steamrep.com/favicon.ico',
				text: 'Проверить на SteamRep.com',
			},
			{hr:true},
			{
				href: 'http://backpack.tf/id/'+steamid,
				icon: 'http://backpack.tf/favicon.ico',
				text: 'Инвентарь Backpack.tf',
			},
			{
				href: 'http://tf2b.com/tf2/'+steamid,
				icon: 'http://tf2b.com/favicon.ico',
				text: 'Инвентарь TF2B.com',
			},
			{
				href: 'http://tf2outpost.com/id/'+steamid,
				icon: 'http://tf2outpost.com/favicon.ico',
				text: 'Инвентарь TF2OutPost.com',
			},
			{
				href: 'http://tf2outpost.com/user/'+steamid,
				icon: 'http://tf2outpost.com/favicon.ico',
				text: 'Трэйды на TF2OutPost.com',
			},
			{
				href: 'http://steammoney.com/userpage.php?id='+steamid,
				icon: 'http://steammoney.com/favicon.ico',
				text: 'Инвентарь SteamMoney.com',
			},
			{hr:true},

		]);

		addLinks(links);

	} // end for profile page
	else
	// for invetory page
	if (window.BuildHover) {
		
		
		// multi gifts sending
		document.body.insertAdjacentHTML("afterBegin", 
			'<style>.checkedForSend{background:#366836!important}</style>'
		);
		window.checkedForSend={};
		window.checkForSend = function(giftId){
			var item = window.UserYou.rgContexts[753][1].inventory.rgInventory[giftId];
			if(item.checkedForSend){
				item.checkedForSend=false;
				item.element.removeClassName('checkedForSend');
				delete window.checkedForSend[giftId];

			} else {
				item.checkedForSend=true;
				item.element.addClassName('checkedForSend');
				
				window.checkedForSend[giftId]=item.name;
			}
		}
		window.sendChecked = function(){
			var url = 'http://store.steampowered.com/checkout/sendgift/';
			for(var gid in window.checkedForSend){
				break;
			}
			
			url+=gid+'#multisend='+encodeURIComponent(JSON.stringify(window.checkedForSend))
			
			window.location.href=url;
			
		}
		// end multi gifts sending
		
		var BuildHover_old = window.BuildHover;

		window.BuildHover = function(){
			if(window.g_ActiveInventory && (window.g_ActiveInventory.appid == 753)){
				var item = arguments[1];
				if (!item.descriptions.withClassid) {
					item.descriptions.withClassid=true;
					
					if(!item.descriptions)
						item.descriptions = [];
						
					item.descriptions.push({value:'ClassID = '+item.classid});
					item.descriptions.push({value:'<a href="#" onclick="getSubid(event.target,'+item.classid+');return false">Получить SubscriptionID</a>'});

					window.ajaxTarget.descriptions = item.descriptions;
				

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
				}
			}
			return BuildHover_old.apply(this, arguments);
		}
		
		
		//// Hide Duplicates
		window.hiddenDupGifts = [];
		
		window.UserYou.ReloadInventory_old = window.UserYou.ReloadInventory;
		window.UserYou.ReloadInventory = function(){
			window.hiddenDupGifts[arguments[0]] = false;
			return window.UserYou.ReloadInventory_old.apply(this, arguments);
		}
		
		var SelectInventory_old = window.SelectInventory;
		window.SelectInventory = function(){
			// do only if steam items

			if (window.localStorage.hideDupGifts && !window.hiddenDupGifts[arguments[0]]) {

				var inventory = window.UserYou.getInventory( arguments[0], arguments[1] );

				var itemsA = [];

				if(inventory.rgChildInventories) {
					for(var x in inventory.rgChildInventories){
						itemsA.push(inventory.rgChildInventories[x].rgInventory);
					}
				} else {
					if(inventory.rgInventory)
						itemsA.push(inventory.rgInventory);
				}

				if(itemsA.length){
					window.hiddenDupGifts[arguments[0]] = true;
					var items, newItems;
					for(var i=0; i<itemsA.length; i++){
						items = itemsA[i];
						newItems=[];

						for ( var j in items ){
							if(items[j].is_stackable)
								continue;
							if(newItems[items[j].classid]){
								newItems[items[j].classid].amount +=1;
								delete items[j];
							} else {
								items[j].is_stackable = true;
								items[j].amount = 1;
								newItems[items[j].classid] = items[j];
							}
						}
					}
				}
				
			}

			return SelectInventory_old.apply(this, arguments);
		}

		var HTMLHideDup = '<input type="checkbox" name="hidedup" onchange="window.onchangehidedup(event)" '+((window.localStorage.hideDupGifts)?'checked="true"':'')+'/>Прятать дубликаты, показывая кол-во';
		document.getElementById('inventory_pagecontrols').insertAdjacentHTML("beforeBegin", HTMLHideDup);
		
		window.onchangehidedup = function(e){
			if(e.target.checked){
				window.localStorage.hideDupGifts = 1
			} else {
				window.localStorage.removeItem('hideDupGifts')
			}

			window.location.reload();
		};
	}
	// end for invetory page
}

function addLinks(links){
	var out;
	if (typeof links == 'string') {
		out = links;
	} else {
		out='';
		var link;
		for (var i=0; i < links.length; i++){
			link = links[i];

			if (link.hr) {
				out +='<hr/>';
			} else {
				out += '<div class="actionItem"><div class="actionItemIcon"><a href="'+link.href+'">\
	<img src="'+link.icon+'" width="16" height="16" border="0">\
	</a></div><a class="linkActionMinor" href="'+link.href+'">'+link.text+'</a></div>';
			}

		}
	}
	document.querySelector('#rightActionBlock').insertAdjacentHTML("afterBegin", out);
}

// for subid detect
window.ajaxTarget = {};

window.getSubid = function(target, classid){

	window.ajaxTarget.element=target;

	document.getElementsByTagName('head')[0].appendChild(document.createElement('SCRIPT')).src='http://v1t.su/projects/steam/class-sub.php?jsonp=setSubID&get=sub&value='+classid;
}

window.setSubID=function(subid){
	var str = 'SubscriptionID = ';

	if (subid=="0"){
		str += 'не известно';
	} else {
		str += '<a href="http://cdr.thebronasium.com/sub/'+subid+'">'+subid+'</a>';
	}
	window.ajaxTarget.element.outerHTML=str;
	window.ajaxTarget.descriptions[window.ajaxTarget.descriptions.length-1]={value:str};
	window.ajaxTarget.descriptions.withSubid=true;
}

var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);
	
})();