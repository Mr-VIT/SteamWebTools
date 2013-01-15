// ==UserScript==
// @include https://store.steampowered.com/*
// @include  http://store.steampowered.com/*
// ==/UserScript==

(function(){

function init() {
	
	// for age check
	if(window.location.pathname.indexOf('/agecheck')==0){
		document.cookie='birthtime=-1704124799; expires=21-Dec-2015 00:00:00 GMT; path=/';
		window.location.reload();
	}
	
	/*// to top btn
	var tmp='<style>#footer{z-index:2;position: relative;}#totop{padding:10px;background:#000;position:fixed;left:0;width:90px;height:100%;z-index:2;cursor:pointer;opacity:0}#totop:hover{opacity:.5}</style><div id="totop" onclick="document.body.scrollTo()">Наверх</div>'
	document.querySelector('body').insertAdjacentHTML('afterBegin', tmp);
	*/
	
	// cc switcher
	var global_action_menu = document.getElementById('global_action_menu');
	if(global_action_menu) {
		var curCC = false;
		if(curCC = document.cookie.match(/fakeCC=(\w+?);/i)){
			curCC = curCC[1];
		}
		var changeCCmenuHTML = '\
		<style>#cc_menu_btn{min-width:59px;z-index:999;position:fixed;right:0;top:0;background-color:#000;opacity:0.5;}#cc_menu_btn:hover{opacity:1}#cc_list .popup_menu_item{white-space:nowrap}</style>\
		<span class="pulldown" id="cc_menu_btn" onclick="ShowMenu(this, \'cc_menu\', \'left\', \'bottom\', true);">CC'+((curCC)?': <img src="http://icons.iconarchive.com/icons/famfamfam/flag/16/'+curCC.toLowerCase()+'-icon.png" /> '+curCC:'')+' </span>\
<div class="popup_block" id="cc_menu" style="display:none;">\
<div class="popup_body popup_menu shadow_content" id="cc_list"></div></div>\
	<div class="popup_block" id="cc_list_edit" style="display:none;">\
	<div class="popup_body popup_menu shadow_content">\
	<input id="ccListEdit" type="text" value="'+_cc.curList+'"/><br/><a title="OK" href="#" id="cc_okbtn">[OK]</a> <a title="Default" href="#" id="cc_defbtn">[D]</a>\
	</div></div>';
	
		global_action_menu.insertAdjacentHTML('afterBegin', changeCCmenuHTML);
	
		_cc.updHTMLccList();
		
		document.getElementById('cc_defbtn').onclick = _cc.setDefCcList;
		document.getElementById('cc_okbtn' ).onclick = _cc.saveNewList;
	}

};

_cc = {
	defList : 'ru us ua fr gb au',
	updHTMLccList : function(){
		var s='';
		var ccListA = _cc.curList.split(' ');
		for(var i=0; i < ccListA.length; i++){
			s += '<a class="popup_menu_item" href="'+_cc.url+ccListA[i]+'"><img src="http://icons.iconarchive.com/icons/famfamfam/flag/16/'+ccListA[i]+'-icon.png" style="width:16px"/> '+ccListA[i].toUpperCase()+'</a>';
		}
		s += '<a class="popup_menu_item" title="Редактировать" href="#" onclick="ShowMenu(this, \'cc_list_edit\', \'right\', \'bottom\', true);return false"><img src="http://cdn.steamcommunity.com/public/images/skin_1/iconEdit.gif" style="width:16px"/></a>';
		document.getElementById('cc_list').innerHTML=s;
	},
	saveNewList : function(){
		_cc.curList=document.getElementById('ccListEdit').value;
		window.localStorage.ccList=_cc.curList;
		_cc.updHTMLccList();
		return false;
	},
	setDefCcList : function(){
		document.getElementById('ccListEdit').value = _cc.defList;
		return false;
	}
};

_cc.curList = window.localStorage.ccList || _cc.defList;

_cc.url = String(window.location);
if (_cc.url.indexOf('?')==-1) {
	_cc.url += '?';
} else {
	_cc.url = _cc.url.replace(/\?.+/, '?');
}
_cc.url += 'cc=';

window._cc=_cc;



var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);

})();