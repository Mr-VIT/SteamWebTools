var settings = {
	defaults : {
		version : 1,

		globalLang : 'en',
		globalHideAccName : true,
		globalHideWalletBalance : true,

		storeShowCCbtn : true,
		storeCCList : 'ru ua us ar fr no gb au br de jp',
		storeShowCartBtn : true,
		storeCartAjax : true,
		storeShowSubid : true,
		storeShowBtnGetPrices : true,
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

		var data = this.storage.get(this.storage.key);
		if(data) {
			W.$J.extend(this.cur, JSON.parse(data));
		} else {
			// first launch - open settings page
			this.save();
			W.location='http://steamcommunity.com/groups/SteamClientBeta#swt-settings';
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