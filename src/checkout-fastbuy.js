// ==UserScript==
// @include https://store.steampowered.com/checkout/?purchasetype=gift*
// @include http://store.steampowered.com/checkout/?purchasetype=gift*
// ==/UserScript==

W.$('send_self').checked=true;
W.$('send_self').onchange();
W.$('accept_ssa').checked=true;

if(W.location.hash!="#fastbuy")
	return;

alert('fastbuy');

var FinalizeTransaction_old = W.FinalizeTransaction;
W.FinalizeTransaction = function(){
	W.$('accept_ssa').checked=true;
	return FinalizeTransaction_old.apply(this, arguments);
}

var OnGetFinalPriceSuccess_old = W.OnGetFinalPriceSuccess;
W.OnGetFinalPriceSuccess = function(){
	var res = OnGetFinalPriceSuccess_old.apply(this, arguments);
	W.FinalizeTransaction();
	return res;
}

W.InitializeTransaction();