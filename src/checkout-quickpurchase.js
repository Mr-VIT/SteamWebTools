if(W.location.hash!="#quick")
	return;

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