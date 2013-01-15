// opera
ext = {
	getUrlSelTab : function(){
		var tab = opera.extension.tabs.getFocused();

		if(tab)
			return tab.url;
	},

	setUrlSelTab : function(url){
		var tab = opera.extension.tabs.getFocused();

		if(tab) {
			tab.update({url:url});
		}

	},

	setOnMess : function(func){
		opera.extension.onmessage = function(mess){
			func(mess.data);
		};
	},

	sendMess : function(data){
		opera.extension.postMessage(data);
	}
};

ext.openTab = opera.extension.tabs ? function(url){
	opera.extension.tabs.create({focused: true, url: url});
} : function(url){
	opera.extension.bgProcess.opera.extension.tabs.create({focused: true, url: url});
}
