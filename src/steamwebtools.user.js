// ==UserScript==
// @name		Steam Web Tools
// @namespace	http://v1t.su/projects/steam/webtools/
// @description	Useful tools in Steam web sites
//!include _version.js
// @author		Mr-VIT
// @homepage	http://v1t.su/projects/steam/webtools/
// @updateURL	https://raw.githubusercontent.com/Mr-VIT/SteamWebTools/master/release/version.js
// @icon		http://mr-vit.github.io/SteamWebTools/icon-64.png
// @run-at		document-end
// @connect		checkrep.ru
// @connect		store.steampowered.com
// @grant		GM_xmlhttpRequest
// @grant		GM_xhr
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_deleteValue
// @include		http://store.steampowered.com/*
// @include		https://store.steampowered.com/*
// @include		http://steamcommunity.com/*
// @include		https://steamcommunity.com/*
// ==/UserScript==

!function(){
W = window.unsafeWindow || window;

//!include settings.js
//!include lang.js

//!include global.js

var rURL_STORE = 'https?://store\\.steampowered\\.com/';
var rURL_COMMUNITY = 'https?://steamcommunity\\.com/';
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
			rURL_STORE+'.*',
		],
		run:function(){
			//!include steam-store.js
		}
	},
	{
		match:[
			rURL_COMMUNITY+'id/[^/]+/?',
			rURL_COMMUNITY+'profiles/\\d+/?',
		],
		run:function(){
			//!include profile.js
		}
	},
	{
		match:[
			rURL_COMMUNITY+'id/.+?/inventory.*',
			rURL_COMMUNITY+'profiles/\\d+/inventory.*',
		],
		run:function(){
			//!include profile-inventory.js
		}
	},
	{
		match:[
			rURL_COMMUNITY+'id/.+?/gamecards/\\d+.*',
			rURL_COMMUNITY+'profiles/\\d+/gamecards/\\d+.*',
		],
		run:function(){
			//!include profile-badge.js
		}
	},
	{
		match:[
			rURL_COMMUNITY+'id/.+?/badges.*',
			rURL_COMMUNITY+'profiles/\\d+/badges.*',
		],
		run:function(){
			//!include profile-badges.js
		}
	},
	{
		match:[
			rURL_COMMUNITY+'app/\\d+/guides.*'
		],
		run:function(){
			//!include gamehub-guides.js
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
			rURL_COMMUNITY+'groups/SteamClientBeta#swt-settings'
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
	}
];

var url = document.URL;
for(var i = 0; i<scripts.length; i++) {
	for(var j = 0; j < scripts[i].match.length; j++) {
		var expr = new RegExp('^'+scripts[i].match[j]+'$', 'i');
		if(expr.test(url)) {
			scripts[i].run();
			break;
		}
	}
}

}()
