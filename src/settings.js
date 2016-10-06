var settings = {
	locales : ['en', 'ru', 'jp', 'zh-cn'],
	defaults : {
		version : 1,

		globalLang : 'en',
		globalFixNavbar : true,
		globalHideAccName : true,
		globalHideWalletBalance : true,

		storeShowCCbtn : true,
		storeCCList : 'ru ua us ar fr no gb au br de jp',
		storeShowCartBtn : true,
		storeCartAjax : true,
		storeShowSubid : true,
		storeShowBtnGetPrices : true,
		
		marketMainPageFuncs: true,
	},
	cur : {},
	storage : {
		key : 'SWTSettings',
		gm : window.GM_getValue ? true : false,
		set : function(data){
			if(this.gm){
				GM_setValue(this.key, data);
			} else
				W.localStorage.setItem(this.key, data);
		},
		get : function(){
			if(this.gm){
				return GM_getValue(this.key);
			} else
				return W.localStorage.getItem(this.key);
		},
		del : function(){
			if(this.gm){
				GM_deleteValue(this.key);
			} else
				W.localStorage.removeItem(this.key);
		},
	},
	load : function(){
		this.cur = W.$J.extend({}, this.defaults);

		var data = this.storage.get();
		if(data) {
			if(typeof data === 'string') data=JSON.parse(data)
			W.$J.extend(this.cur, data);
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