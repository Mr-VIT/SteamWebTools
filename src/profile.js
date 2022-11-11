var $ = W.$J, steamid;

function SetRepBadges(){
	document.querySelector('.profile_header').insertAdjacentHTML('afterBegin',
		'<div id="swt_badges"><a id="csmbadge" class="badge" href="https://checkrep.ru/#steam:'+steamid+'">CRep: <span></sapn></a> <a id="srbadge" class="badge" href="https://steamrep.com/profiles/'+steamid+'">SR: <span></sapn></a></div>'
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

		var srbcolorId = 0;
		if(res.srcom) {
			let colors = {
				"SCAMMER": 3,
				"CAUTION": 4,
				"MIDDLEMAN": 1,
				"TRUSTED SELLER": 2,
				"ADMIN": 2,
			};
			for(let str in colors){
				if(res.srcom.includes(str)) {
					srbcolorId = colors[str];
					break;
				}
			}
		} else {
			res.srcom = t(badges[0].text);
		}

		$('#srbadge')[0].style.background = '#'+badges[srbcolorId].color;
		$('#srbadge span').text(res.srcom);
		$('#swt_badges').show();
	}

	// get rep status
	try{
		var xhr = window.GM_xmlhttpRequest || window.GM_xhr;
		xhr({
			method : 'GET',
			url  : 'https://checkrep.ru/api/swt9Hk02yFhf/0/repforext2/'+steamid,
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
		{hr:true},
		{
			href: 'javascript:ShowNicknameModal()',
			icon: '//community.akamai.steamstatic.com/public/images/skin_1/notification_icon_edit_bright.png',
			text: t('prAddNick'),
			internal: true,
			filter: ()=>{
				return W.g_steamID && document.getElementById('btn_add_friend')
			}
		},
		{
			href: 'http://checkrep.ru/#steam:'+steamid,
			icon: '//checkrep.ru/favicon.ico',
			text: t('checkin')+' CheckRep.ru',
		},
		{
			href: 'http://steamrep.com/profiles/'+steamid,
			icon: '//steamrep.com/favicon.ico',
			text: t('checkin')+' SteamRep.com',
		},
		{hr:true},
		{
			href: 'http://forums.steamrep.com/search/search?keywords='+steamid,
			icon: '//steamrep.com/favicon.ico',
			text: t('searchinforums')+' SteamRep.com',
		},
		{
			href: 'http://www.google.com/#q='+steamid+' inurl:sourceop.com',
			icon: '//www.sourceop.com/themes/hl2/images/favicon.ico',
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
			icon: '//backpack.tf/favicon_440.ico',
			text: t('inventory')+' Backpack.tf',
		},
		{hr:true},
		{
			href: 'http://old.csgolounge.com/profile/'+steamid,
			icon: '//csgolounge.com/favicon.ico',
			text: t('trades')+' old.CSGOLounge.com',
		},
		{
			href: 'http://steam.tools/itemvalue/#/'+steamid+'-730',
			icon: '//steam.tools/favicon.ico',
			text: t('inventory')+' Steam.tools/itemvalue/',
		},
		{hr:true},
		{
			id:   'inv_spub',
			href: 'http://steampub.ru/user/'+steamid,
			icon: '//steampub.ru/favicon.ico',
			text: t('profile')+' SteamPub.ru',
		},
		{hr:true}

	];


	// Styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>#swt_badges{display:none;position:absolute;top:7px}.badge{border-radius:3px;box-shadow:1px 1px 0px 0px #1D1D1D;font-size:.7em;padding:3px}#swt_info{position:absolute;top:201px}</style>'
	);


	$('.profile_header').append('<div id="swt_info">SteamID64: <a href="https://steamcommunity.com/profiles/'+steamid+'">'+steamid+'</a> | <a href="#getMoreInfo" onclick="getMoreInfo();return false">'+t('getMoreInfo')+'</a></div>');

	if(settings.cur.profileRepBadges)
		SetRepBadges();

	W.getMoreInfo = function() {
		var Modal = W.ShowDialog(t('extInfo'), $('<div id="swtexinfo"><img src="//steamcommunity-a.akamaihd.net/public/images/login/throbber.gif"></div>'));
		W.setTimeout(function(){Modal.AdjustSizing()},1);
		$.ajax({
			url: W.location.origin+W.location.pathname+'?xml=1',
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
		var pm_btn = $('.profile_header_actions>a.btn_profile_action[href^="javascript:OpenFriendChat"]')[0];
		pm_btn.outerHTML='<span class="btn_profile_action btn_medium"><span><a href="steam://friends/message/'+steamid+'">'+t('chat')+': Steam</a> | <a href="'+pm_btn.href+'">Web</a></span></span>';
		W.OpenFriendChat=W.OpenFriendChatInWebChat; // disable dialog
	} catch(e) {};

	// inventory links
	var el = document.querySelector('.profile_count_link a[href$="inventory/"]');
	if(el)
		el.insertAdjacentHTML('afterEnd', ': <span class="linkActionSubtle"><a title="Steam Gifts" href="'+el.href+'#753_1"><img src="//store.cloudflare.steamstatic.com/public/images/icon_gift.png"/></a> <a title="Steam Cards" href="'+el.href+'#753_6"><img width="26" height="16" src="//store.cloudflare.steamstatic.com/public/images/v6/ico/ico_cards.png"/></a> <a title="TF2" href="'+el.href+'#440"><img src="//steamcdn-a.akamaihd.net/apps/tf2/blog/images/favicon.ico"/></a> <a title="Dota 2" href="'+el.href+'#570"><img src="https://www.dota2.com/favicon.ico"/></a> <a title="CSGO" href="'+el.href+'#730"><img width="16" height="16" src="//cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg"/></a></span>');


	// profiles link in "More"
	var out = profilesLinks.map(link => link.hr ? '<hr/>'
		: (!link.filter || link.filter())
		? `<a class="popup_menu_item" ${link.internal?'':'target="_blank"'} href="${link.href}"><img style="width:18px;height:18px" src="${link.icon}"> ${link.text}</a>`
		: ''
	).join('');
	try {
		document.querySelector('#profile_action_dropdown>.popup_body.popup_menu').insertAdjacentHTML("beforeEnd", out);
	} catch(err) {
		// "More" button for self profile
		$('.profile_header_actions').append('<span class="btn_profile_action btn_medium" onclick="ShowMenu(this,\'profile_action_dropdown\',\'right\')"><span>'+t('more')
		+' <img src="//community.cloudflare.steamstatic.com/public/images/profile/profile_action_dropdown.png"/></span></span><div class="popup_block" id="profile_action_dropdown" style="visibility:visible;display:none"><div class="popup_body popup_menu">'+out+'</div></div>')
	}

	// == Feature == like profile button
	if(settings.cur.profileLikeBtn){
		var comments = Object.values(g_rgCommentThreads)[0];
		if(comments){
			comments.m_voteupID = 'swt_btnLikeProfile';
			comments.m_votecountID = 'swt_countProfLikes';
			var likebtn =
			$(`<span id="${comments.m_voteupID}" class="btn_profile_action btn_medium ico_hover profile_count_link" data-tooltip-text="Like this profile"><span><i class="ico18 thumb_up"></i> <span id="${comments.m_votecountID}">${comments.m_cUpVotes} ${t('prLiked')}</span></span></span>`)
			.insertAfter('div.responsive_status_info')
			.click(()=>{
				CCommentThread.VoteUp(comments.m_strName);
				comments.m_nRenderAjaxSequenceNumber=-1; // prevent scrolling to comments section on success
			});
			if(comments.m_bLoadingUserHasUpVoted)
				likebtn.addClass('active')
				//likebtn.find('i.thumb_up').addClass('accepted_and_voted')
			// enable tooltip: $J(window).trigger('Responsive_SmallScreenModeToggled')
		} /*else {
			0 comments, but at the same time there may be likes
			TODO check comment/Profile/render for likes
		}*/
	}

	// == Feature == showcases like spoilers
	let showcaseHeaders =
	$('.profile_customization_header')
	.click(e => {
		$(e.target).next().slideToggle('fast')
	})
	.css('cursor', 'pointer');
	if(settings.cur.profileСollapseShowcases){
		let blocks = showcaseHeaders
		.show() // for illustrations
		.next().hide();

		if(settings.cur.profileCsOpenNotes){
			blocks.filter(function(i, el){
				let note = $('.showcase_notes', el);
				return note.length ? note.text().trim().length>0
					: false;
			})
			.show();
		}
	}

	// == Feature == scroll to comments by pressing [C]
	$( document ).keyup(e => {
		if (e.target != document.body) {
			return;
		}
		if(67==e.which && !e.ctrlKey){
			document.querySelector('.profile_comment_area').scrollTo();
		}
	});

}

if (W.g_rgProfileData) {
	profilePageInit();
}
