var url = document.URL;

var CDN = '//mr-vit.github.io/SteamWebTools/';

var scripts = [
	{
		script:'cart-page.js',
		include:[
			'http://store.steampowered.com/cart/',
			'https://store.steampowered.com/cart/',
		]
	},
	{
		script:'checkout-fastbuy.js',
		include:[
			'http://store.steampowered.com/checkout/?purchasetype=gift',
			'https://store.steampowered.com/checkout/?purchasetype=gift',
		]
	},
	{
		script:'sendgift-page.js',
		include:[
			'http://store.steampowered.com/checkout/',
			'https://store.steampowered.com/checkout/',
		]
	},
	{
		script:'steam-store.js',
		include:[
			'http://store.steampowered.com/',
			'https://store.steampowered.com/',
		]
	},
	{
		script:'steamcommunity.js',
		include:[
			'https://steamcommunity.com/id/',
			'http://steamcommunity.com/id/',
			'https://steamcommunity.com/profiles/',
			'http://steamcommunity.com/profiles/',
		]
	},
	{
		script:'market.js',
		include:[
			'http://steamcommunity.com/market'
		]
	}
];

function include(scriptName){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = CDN+scriptName;
	document.body.appendChild(script);
};


for(var i = 0; i<scripts.length; i++) {
	for(var j = 0; j < scripts[i].include.length; j++) {
		if(url.indexOf(scripts[i].include[j]) == 0) {
			include(scripts[i].script);
			break;
		}
	}
}