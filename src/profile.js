var $ = W.$J, steamid;

function SetRepBadges(selector){
	document.querySelector(selector).insertAdjacentHTML('afterBegin',
		'<div id="swt_badges"><a id="csmbadge" class="badge" href="http://checkrep.ru/#steam:'+steamid+'">CRep: <span></sapn></a> <a id="srbadge" class="badge" href="http://steamrep.com/profiles/'+steamid+'">SR: <span></sapn></a></div>'
	);

	var badges = {
		0:{
			text : 'rep.unk',
			color : '606060'
		},
		1:{
			text : 'rep.mdlman',
			color : '5E931B'
		},
		2:{
			text : 'rep.white',
			color : '247E9E'
		},
		3:{
			text : 'rep.black',
			color : '9E2424'
		},
		4:{
			text : 'rep.orange',
			color : 'B47200'
		},
		error:{
			text : 'Error',
			color : '606060'
		}
	};


	var setRepStatus = function(res) {
		if(!(res.csm >= 0)){
			res.csm = 'error';
		}
		$('#csmbadge')[0].style.background = '#'+badges[res.csm].color;
		$('#csmbadge span').text(t(badges[res.csm].text));

		var srbcolor;
		if(!res.srcom){
			res.srcom = t(badges[0].text);
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

		$('#srbadge')[0].style.background = '#'+srbcolor;
		$('#srbadge span').text(res.srcom);
		$('#swt_badges').show();
	}

	// get rep status
	try{
		var xhr = window.GM_xmlhttpRequest || window.GM_xhr;
		xhr({
			method : 'GET',
			url  : 'http://checkrep.ru/api/swt9Hk02yFhf/0/repforext2/'+steamid,
			onload: function(response) {
				setRepStatus(JSON.parse(response.responseText));
			}
		});
	} catch(e) {
		console.log(e)
	}

}

function profilePageInit(){
	W.$J('.profile_header_badgeinfo_badge_area .persona_level').unwrap(); // remove link from level label


	steamid = W.g_rgProfileData.steamid;

	var profilesLinks = [
		{
			href: 'http://checkrep.ru/#steam:'+steamid,
			icon: 'http://checkrep.ru/favicon.ico',
			text: t('checkin')+' CheckRep.ru',
		},
		{
			href: 'http://steamrep.com/profiles/'+steamid,
			icon: 'http://steamrep.com/favicon.ico',
			text: t('checkin')+' SteamRep.com',
		},
		{hr:true},
		{
			href: 'http://forums.steamrep.com/search/search?keywords='+steamid,
			icon: 'http://steamrep.com/favicon.ico',
			text: t('searchinforums')+' SteamRep.com',
		},
		{
			href: 'http://www.google.com/#q='+steamid+' inurl:sourceop.com',
			icon: 'http://www.sourceop.com/themes/hl2/images/favicon.ico',
			text: t('searchinforums')+' SourceOP.com',
		},
		{
			href: 'http://www.steamtrades.com/user/'+steamid,
			icon: 'https://cdn.steamtrades.com/img/favicon.ico',
			text: t('profile')+' SteamTrades.com',
		},
		{hr:true},
		{
			href: 'http://backpack.tf/profiles/'+steamid,
			icon: 'http://backpack.tf/favicon_440.ico',
			text: t('inventory')+' Backpack.tf',
		},
		{
			href: 'http://tf2b.com/tf2/'+steamid,
			icon: 'http://tf2b.com/favicon.ico',
			text: t('inventory')+' TF2B.com',
		},
		{
			href: 'http://tf2outpost.com/backpack/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon-440.ico',
			text: t('inventory')+' TF2OutPost.com',
		},
		{hr:true},
		{
			href: 'http://tf2outpost.com/user/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon-440.ico',
			text: t('trades')+' TF2OutPost.com',
		},
		{
			href: 'http://dota2lounge.com/profile?id='+steamid,
			icon: 'http://dota2lounge.com/favicon.ico',
			text: t('trades')+' Dota2Lounge.com',
		},
		{
			href: 'http://csgolounge.com/profile?id='+steamid,
			icon: 'http://csgolounge.com/favicon.ico',
			text: t('trades')+' CSGOLounge.com',
		},
		{
			href: 'http://steam.tools/itemvalue/#/'+steamid+'-730',
			icon: 'http://steam.tools/favicon.ico',
			text: t('inventory')+' Steam.tools/itemvalue/',
		},
		{hr:true},
		{
			href: 'http://steammoney.com/trade/user/'+steamid,
			icon: 'http://steammoney.com/favicon.ico',
			text: t('profile')+' SteamMoney.com',
		},
		{
			id:   'inv_spub',
			href: 'http://steampub.ru/user/'+steamid,
			icon: 'http://steampub.ru/favicon.ico',
			text: t('profile')+' SteamPub.ru',
		},
		{hr:true}

	];


	// Styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>#swt_badges{display:none;position:absolute;top:7px}.badge{border-radius:3px;box-shadow:1px 1px 0px 0px #1D1D1D;font-size:.7em;padding:3px}#swt_info{position:absolute;top:201px}</style>'
	);


	$('.profile_header').append('<div id="swt_info">SteamID64: <a href="http://steamcommunity.com/profiles/'+steamid+'">'+steamid+'</a> | <a href="#getMoreInfo" onclick="getMoreInfo();return false">'+t('getMoreInfo')+'</a></div>');

	SetRepBadges('.profile_header');

	W.getMoreInfo = function() {
		if (location.protocol=="https:") {
			// redirect to http, profile?xml=1 don't work over https
			location.protocol="http:";
			return;
		}

		var Modal = W.ShowDialog(t('extInfo'), $('<div id="swtexinfo"><img src="http://cdn.steamcommunity.com/public/images/login/throbber.gif"></div>'));
		W.setTimeout(function(){Modal.AdjustSizing()},1);
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

			function template(a, b){
				return '<tr><td><b>'+ a +'</b></td><td>'+ b +'</td>';
			}

			$('#swtexinfo').html(
				'<table>'+
				template('CommunityID', steamid)+
				template('SteamID', steamid2)+
				template('AccountID', accountid)+
				template('Registration date', accCrDate)+
				template('VAC', (vacBanned=='0'?'Clear':'Banned'))+
				template('Trade Ban', tradeBanState)+
				template('Is Limited Account', (isLimitedAccount=='0'?'No':'Yes'))+
				'</table>'
			);
			W.setTimeout(function(){Modal.AdjustSizing()},1);
		}).fail(function(){
			$('#swtexinfo').html(t('reqErr'));
		});
	};


	// chat button
	try {
		var pm_btn = $('.profile_header_actions>a.btn_profile_action[href^="javascript:LaunchWebChat"]')[0];
		pm_btn.outerHTML='<span class="btn_profile_action btn_medium"><span><a href="steam://friends/message/'+steamid+'">'+t('chat')+': Steam</a> | <a href="'+pm_btn.href+'">Web</a></span></span>';
	} catch(e) {};

	// inventory links
	var el = document.querySelector('.profile_count_link a[href$="inventory/"]');
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
		$('.profile_header_actions').append('<span class="btn_profile_action btn_medium" onclick="ShowMenu(this,\'profile_action_dropdown\',\'right\')"><span>'+t('more')+' <img src="http://cdn.steamcommunity.com/public/images/profile/profile_action_dropdown.png"/></span></span><div class="popup_block" id="profile_action_dropdown" style="visibility:visible;display:none"><div class="popup_body popup_menu">'+out+'</div></div>')
	}

}

if (W.g_rgProfileData) {
	profilePageInit();
}
