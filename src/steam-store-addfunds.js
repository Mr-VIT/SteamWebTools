// == Feature == adding custom amount of funds
var $ = W.$J;

var $el = $('div#prices_user .game_purchase_action_bg:first'),
    minFunds = $el.find('>a').click(function(){
        this.dataset.amount=$('#swt_fundsamount').val()*100;
        W.submitAddFunds(this);
    }).removeAttr('onclick').data('amount')/100;

$('<input type=number min='+minFunds+' placeholder='+minFunds+' value='+minFunds+' id=swt_fundsamount />').change(function(){
    if(this.value<minFunds) this.value = minFunds;
}).replaceAll($el.find('>.game_purchase_price'));