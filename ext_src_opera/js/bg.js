ext.setOnMess(function(message){

	if(!message.action) {
		return;
	}

	switch (message.action) {

		case 'openTab' :
			ext.openTab(message.url);
			break;

	}
});