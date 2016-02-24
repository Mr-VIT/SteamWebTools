// items like links
W.$J('.workshopItemCollection').wrap(function(){
	var el = W.$J(this),
		url = el.attr('onclick').match(/href='(.+)'/)[1];
	el.attr('onclick', false);
	return "<a href='"+url+"'></a>";
});