// ==UserScript==
// @include https://store.steampowered.com/checkout/?purchasetype=gift*
// @include http://store.steampowered.com/checkout/?purchasetype=gift*
// ==/UserScript==

(function(){

function init() {

	window.$('send_self').checked=true;
	window.$('send_self').onchange();
	window.$('accept_ssa').checked=true;

	if(window.location.hash!="#fastbuy")
		return;

	alert('fastbuy');

	var FinalizeTransaction_old = window.FinalizeTransaction;
	window.FinalizeTransaction = function(){
		window.$('accept_ssa').checked=true;
		return FinalizeTransaction_old.apply(this, arguments);
	}

	var OnGetFinalPriceSuccess_old = window.OnGetFinalPriceSuccess;
	window.OnGetFinalPriceSuccess = function(){
		var res = OnGetFinalPriceSuccess_old.apply(this, arguments);
		window.FinalizeTransaction();
		return res;
	}

	window.InitializeTransaction();

}


var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);
})();