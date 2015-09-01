W.$J('.badge_details_set_favorite').append('<div class="btn_grey_black btn_small_thin" onclick="showWithDrop()"><span>'+t('showDropsCard')+'</span></div>');
W.showWithDrop=function(){
	W.$J('.badge_row').filter(function(i,el){
		return !(W.$J('a.btn_green_white_innerfade',el).length)
	}).remove()
	return false;
}