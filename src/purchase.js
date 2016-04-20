W.$('accept_ssa').checked=true;
//W.$('verify_country_only').checked=true;

if(W.$('send_self')){
	W.$('send_self').checked=true;
	W.$('send_self').onchange();
}