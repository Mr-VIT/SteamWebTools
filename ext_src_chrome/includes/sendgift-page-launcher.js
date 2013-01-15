var url = 'sendgift-page';

url = chrome.extension.getURL("includes/"+url+".js");

var script = document.createElement('script');
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', url);
window.addEventListener("DOMContentLoaded", function(){
	document.getElementsByTagName('head')[0].appendChild(script);
}, false);