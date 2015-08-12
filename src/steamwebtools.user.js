// ==UserScript==
// @name		Steam Web Tools
// @namespace	http://v1t.su/projects/steam/webtools/
// @description	Useful tools in Steam web sites
// @version		0.4.8
// @date		2015-08-12
// @author		Mr-VIT
// @homepage	http://v1t.su/projects/steam/webtools/
// @updateURL	http://mr-vit.github.io/SteamWebTools/version.js
// @icon		http://mr-vit.github.io/SteamWebTools/icon-64.png
// @run-at		document-end
// @include		http://store.steampowered.com/*
// @include		https://store.steampowered.com/*
// @include		http://steamcommunity.com/*
// @include		https://steamcommunity.com/*
// ==/UserScript==

W = unsafeWindow;
var url = document.URL;

var scripts = [
	{
		match:[
			'https?://store\\.steampowered\\.com/cart.*',
		],
		run:function(){
			//!include cart-page.js
		}
	},
	{
		match:[
			'https?://store\\.steampowered\\.com/checkout/\\?purchasetype=.+',
		],
		run:function(){
			//!include purchase.js
		}
	},
	{
		match:[
			'https?://store\\.steampowered\\.com/checkout/\\?purchasetype=gift.*',
		],
		run:function(){
			//!include checkout-fastbuy.js
		}
	},
	{
		match:[
			'https?://store\\.steampowered\\.com/checkout/sendgift/.*',
			'https?://store\\.steampowered\\.com/checkout/\\?purchasetype=gift.*'

		],
		run:function(){
			//!include sendgift-page.js
		}
	},
	{
		match:[
			'https?://store\\.steampowered\\.com/.*',
		],
		run:function(){
			//!include steam-store.js
		}
	},
	{
		match:[
			'https?://steamcommunity\\.com/id/[^/]+/?',
			'https?://steamcommunity\\.com/profiles/\\d+/?',
		],
		run:function(){
			//!include profile.js
		}
	},
	{
		match:[
			'https?://steamcommunity\\.com/id/.+?/inventory.*',
			'https?://steamcommunity\\.com/profiles/\\d+/inventory.*',
		],
		run:function(){
			//!include profile-inventory.js
		}
	},
	{
		match:[
			'https?://steamcommunity\\.com/id/.+?/gamecards/\\d+.*',
			'https?://steamcommunity\\.com/profiles/\\d+/gamecards/\\d+.*',
		],
		run:function(){
			//!include profile-badge.js
		}
	},
	{
		match:[
			'https?://steamcommunity\\.com/id/.+?/badges.*',
			'https?://steamcommunity\\.com/profiles/\\d+/badges.*',
		],
		run:function(){
			//!include profile-badges.js
		}
	},
	{
		match:[
			'http://steamcommunity.com/market.*'
		],
		run:function(){
			//!include market.js
		}
	}
];

for(var i = 0; i<scripts.length; i++) {
	for(var j = 0; j < scripts[i].match.length; j++) {
		var expr = new RegExp('^'+scripts[i].match[j]+'$', 'i');
		if(expr.test(url)) {
			scripts[i].run();
			break;
		}
	}
}