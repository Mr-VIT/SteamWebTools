function t(key){
	return t.text[key] || key;
}

function getText(locale){
	return JSON.parse( GM_getResourceText('texts:'+locale) );
}
let _defLocale = settings.locales[0]
t.text = getText(_defLocale);  //first text as default
if(settings.cur.globalLang != _defLocale)
	Object.assign(t.text, getText(settings.cur.globalLang));   //extend default text
