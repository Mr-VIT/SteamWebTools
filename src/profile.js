var $ = W.$J, steamid;

function profilePageInit(){

	steamid = W.g_rgProfileData.steamid;

	var profilesLinks = [
		{
			href: 'http://check.csmania.ru/#steam:'+steamid,
			icon: 'http://check.csmania.ru/favicon.ico',
			text: t('checkin')+' Check.CSMania.RU',
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
			icon: 'http://forums.sourceop.com/favicon.ico',
			text: t('searchinforums')+' SourceOP.com',
		},
		{
			href: 'http://www.steamtrades.com/user/id/'+steamid,
			icon: 'http://www.steamgifts.com/favicon.ico',
			text: t('profile')+' SteamGifts.com',
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
			icon: 'http://cdn.tf2outpost.com/img/favicon_440.ico',
			text: t('inventory')+' TF2OutPost.com',
		},
		{hr:true},
		{
			href: 'http://tf2outpost.com/user/'+steamid,
			icon: 'http://cdn.tf2outpost.com/img/favicon_440.ico',
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
		'<style>#swt_info{position:absolute;top:201px}</style>'
	);


	$('.profile_header').append('<div id="swt_info">SteamID64: <a href="http://steamcommunity.com/profiles/'+steamid+'">'+steamid+'</a> | <a href="#getMoreInfo" onclick="getMoreInfo();return false">'+t('getMoreInfo')+'</a></div>');

	W.getMoreInfo = function() {
		var Modal = W.ShowDialog(t('extInfo'), $('<div id="swtexinfo"><img src="http://cdn.steamcommunity.com/public/images/login/throbber.gif"></div>'));
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
			$('#swtexinfo').html(t('reqErr'));
		});
	};


	// chat button
	try {
		var pm_btn = $('.profile_header_actions>a.btn_profile_action[href^="javascript:LaunchWebChat"]')[0];
		pm_btn.outerHTML='<span class="btn_profile_action btn_medium"><span><a href="steam://friends/message/'+steamid+'">'+t('chat')+': Steam</a> | <a href="'+pm_btn.href+'">Web</a></span></span>';
	} catch(e) {};

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
		$('.profile_header_actions').append('<span class="btn_profile_action btn_medium" onclick="ShowMenu(this,\'profile_action_dropdown\',\'right\')"><span>'+t('more')+' <img src="http://cdn.steamcommunity.com/public/images/profile/profile_action_dropdown.png"/></span></span><div class="popup_block" id="profile_action_dropdown" style="visibility:visible;display:none"><div class="popup_body popup_menu">'+out+'</div></div>')
	}

}

if (W.g_rgProfileData) {
	profilePageInit();
}