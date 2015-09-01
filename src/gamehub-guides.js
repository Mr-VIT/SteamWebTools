$J('.workshopItemCollection').wrap(function() {
	var el = $J( this )
		url = el.attr('onclick').match(/href='(.+)'/)[1];
	el.attr('onclick', false);
	return "<a href='" + url + "'></a>";
});