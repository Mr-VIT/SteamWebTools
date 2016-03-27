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
t.loadText({  //default text
//!include lang/en.js
});
t.loadText({
//!include lang/ru.js
});
t.loadText({
//!include lang/zh-cn.js
});
t.loadText({
//!include lang/jp.js
});
