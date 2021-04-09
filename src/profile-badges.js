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
		if(!confirm(t('craftAllAvailableConfirm'))) return;
		var $elb = $('.badge_craft_button').parents('.badge_row.is_link');
		var badgesCount = $elb.length;
		if(!badgesCount) {
			return;
		}
		sessionStorage.swt_craftAllAvailable=true;

		W.swt_badgesCount=badgesCount;

		$elb.find('a.badge_row_overlay').each(function(i,el){
			var $el = $(el);
			$el.replaceWith('<iframe scrolling="no" class="badge_row_overlay" style="width:100%;height:100%;overflow:hidden;z-index:5;"src="'+$el.attr('href')+'#swt_craft"></iframe>');
		});
	};
	$('.badge_details_set_favorite').append('<div class="btn_grey_black btn_small_thin" onclick="swt_craftAllAvailableBadges()"><span>'+t('craftAllAvailable')+'</span></div> ');
}
function genLinks(){
	return [
		['<b>One from the SWT creator</b>', 'https://steampub.ru/cards'],
		['Steamlvlup.com', 'https://steamlvlup.com/r/wvixup']
	].map(item => '<a class="popup_menu_item" href="'+item[1]+'" target="_blank">'+item[0]+'</a>').join('');
}
$('div.profile_xp_block').append('<span class="pulldown global_action_link persona_name_text_content" onclick="ShowMenu(this,\'dropdownlevelupmenu\',\'right\',\'bottom\',true );">⬆ Level Up services</span><div class="popup_block_new" id="dropdownlevelupmenu" style="display:none;"><div class="popup_body popup_menu">'+genLinks()+'</div></div>');