// ==UserScript==
// @name 	Steam Web Tools
// @namespace 	http://v1t.su/projects/steam/webtools/
// @description Useful tools in Steam web sites
// @version     0.4.7
// @date 	2015-08-08
// @author Mr-VIT
// @homepage	http://v1t.su/projects/steam/webtools/
// @updateURL http://mr-vit.github.io/SteamWebTools/version.js
// @icon http://mr-vit.github.io/SteamWebTools/icon-64.png
// @run-at document-end
// @include	http://store.steampowered.com/*
// @include	https://store.steampowered.com/*
// @include	http://steamcommunity.com/*
// @include	https://steamcommunity.com/*
// ==/UserScript==

W = unsafeWindow;
var url = document.URL;

var scripts = [
	{
		run:function(){
			//!include cart-page.js
		},
		include:[
			'http://store.steampowered.com/cart/',
			'https://store.steampowered.com/cart/',
		]
	},
	{
		run:function(){
			//!include checkout-fastbuy.js
		},
		include:[
			'http://store.steampowered.com/checkout/?purchasetype=gift',
			'https://store.steampowered.com/checkout/?purchasetype=gift',
		]
	},
	{
		run:function(){
			//!include sendgift-page.js
		},
		include:[
			'http://store.steampowered.com/checkout/',
			'https://store.steampowered.com/checkout/',
		]
	},
	{
		run:function(){
			//!include steam-store.js
		},
		include:[
			'http://store.steampowered.com/',
			'https://store.steampowered.com/',
		]
	},
	{
		run:function(){
			//!include steamcommunity.js
		},
		include:[
			'https://steamcommunity.com/id/',
			'http://steamcommunity.com/id/',
			'https://steamcommunity.com/profiles/',
			'http://steamcommunity.com/profiles/',
		]
	},
	{
		run:function(){
			//!include market.js
		},
		include:[
			'http://steamcommunity.com/market'
		]
	}
];

for(var i = 0; i<scripts.length; i++) {
	for(var j = 0; j < scripts[i].include.length; j++) {
		if(url.indexOf(scripts[i].include[j]) == 0) {
			scripts[i].run();
			break;
		}
	}
}