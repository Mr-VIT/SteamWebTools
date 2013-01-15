// chrome
ext = {
	openTab : function(url){
		chrome.tabs.create({active: true, url: url});
	},

	getUrlSelTab : function(){
		if(this._activeTabUrl) {
			return this._activeTabUrl;
		}
	},

	setUrlSelTab : function(url){
		chrome.tabs.update({url:url});
	},
	

	setOnMess : function(func){
		chrome.extension.onRequest.addListener(func);
	},

	sendMess : function(data){
		chrome.extension.sendRequest(data);
	}
}