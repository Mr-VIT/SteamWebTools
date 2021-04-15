function t(key){
	return t.text[key] || key;
}
t.loadText = function(text){
	if(!this.text){ //first default text
		this.text=text;
	} else if(text['lang.code']==settings.cur.globalLang){
		W.$J.extend(this.text, text);
	}
}

t.loadText(JSON.parse( GM_getResourceText('texts:'+settings.locales[0]) ));
if(settings.cur.globalLang != settings.locales[0])
	t.loadText(JSON.parse( GM_getResourceText('texts:'+settings.cur.globalLang) ));
