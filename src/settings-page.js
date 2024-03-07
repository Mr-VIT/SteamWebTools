var $ = W.$J;

$('#group_tab_content_overview').show().attr('id','swt_content1');

$('head').append($('<link href="//steamcommunity-a.akamaihd.net/public/css/skin_1/groupadmin.css" rel="stylesheet" type="text/css">'));

$('.grouppage_logo').css('background-image','none');
$('.grouppage_logo>img')[0].src='//v1t.su/projects/steam/webtools/imgs/steam-big-icon.png';

$('.grouppage_header_label').text('Steam '+t('set.ext'));
var header = $('.grouppage_header_name').html('Steam Web Tools <span class="grouppage_header_abbrev" style="font-size:21px">'+t('set.settings')+'</span>');
var homePageUrl='https://v1t.su/projects/steam/webtools/';
var tmp = $('.grouppage_join_area a');
if(tmp.length){
	tmp[0].href=homePageUrl;
	tmp.find('span').text(t('set.homePage'));
}else{
	header.after('<div class="grouppage_join_area"><a href="'+homePageUrl+'" class="btn_green_white_innerfade btn_medium"><span>'+t('set.homePage')+'</span></a></div>')
}
$('.grouppage_friendsingroup').remove();
$('.grouppage_member_tiles').remove();
$('.group_tabs').remove();
$('.rightcol ').remove();


var createForm = function(data){
	var res = '';
	createForm.fields = [];

	var rows, row, i, j;
	for(i=0;i<data.length;i++){
		res+=createForm.create_groupStart(data[i].group);
		rows = data[i].rows;
		for(j=0;j<rows.length;j++){
			row=rows[j];

			createForm.fields.push(row.name);

			row.value = settings.cur[row.name];

			res+='<div class="formRow">';
			res+=createForm['create_'+row.type](row);
			res+='</div>';
		}
		res+=createForm.create_groupEnd();
	}
	$('.maincontent>.leftcol ')[0].innerHTML='<form class="smallForm" id="editForm" name="editForm">'+res+'<div class="group_content_bodytext"><div class="forum_manage_actions"><a href="#/swt-settings" class="btn_grey_white_innerfade btn_medium" id="swt_btnDef"><span>'+t('set.def')+'</span></a><button type="submit" class="btn_green_white_innerfade btn_medium"><span>'+t('save')+'</span></button></div></div></form>';
}
createForm.create_groupStart = function(title){
	return '<div class="group_content group_summary"><div class="formRow"><h1>'+title+'</h1></div>';
}
createForm.create_groupEnd = function(){
	return '</div>';
}
createForm.create_checkbox = function(data){
	return '<input type="checkbox"'+(data.value?' checked="checked"':'')+' name="'+data.name+'" id="'+data.name+'"><label for="'+data.name+'">'+data.title+'</label>';
}
createForm.create_select = function(data){
	var res = '<div class="formRowTitle">'+data.title+'</div><div class="formRowFields"><select name="'+data.name+'" id="'+data.name+'" class="gray_bevel">';

	var ops = data.options;
	for(var i=0;i<ops.length;i++){
		res+='<option value="'+ops[i].value+'"'+(ops[i].value==data.value ?' selected="selected"':'')+'>'+ops[i].text+'</option>';
	}

	res+='</select></div>';
	return res;
}
createForm.create_textLong = function(data){
	return '<div>'+data.title+'</div><div class="formRowFields"><div class="gray_bevel for_text_input fullwidth"><input type="text" name="'+data.name+'" id="'+data.name+'" value="'+data.value+'"></div></div>';
}
createForm.create_number = function(data){
	return `<label for="${data.name}">${data.title}</label>: <input type="number" value="${data.value}" min="${data.min}" max="${data.max}" step="${data.step}" name="${data.name}" id="${data.name}">`;
}

createForm([
	{
		group:t('set.global'),
		rows:[
			{
				type:'select',
				title:t('set.lang'),
				name:'globalLang',
				options:[
					{
						text : 'English',
						value : 'en'
					},
					{
						text : 'Русский',
						value : 'ru',
					},
					{
						text : 'Brazilian Portuguese',
						value : 'pt-br',
					},
					{
						text : '简体中文',
						value : 'zh-cn',
					},
					{
						text : '日本語',
						value : 'jp',
					},
				],
			},
			{
				type:'checkbox',
				title:t('set.FixNavbar'),
				name:'globalFixNavbar',
			},
			{
				type:'checkbox',
				title:t('set.hideBalance'),
				name:'globalHideWalletBalance',
			},
			{
				type:'checkbox',
				title:t('set.linkfilter'),
				name:'globalDisableLinkFilted',
			},
		],
	},
	{
		group:t('profile'),
		rows:[
			{
				type:'checkbox',
				title:t('set.prCollShowcases'),
				name:'profileСollapseShowcases',
			},
			{
				type:'checkbox',
				title:t('set.prCsOpenNotes'),
				name:'profileCsOpenNotes',
			},
			{
				type:'checkbox',
				title:t('set.prRepBadges'),
				name:'profileRepBadges',
			},
			{
				type:'checkbox',
				title:t('set.prLikeBtn'),
				name:'profileLikeBtn',
			},
		]
	},
	{
		group:t('set.store'),
		rows:[
			{
				type:'checkbox',
				title:t('set.showCCBtn'),
				name:'storeShowCCbtn',
			},
			{
				type:'textLong',
				title:t('set.CCList'),
				name:'storeCCList',
			},
			{
				type:'checkbox',
				title:t('set.showCartBtn'),
				name:'storeShowCartBtn',
			},
			{
				type:'checkbox',
				title:t('set.showSubid'),
				name:'storeShowSubid',
			},
			{
				type:'checkbox',
				title:t('set.showBtnGetPrices'),
				name:'storeShowBtnGetPrices',
			},
		],
	},
	{
		group:t('set.market'),
		rows:[
			{
				type:'checkbox',
				title:t('set.marketMainPageFuncs'),
				name:'marketMainPageFuncs',
			},
			{
				type:'number',
				title:t('set.sellLowPriceCheck'),
				name:'invSellItemPriceCheckMaxDiscount',
				min:0, max:99, step:1
			},
			{
				type:'number',
				title:t('set.sellSetPriceDiff'),
				name:'invSellItemSetPriceDiff',
				step: 1
			},
		],
	},
]);

$('#swt_btnDef').click(function(){
	settings.reset();
	settings.save();
	if(!settings.storage.gm) {
		W.location.href="https://store.steampowered.com/about/#swt-settings-del";
	} else
		W.location.reload();
});

$("form#editForm").submit(function(event) {
	var i, f, el, type;
	for(i=0;i<createForm.fields.length;i++){
		f=createForm.fields[i];
		el=$('#'+f);
		type = el.prop('type');
		settings.cur[f] = (type=='checkbox') ? el.prop('checked')
						 :(type=='number') ? el.get(0).valueAsNumber
						 :el.val();
	}
	settings.save();

	event.preventDefault();
	if(!settings.storage.gm) {
		W.location.href="https://store.steampowered.com/about/#swt-settings-save="+encodeURIComponent(JSON.stringify(settings.cur));
	} else
		W.location.href="https://steamcommunity.com/groups/SteamClientBeta#/swt-settings";
});
