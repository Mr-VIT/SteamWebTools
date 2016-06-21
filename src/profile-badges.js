var $= W.$J;

$('.badge_details_set_favorite').append('<div class="btn_grey_black btn_small_thin" onclick="swt_showWithDrop()"><span>'+t('showDropsCard')+'</span></div> ');
W.swt_showWithDrop=function(){
	$('.badge_row').filter(function(i,el){
		return !($('a.btn_green_white_innerfade',el).length)
	}).remove();
	return false;
};

//// multi badges craft
if($('.badge_craft_button').length){
	W.swt_craftBadgeDone=function(){
		if(--W.swt_badgesCount<=0){
			alert(t('done'));
			W.location.reload();
		}
	};
	W.swt_craftAllAvailableBadges = function (){
		var $elb = $('.badge_craft_button').parents('.badge_row.is_link');
		var badgesCount = $elb.length;
		if(!badgesCount) {
			return;
		}
		W.swt_badgesCount=badgesCount;

		$elb.find('a.badge_row_overlay').each(function(i,el){
			var $el = $(el);
			$el.replaceWith('<iframe scrolling="no" class="badge_row_overlay" style="width:100%;height:100%;overflow:hidden;z-index:5;"src="'+$el.attr('href')+'#swt_craft"></iframe>');
		});
	};
	$('.badge_details_set_favorite').append('<div class="btn_grey_black btn_small_thin" onclick="swt_craftAllAvailableBadges()"><span>'+t('craftAllAvailable')+'</span></div> ');
}
