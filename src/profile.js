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

	// calc STEAMID
	let steamid2 = parseInt(steamid.substr(-10),10);
	let srv = steamid2 % 2;
	let accountid = steamid2 - 7960265728;
	steamid2 = "STEAM_0:" + srv + ":" + ((accountid-srv)/2);

	var profilesLinks = [
		{hr:true},
		{
			href: 'javascript:ShowNicknameModal()',
			icon: '//community'+CDN+'public/images/skin_1/notification_icon_edit_bright.png',
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
		{hr:true},
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
			href: 'http://steam.tools/itemvalue/#/'+steamid+'-730',
			icon: '//steam.tools/favicon.ico',
			text: t('inventory')+' Steam.tools/itemvalue/',
		},
		{hr:true},
	];

	try{
		let userLinks = settings.cur.profileExtLinks;
		if(!userLinks) throw 0;
		userLinks = userLinks.split('\n').map(el=>{
			el = el.match(/^(.+?);(.+)$/);
			if(el) return {
				text: el[1],
				href: el[2].replaceAll(/\{(\w+)\}/g, (o,s)=> ({steamid, accountid}[s.toLowerCase()]) ?? o ),
				icon: 'https://www.google.com/s2/favicons?sz=16&domain='+encodeURIComponent(el[2]?.match(/\/\/(.+?)(\/|$)/)?.[1])
			};
			else {
				return {hr:true};
			}
		})

		profilesLinks=profilesLinks.concat(userLinks);
	} catch(e){}


	// Styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>#swt_badges{display:none;position:absolute;top:7px}.badge{border-radius:3px;box-shadow:1px 1px 0px 0px #1D1D1D;font-size:.7em;padding:3px}'
		+'#swt_info{padding-top:1em}</style>'
	);


	$('.profile_header').append('<div id="swt_info">SteamID64: <a href="https://steamcommunity.com/profiles/'+steamid+'">'+steamid+'</a> | <a href="#getMoreInfo" onclick="getMoreInfo();return false">'+t('getMoreInfo')+'</a></div>');

	if(settings.cur.profileRepBadges)
		SetRepBadges();

	W.getMoreInfo = function() {
		var Modal = W.ShowDialog(t('extInfo'), $('<div id="swtexinfo"><img src="//community'+CDN+'public/images/login/throbber.gif"></div>'));
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

			var shortId = accountid.toString(16).replace(/./g, s=>'bcdfghjkmnpqrtvw'[parseInt(s,16)]);

			function template(a, b){
				return '<tr><td><b>'+ a +'</b></td><td>'+ b +'</td>';
			}

			$('#swtexinfo').html(
				'<table>'+
				template('SteamID64', steamid)+
				template('SteamID', steamid2)+
				template('AccountID', accountid)+
				template('Short ID', 'https://s.team/p/'+shortId)+
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
	if(el) {
		let links = [
			['CS2','730', 'cdn'+CDN+'steamcommunity/public/images/apps/730/8dbc71957312bbd3baea65848b545be9eae2a355.jpg'],
			['DOTA2','570', 'cdn'+CDN+'steamcommunity/public/images/apps/570/0bbb630d63262dd66d2fdd0f7d37e8661a410075.jpg'],
			['TF2','440', 'cdn'+CDN+'steamcommunity/public/images/apps/440/f568912870a4684f9ec76277a1a404dda6bab213.jpg'],
			['Gifts','753_1', 'store'+CDN+'public/images/icon_gift.png'],
			['Cards','753_6', 'store'+CDN+'public/images/v6/ico/ico_cards.png'],
		];
		el.querySelector('.profile_count_link_total').insertAdjacentHTML('beforeend',
			links.map(link=>{
				return `<a class="btn_profile_action btn_medium" title="${link[0]}" href="${el.href}#${link[1]}"><img height="26" src="//${link[2]}"/></a>`
			}).join('')
		);
	}

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
		+' <img src="//community'+CDN+'public/images/profile/profile_action_dropdown.png"/></span></span><div class="popup_block" id="profile_action_dropdown" style="visibility:visible;display:none"><div class="popup_body popup_menu">'+out+'</div></div>')
	}


	// == Feature == unhidden data in private profiles
	if($('.profile_private_info').length) {
		let links = [
			['posthistory', 'Discussion Post history'],
			['screenshots', 'Screenshots'],
		].map(link=>`<a href="${W.g_rgProfileData.url+link[0]}">${link[1]}</a>`).join(' | ')
		$('.profile_header_bg').append('<p class=profile_header_centered_col>Check for unhidden data: '+links+'</p>')
		return;
	}

	// next section for public profiles

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
		$(e.currentTarget).next().slideToggle('fast')
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
			document.querySelector('.profile_comment_area').scrollIntoView();
		}
	});

}

if (W.g_rgProfileData) {
	profilePageInit();
}
