var settings = {
	locales : ['en', 'ru', 'pt-br', 'jp', 'zh-cn'],
	defaults : {
		version : 1,

		globalLang : 'en',
		globalFixNavbar : true,
		globalHideWalletBalance : true,
		globalDisableLinkFilted : false,

		storeShowCCbtn : true,
		storeCCList : 'ru ua us ar fr no gb au br de jp',
		storeShowCartBtn : true,
		storeShowSubid : true,
		storeShowBtnGetPrices : true,

		marketMainPageFuncs: true,

		profileLikeBtn: true,
		profileCollapseShowcases: false,
		profileCsOpenNotes: true,
		profileRepBadges: true,

		invSellItemPriceCheckMaxDiscount: 25,
		invSellItemSetPriceDiff: -1,

		storeItemExtLinks:'{T:viewin} SteamDB.info;https://steamdb.info/{TYPE}/{ID}/\n{T:searchin} Plati.market;https://plati.market/asp/find.asp?ai=111350&searchstr={NAME}\n{T:searchin} SteamPub.ru;https://steampub.ru/search/{NAME}\n{T:searchin} SteamGifts.com;https://www.steamgifts.com/giveaways/search?q={NAME}\n{T:searchin} Steam-Trader.com;https://steam-trader.com/games/?r=45962&text={NAME}',
		profileExtLinks:'',
	},
	cur : {},
	storage : {
		key : 'SWTSettings',
		gm : window.GM_getValue ? true : false,
		set : function(data, key=this.key){
			if(this.gm){
				GM_setValue(key, data);
			} else
				W.localStorage.setItem(key, data);
		},
		get : function(key=this.key){
			if(this.gm){
				return GM_getValue(key);
			} else
				return W.localStorage.getItem(key);
		},
		del : function(key=this.key){
			if(this.gm){
				GM_deleteValue(key);
			} else
				W.localStorage.removeItem(key);
		},
	},
	load : function(){
		this.cur = Object.assign({}, this.defaults);

		var data = this.storage.get();
		if(data) {
			if(typeof data === 'string') data=JSON.parse(data)
			Object.assign(this.cur, data);
		} else {
			// detect browser locale and set for extension
			var locale = W.navigator.language.toLowerCase();
			var li = this.locales.indexOf( locale );
			if(li>-1){
				this.cur.globalLang = this.locales[li]
			} else {
				locale = locale.split('-');
				if(locale.length>1){
					var li = this.locales.indexOf( locale[0] );
					if(li>-1){
						this.cur.globalLang = this.locales[li]
					}
				}
			}
			// first launch - show settings page button
			this.save();
			var style = {outline:"#48DA48 3px solid"},
				item = W.$J("#global_header .menuitem.supernav:nth(1)");
			item.css(style);
			setTimeout(function(){
				item.trigger('mouseover');
			},1000);
			setTimeout(function(){
				W.$J("#global_header .submenu_community .submenuitem.swt").css(style);
			},2000);

		}
	},
	save : function(){
		if(this.cur) {
			this.storage.set(JSON.stringify(this.cur));
		}
	},
	reset : function(){
		this.storage.del();
		this.cur = this.defaults;
	}
}

settings.load();
W.swt_settings=settings;