// ==UserScript==
// @include https://steamcommunity.com/id/*
// @include http://steamcommunity.com/id/*
// @include https://steamcommunity.com/profiles/*
// @include http://steamcommunity.com/profiles/*
// ==/UserScript==


(function(){

function init(){

	if (window.ajaxFriendUrl) {
		profilePageInit();
	} 
	else if (window.BuildHover) {
		inventoryPageInit();
	}

}


function inventoryPageInit(){
	// for subid detect
	window.ajaxTarget = {descriptions:[]};

	window.getSubid = function(target, classid, gidGift, giftName){
		window.ajaxTarget.element = target;
		window.ajaxTarget.classid = classid;
		window.ajaxTarget.gidGift = gidGift;
		window.ajaxTarget.giftName = giftName;
		document.getElementsByTagName('head')[0].appendChild(document.createElement('SCRIPT')).src='http://v1t.su/projects/steam/class-sub.php?jsonp=setSubID&get=sub&value='+classid;
	}

	window.setSubID=function(subid, f){
		var str = 'SubscriptionID = ';

		if (subid=="0"){
			
			if(window.g_bViewingOwnProfile){
				new window.Ajax.Request( 'http://steamcommunity.com/gifts/' + window.ajaxTarget.gidGift + '/validateunpack', {
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
			str += '<a href="http://cdr.thebronasium.com/sub/'+subid+'">'+subid+'</a>';
			if(f) {
				//str+= ' (!)';
				//send to base
				document.getElementsByTagName('head')[0].appendChild(document.createElement('SCRIPT')).src='http://v1t.su/projects/steam/set_class-sub.php?class='+window.ajaxTarget.classid+'&sub='+subid+'&name='+window.ajaxTarget.giftName;
			}
		}
		window.ajaxTarget.element.outerHTML=str;
		var ds = window.ajaxTarget.descriptions[window.ajaxTarget.classid];
		ds[ds.length-1]={value:str};
		ds.withSubid=true;
	}

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
	// END multi gifts sending
	
	var BuildHover_old = window.BuildHover;

	// for gifts
	window.BuildHover = function(){
		if(window.g_ActiveInventory && (window.g_ActiveInventory.appid == 753)){
			var item = arguments[1];
			if (!item.descriptions.withClassid && item.contextid==1) {
				item.descriptions.withClassid=true;
				
				if(!item.descriptions)
					item.descriptions = [];
					
				item.descriptions.push({value:'ClassID = '+item.classid});
				item.descriptions.push({value:'<a href="#" onclick="getSubid(event.target,'+item.classid+', \''+item.id+'\', \''+encodeURIComponent(item.name)+'\');return false">Получить SubscriptionID</a>'});
				
				if(!window.ajaxTarget.descriptions[item.classid])
					window.ajaxTarget.descriptions[item.classid] = item.descriptions;
			

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

function profilePageInit(){
	
	function addLinks(links){
		var out, tmp;
		if (typeof links == 'string') {
			out = links;
		} else {
			out='';
			var link;
			for (var i=0; i < links.length; i++){
				link = links[i];

				if (link.hr) {
					if(addLinks.count)
						out +='<hr/>';
				} else {
					if(link.id && (hiddenMenuItems.indexOf(link.id)>-1)){
						continue;
					}
					addLinks.count++;
					out += '<div '+(link.id ?'id="mi_'+link.id+'" ':'')+'class="actionItem"><div class="actionItemIcon"><a href="'+link.href+'">\
		<img src="'+link.icon+'" width="16" height="16" border="0">\
		</a></div><a class="linkActionMinor" href="'+link.href+'">'+link.text+'</a>';
					if(link.id){
						out += '<a href="#hide" onclick="hideMenuItem(\''+link.id+'\');return false" class="btn-hide" title="Не показывать этот пункт">[x]</a>';
					}
					out += '</div>';
				}

			}
		}
		document.querySelector('#rightActionBlock').insertAdjacentHTML("afterBegin", out);
	}
	addLinks.count=0;


	var steamid = window.invitee
	if(!steamid){
		steamid = window.ajaxFriendUrl.split('/');
		steamid = steamid[steamid.length-1];
	}
	
	// Styles
	document.body.insertAdjacentHTML("afterBegin", 
		'<style>.badge{border-radius:3px;box-shadow:1px 1px 0px 0px #1D1D1D;float:right;font-size:.7em;margin-right:10px;margin-top:1px;padding:3px;}.btn-hide{float:right;visibility:hidden}.actionItem:hover>.btn-hide{visibility:visible}</style>'
	);
	document.querySelector('#namehistory_link').insertAdjacentHTML('afterEnd',
		'<a id="csmbadge" class="badge" href="http://check.csmania.ru/#steam:'+steamid+'">CSm: <span></sapn></a> <a id="srbadge" class="badge" href="http://steamrep.com/profiles/'+steamid+'">SR: <span></sapn></a>'
	);
	
	// permanent URL and names history
	document.querySelector('#profileBlock').insertAdjacentHTML('beforeBegin', '<div><a href="http://steamcommunity.com/profiles/'+steamid+'/namehistory">Последние 10 имен</a><br/>\
	Постоянная ссылка:<br/><a href="http://steamcommunity.com/profiles/'+steamid+'">http://steamcommunity.com/profiles/'+steamid+'</a><br/><br/></div>');
	
	
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
	document.getElementsByTagName('head')[0].appendChild(document.createElement('SCRIPT')).src='http://check.csmania.ru/api/swt9HkO2yFhf/0/repforext/'+steamid;
	
	
	
	// Games link - tab all games
	document.querySelector('a.linkActionMinor[href$="games/"]').href+='?tab=all';
	// inventory gifts link
	var el = document.querySelector('a.linkActionMinor[href$="inventory/"]');
	if(el)
		el.insertAdjacentHTML('afterEnd', ' <span class="linkActionSubtle">(<a title="Steam Gifts" href="'+el.href+'#753_0"><img src="http://cdn.store.steampowered.com/public/images/v5/inbox_gift.png"/></a>)</span>');

	// load hiddenMenuItems
	try {
		var hiddenMenuItems = JSON.parse(window.localStorage.hiddenMenuItems);
	} catch(err) {
		var hiddenMenuItems = [];
	}
	
	window.hideMenuItem = function(id){
		document.querySelector('#mi_'+id).remove();
		hiddenMenuItems.push(id);
		window.localStorage.hiddenMenuItems=JSON.stringify(hiddenMenuItems);
	}
	
	
	// reset menu button
	document.querySelector('.rightSectionHeader').innerHTML+='<a href="#resetmenu" onclick="resetMenu();return false" title="Восстановить меню"><img src="http://cdn.steamcommunity.com/public/images/community/icon_manage.png" style="float:right"/></a>'
	window.resetMenu = function(){
		delete window.localStorage.hiddenMenuItems;
		window.location.reload();
	}
	
	
	var	links = [];

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
			id:   'srch_sr',
			href: 'http://forums.steamrep.com/search/search/?o=date&q='+steamid,
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
			href: 'http://tf2outpost.com/id/'+steamid,
			icon: 'http://tf2outpost.com/favicon.ico',
			text: 'Инвентарь TF2OutPost.com',
		},
		{
			id:   'trds_tf2op',
			href: 'http://tf2outpost.com/user/'+steamid,
			icon: 'http://tf2outpost.com/favicon.ico',
			text: 'Трэйды на TF2OutPost.com',
		},
		{
			id:   'inv_sm',
			href: 'http://steammoney.com/userpage.php?id='+steamid,
			icon: 'http://steammoney.com/favicon.ico',
			text: 'Инвентарь SteamMoney.com',
		},
		{hr:true},

	]);

	addLinks(links);

}


var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);
	
})();