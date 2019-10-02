var h = W.location.hash;
if(h && h.substr(1,13)=='swt-settings-'){
	if(h.substr(14,4)=='save'){
		var data = h.substr(19);
		data = decodeURIComponent(data);
		settings.storage.set(data);
	} else if(h.substr(14,3)=='del'){
		settings.storage.del();
	}
}
W.location.href="https://steamcommunity.com/groups/SteamClientBeta#/swt-settings";