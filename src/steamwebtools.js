!function(){
var W = window.unsafeWindow || window;

let CDN = W.VALVE_PUBLIC_PATH?.match('//\\w+(\\..+?/)')?.[1];
if(!CDN)
	CDN='.steamstatic.com/';

//!include settings.js
//!include lang.js

//!include global.js

var rURL_STORE = 'https?://(store|checkout)\\.steampowered\\.com/';
var rURL_COMMUNITY = 'https?://steamcommunity\\.com/';
var rURL_COMMUNITY_PROFILE = rURL_COMMUNITY+'(?:id/[^/]+|profiles/(?:\\d+|\\[U:1:\\d+\\]))/';

var scripts = [
	{
		match:[
			rURL_STORE+'cart.*',
		],
		run:function(){
			//!include cart-page.js
		}
	},
	{
		match:[
			rURL_STORE+'checkout/\\?purchasetype=.+',
		],
		run:function(){
			//!include purchase.js
		}
	},
	{
		match:[
			rURL_STORE+'checkout/\\?purchasetype=gift.*',
		],
		run:function(){
			//!include checkout-quickpurchase.js
		}
	},
	{
		match:[
			rURL_STORE+'checkout/sendgift/.*',
			rURL_STORE+'checkout/\\?purchasetype=gift.*'

		],
		run:function(){
			//!include sendgift-page.js
		}
	},
	{
		match:[
			rURL_STORE+'steamaccount/addfunds.*',
		],
		run:function(){
			//!include steam-store-addfunds.js
		}
	},
	{
		match:[
			rURL_STORE+'.*',
		],
		run:function(){
			//!include steam-store.js
		}
	},
	{
		match:[
			rURL_COMMUNITY_PROFILE+'?',
		],
		run:function(){
			//!include profile.js
		}
	},
	{
		match:[
			rURL_COMMUNITY_PROFILE+'allcomments\\b.*',
		],
		run:function(){
			//!include profile-comments.js
		}
	},
	{
		match:[
			rURL_COMMUNITY_PROFILE+'inventory.*',
		],
		run:function(){
			//!include profile-inventory.js
		}
	},
	{
		match:[
			rURL_COMMUNITY_PROFILE+'gamecards/\\d+.*',
		],
		run:function(){
			//!include profile-badge.js
		}
	},
	{
		match:[
			rURL_COMMUNITY_PROFILE+'badges.*',
		],
		run:function(){
			//!include profile-badges.js
		}
	},
	{
		match:[
			rURL_COMMUNITY_PROFILE+'tradeoffers.*',
		],
		run:function(){
			//!include profile-tradeoffers.js
		}
	},
	{
		match:[
			rURL_COMMUNITY_PROFILE+'edit.*',
		],
		run:function(){
			//!include profile-edit.js
		}
	},
	{
		match:[
			rURL_COMMUNITY_PROFILE+'friends/?',
		],
		run:function(){
			//!include profile-friends.js
		}
	},
	{
		match:[
			rURL_COMMUNITY+'market.*'
		],
		run:function(){
			//!include market.js
		}
	},
	{
		match:[
			rURL_COMMUNITY+'groups/SteamClientBeta#?/?/swt-settings'
		],
		run:function(){
			//!include settings-page.js
		}
	},
	{
		match:[
			rURL_STORE+'about/#swt-settings.*',
		],
		run:function(){
			//!include settings-store-save.js
		}
	},
	{
		match:[
			rURL_COMMUNITY+'linkfilter.*',
		],
		run:function(){
			//!include linkfilter.js
		}
	}
];

var url = document.URL;
for(var i = 0; i<scripts.length; i++) {
	for(var j = 0; j < scripts[i].match.length; j++) {
		var expr = new RegExp('^'+scripts[i].match[j]+'(?:\\?.*)?$', 'i');
		if(expr.test(url)) {
			scripts[i].run();
			break;
		}
	}
}
}()
