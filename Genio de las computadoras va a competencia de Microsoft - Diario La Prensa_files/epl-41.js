/*global inIframe, inDapIF, inDapMgrIf, inFIF, oIF*/
if ("undefined" === typeof oIF) { oIF = window.eplArgs ? window.eplArgs.oIF : false; }
var eplDoc = oIF ? document : parent.document, sDoc = document;

function EPL() {
	var onLoadO, sV, cV, vV, rnd, allCSF, sI, rF, kC, sec, ss, ssu, eIs, elist = [], dVstr = "", kVsObj = {}, kVsLast = {}, queuedAds = [], b_ua = navigator.userAgent.toLowerCase(), b_av = navigator.appVersion.toLowerCase(), spats = [['local.yahoo','stx'],['local.yahoo','p'],['search.yahoo','p'],['lycos','query'],['voila','rdata'],['hotbot','query'],['euroseek','string'],['splut','pattern'],['suche.web.de','su'],['virgilio.it','qs'],['myway.com','searchfor'],['mywebsearch.com','searchfor'],['yandex','text'],['baidu','wd']], getkVstr, spaceRequestDelay, firstRequestTime, VI_MINIMOS_MILISEGUNDOS_VISIBLES = 1000, VI_INTERVALOS_CHEQUEO = 5, VI_MINIMO_RATIO_VISIBLE = 0.5;
	this.onLoad = false;
	this.eClassName = false;
	this.eId = false;
	this.contextualStatus = 0;
	this.contextualArray = [];
	this.initDone = false;
	this.spaces = {};
	this.csfs = {};
	this.kps = [];
	this.t3p = [];

	this.lv = 12;
	this.browser = {};
	this.browser.isMac = b_ua.indexOf('mac') !== -1;
	this.browser.isWin = ((b_ua.indexOf("win") !== -1) || (b_ua.indexOf("16bit") !== -1)) && !this.browser.isMac;
	this.browser.isOpera = b_ua.indexOf('opera') !== -1;
	this.browser.isIE = b_av.indexOf('msie') !== -1 && !this.browser.isOpera;
	this.browser.isFFAll = b_ua.indexOf('firefox') !== -1;
	this.browser.isFFOld = b_ua.indexOf('firefox/2') !== -1 || b_ua.indexOf('firefox/1') !== -1;
	this.browser.isFF = this.browser.isFFAll && !this.browser.isFFOld;
	this.browser.webkit = b_ua.indexOf('webkit') !== -1;
	this.browser.safari = (b_ua.indexOf('safari') !== -1) && (-1 === b_ua.indexOf('chrome'));
	this.browser.ver = (this.browser.safari) ? (b_ua.match(/.+(?:ri)[\/: ]([\d.]+)/) || [])[1] : (b_ua.match(/.+(?:ox|me|ra|ie)[\/: ]([\d.]+)/) || [])[1];
	this.browser.chrome = window.navigator.appVersion.match(/Chrome\/(\d+)\./);
	this.localStorage = {
		support: function() {
			if (typeof(window.localStorage) !== "undefined" && typeof(window.Storage) !== "undefined") {
				try {
					window.localStorage.setItem('test_ls', '1');
					window.localStorage.removeItem('test_ls');
					return true;
				} catch (e) {
					return false;
				}
			} else {
				return false;
			}
		},
		set: function(key, value) {
			if (this.support()) {
				return window.localStorage.setItem(key, value);
			}
		},
		get: function(key) {
			if (this.support()) {
				return window.localStorage.getItem(key);
			}
		},
		add: function(key, i) {
			var value = this.get(key);
			eplDoc.epl.localStorage.set(key, window.parseInt(value, 10) ? window.parseInt(value, 10) + i : i);
		}
	};
	this.vSpacesRendered = [];
	this.vSpaces = function(spaces) {
		var e;
		this.vSpacesList = spaces;
		for (e in this.vSpacesRendered) {
			if (this.vSpacesRendered.hasOwnProperty(e) && spaces && spaces.indexOf(this.vSpacesRendered[e]) !== -1) {
				this.vSpaceNotify(this.vSpacesRendered[e]);
			}
		}
	};
	this.findObjPos = function(objIn) {
		var curleft = 0, curtop = 0, obj = eplDoc.querySelector('div[id="' + objIn.id + '"]'), p;
		if (obj && obj.offsetParent && obj.offsetParent !== eplDoc.querySelector('body')) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
				obj = obj.offsetParent;
			} while (obj);
		} else if (obj) {
			p = obj.getBoundingClientRect();
			curleft = window.parseInt(p.x || p.left, 10);
			curtop = window.parseInt(p.y || p.top, 10);
		}
		return [ curleft, curtop ];
	};
	this.findCurrentLeftTop = function() {
		var body = (eplDoc.documentElement || eplDoc.body);
		if (eplDoc.documentElement && eplDoc.body) {
			return [ eplDoc.documentElement.scrollLeft || eplDoc.body.scrollLeft, 
				 eplDoc.documentElement.scrollTop || eplDoc.body.scrollTop ];
		} else {
			return [ body.scrollLeft, body.scrollTop ];
		}
	};
	this.getVisibleRatio = function(ac, wc) {
		var boxx1, boxy1, boxx2, boxy2, fullarea, shownarea, ratio;

		boxx1     = (ac.x1 < wc.x1) ? wc.x1 : (ac.x1 > wc.x2) ? wc.x2 : ac.x1;
		boxy1     = (ac.y1 < wc.y1) ? wc.y1 : (ac.y1 > wc.y2) ? wc.y2 : ac.y1;
		boxx2     = (ac.x2 < wc.x1) ? wc.x1 : (ac.x2 > wc.x2) ? wc.x2 : ac.x2;
		boxy2     = (ac.y2 < wc.y1) ? wc.y1 : (ac.y2 > wc.y2) ? wc.y2 : ac.y2;
		fullarea  = (ac.x2 - ac.x1) * (ac.y2 - ac.y1);
		shownarea = (boxx2 - boxx1) * (boxy2 - boxy1);
		ratio     = (fullarea > 0) ? (shownarea / fullarea) : 0.0;

		return ratio;
	};	
	this.initCheckVisibility = function(obj, cb) {
		var fckv, rnd = Math.random(), div = obj.getDiv(), h = obj.h, w = obj.w, that = this;
		fckv = function(){
			if (div) {
				that.checkVisibility(div, h, w, obj, rnd);
			}
		};
		if (cb) {
			cb();
		}
		this["viINTs" + rnd] = 0;
		this["viTO" + rnd] = setTimeout(fckv, VI_MINIMOS_MILISEGUNDOS_VISIBLES / VI_INTERVALOS_CHEQUEO);
	};
	this.isVisible = function(div) {
		return (div && div.style.opacity !== 0 && div.style.visibility !== "hidden" && div.style.display !== "none");
	};
	this.checkVisibility = function(div, h, w, obj, rnd) {
		var curpos = this.findCurrentLeftTop(), objpos = this.findObjPos(div), ac, wc, ratio, fckv;

		h = h || div.clientHeight || 30;
		w = w || div.clientWidth || 30;

		ac          = { x1: objpos[0], y1: objpos[1], x2: objpos[0] + w, y2: objpos[1] + h };
		wc          = { x1: curpos[0], y1: curpos[1], x2: curpos[0] + eplDoc.epl.getSW(), y2: curpos[1] + eplDoc.epl.getSH() };
		ratio       = this.getVisibleRatio(ac, wc);
		this["viINTs" + rnd] = (ratio >= VI_MINIMO_RATIO_VISIBLE && this.isVisible(div)) ? (this["viINTs" + rnd] + 1) : 0;

		if (this["viINTs" + rnd] < VI_INTERVALOS_CHEQUEO) {
			fckv = function(){
				eplDoc.epl.checkVisibility(div, h, w, obj, rnd);
			};
			this["viTO" + rnd] = setTimeout(fckv, VI_MINIMOS_MILISEGUNDOS_VISIBLES / VI_INTERVALOS_CHEQUEO);
		} else {
			obj.elvI();
		}
	};
	this.vSpaceNotify = function(space) {
		var i;
		if (this.vSpacesList && this.vSpacesList.length) {
			i = this.vSpacesList.indexOf(space);
			if (i !== -1) {
				this.vSpacesList.splice(i, 1);
				this.spaces[space].vNotify();
			}
		} else {
			this.vSpacesRendered.push(space);
		}
	};
	getkVstr = function(eI) {
		var kVstr = "";
		kVsFinal = eI ? kVsObj[eI] : kVsLast;
		for (kct in kVsFinal) {
			if (kVsFinal.hasOwnProperty(kct)) {
				kVstr += '&kw_' + kct + '=' + encodeURIComponent(kVsFinal[kct]);
			}
		}
		return kVstr;
	};
	this.ID = Math.random();
	this.getSW = function () {
		return (eplDoc.documentElement && eplDoc.documentElement.clientWidth) ? eplDoc.documentElement.clientWidth : (this.window.innerWidth || eplDoc.body.clientWidth || 800);
	};
	this.getSH = function () {
		return this.window.innerHeight || ((eplDoc.documentElement && eplDoc.documentElement.clientHeight) ? eplDoc.documentElement.clientHeight : eplDoc.body.clientHeight || 600);
	};
	this.helpers = {};

	this.getSearchQuery = function () {
		var ref = eplDoc.referrer, q, reg = new RegExp("[?&]q=[^&;]+"), res, i;
		if (ref) {
			res = reg.exec(ref);
			if (res) {
				q = String(res).substr(3);
			} else {
				for (i = 0; (i < spats.length) && (!q); i++) {
					if (-1 !== ref.indexOf(spats[i][0])) {
						reg = new RegExp("[?&]" + spats[i][1] + "=[^&;]+");
						res = reg.exec(ref);
						if (res) {
							q = String(res).substr(3);	
						}
					}
				}
			}
		}
		return q;
	};
	function isStaticIframe() {
		return (eplDoc.location.href.indexOf(eplDoc.epl.sV || eplDoc.epl.isV || ".e-planning.net") !== -1);
	}
	function getActualURL() {
		return (isStaticIframe() && eplDoc.referrer) ? eplDoc.referrer : eplDoc.location.href;
	}
	function getDocURL() {
		return "&ur=" + escape(getActualURL());
	}
	function getDomain(url) {
		var domain = url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
		return (domain && domain[1]) ? domain[1] : "";
	}
	function getReferrerURL() {
		var lastURL = (eplDoc.referrer && !isStaticIframe()) ? eplDoc.referrer : false, actualURL = getActualURL();
		if (lastURL && getDomain(lastURL) !== getDomain(actualURL)) {
			return "&fr=" + escape(lastURL);
		}
		return "";
	}
	this.getCS = function() {
		return eplDoc.charset || eplDoc.characterSet;
	};
	function getRnd() {
		if (!rnd) {
			rnd = Math.random();
		}
		return rnd;
	}
	function appendScript(script) {
		var l = sDoc.getElementsByTagName('head');
		if (l && l.length >= 1) {
			l[0].appendChild(script);
		} else {
			l = sDoc.getElementsByTagName('body');
			if (l && l.length >= 1) {
				l[0].appendChild(script);
			}
		}
	}

	this.request = function(url,  func, arg) {
		var script = sDoc.createElement('script');
		script.type = 'text/javascript';
		url += ((url.indexOf("?") === -1) ? "?" : "&") + "lv=" + eplDoc.epl.lv;
		script.src = url;

		if (func) {
			if (arg) {
				script.arg = arg;
			}
			if (script.readyState) {
				script.onreadystatechange = func;
			} else if (sDoc.attachEvent) {
				sDoc.attachEvent("onreadystatechange", func);
			} else {
				script.onload = func;
			}
		}
		appendScript(script);
	};
	/* TRACKER HELPER 2.0 - START */
	function TrackWrapper() {
		this.tracker = function (fid) {
			var t, s = String(fid);
			t = (-1 === s.indexOf('_')) ? eplDoc.eplTH3 : eplDoc.eplTH4;
			return t;
		};
		/* V3-V4 wrappers: */
		this.setImpId = function (fid, imp_id, fecha_id) { this.tracker(fid).setImpId(fid, imp_id, fecha_id); };
		this.stopTrack = function (fid) { this.tracker(fid).stopTrack(fid); };
		this.inicioAnuncio = function (fid, st) { this.tracker(fid).inicioAnuncio(fid, st); };
		this.anuncioCompleto = function (fid) { this.tracker(fid).anuncioCompleto(fid); };
		this.timerStart = function (fid) { this.tracker(fid).timerStart(fid); };
		this.timerStop = function (fid) { this.tracker(fid).timerStop(fid); };
		this.start = function (fid) { this.tracker(fid).start(fid); };
		this.restart = function (fid) { this.tracker(fid).restart(fid); };
		this.stop = function (fid) { this.tracker(fid).stop(fid); };
		this.soundOff = function (fid) { this.tracker(fid).soundOff(fid); };
		this.soundOn = function (fid) { this.tracker(fid).soundOn(fid); };
		this.compartir = function (fid) { this.tracker(fid).compartir(fid); };
		this.descargar = function (fid) { this.tracker(fid).descargar(fid); };
		this.verFotos = function (fid) { this.tracker(fid).verFotos(fid); };
		this.notFound = function (fid) { this.tracker(fid).notFound(fid); };
		this.demorado = function (fid) { this.tracker(fid).demorado(fid); };
		this.customAction = function (fid, ca) { this.tracker(fid).customAction(fid, ca); };
		this.sendTimerValue = function (fid) { this.tracker(fid).sendTimerValue(fid); };
		this.qActions = function (fid) { this.tracker(fid).qActions(fid); };
		/* V3 only: */
		this.registrarAccion = function (t, at) { eplDoc.eplTH3.registrarAccion(t, at); };
		this.setAd = function (id, trackurl, x, st) { return eplDoc.eplTH3.setAd(id, trackurl, x, st); };
		this.getAd = function (id) { return eplDoc.eplTH3.getAd(id); };
	}
	function TrackHelper() {
		this.adsByEI = {};
		this.setAdR = function (ad) {
			if (!this.adsByEI[ad.eI]) { this.adsByEI[ad.eI] = {}; }
			this.adsByEI[ad.eI][ad.id] = ad;
		};
		this.getAdR = function (fid) {
			var a = fid.split('_'), b = a.pop(), e = a.join('_');
			return this.adsByEI[e][b];
		};
		this.setImpId = function (fid, imp_id, fecha_id) {
			var ad = this.getAdR(fid);
			ad.tracker.start = true;
			if (fecha_id) { ad.fi = fecha_id; }
			ad.i = imp_id;
		};
		this.stopTrack = function (fid) {
			var ad = this.getAdR(fid);
			ad.tracker.end = true;
			this.stopTimer(ad.tracker);
			ad.tracker.q = [];
		};

		this.INICIO = 0;
		this.COMPLETO = 1;
		this.ENCENDIDO = 2;
		this.START_BUTTON = 3;
		this.STOP_BUTTON = 4;
		this.RESTART_BUTTON = 5;
		this.SOUND_OFF = 6;
		this.SOUND_ON = 7;
		this.CLOSE_BUTTON = 8;
		this.DESPLEGAR = 9;
		this.REPLEGAR = 10;
		this.DEMORADO = 11;
		this.NOT_FOUND = 12;
		this.COMPARTIR = 13;
		this.DESCARGAR = 14;
		this.VER_FOTOS = 15;
		this.CUSTOM_ACTION = { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 9: 31 };

		this.inicioAnuncio = function (fid, st) { this.registrarAccion(this.getAdR(fid), this.INICIO, st); };
		this.anuncioCompleto = function (fid) { this.registrarAccion(this.getAdR(fid), this.COMPLETO); };
		this.timerStart = function (fid) { this.startTimer(this.getAdR(fid).tracker); };
		this.timerStop = function (fid) { this.stopTimer(this.getAdR(fid).tracker); };
		this.start = function (fid) { this.registrarAccion(this.getAdR(fid), this.START_BUTTON); };
		this.restart = function (fid) { this.registrarAccion(this.getAdR(fid), this.RESTART_BUTTON); };
		this.stop = function (fid) { this.registrarAccion(this.getAdR(fid), this.STOP_BUTTON); };
		this.soundOff = function (fid) { this.registrarAccion(this.getAdR(fid), this.SOUND_OFF); };
		this.soundOn = function (fid) { this.registrarAccion(this.getAdR(fid), this.SOUND_ON); };
		this.compartir = function (fid) { this.registrarAccion(this.getAdR(fid), this.COMPARTIR); };
		this.descargar = function (fid) { this.registrarAccion(this.getAdR(fid), this.DESCARGAR); };
		this.verFotos = function (fid) { this.registrarAccion(this.getAdR(fid), this.VER_FOTOS); };
		this.notFound = function (fid) { this.registrarAccion(this.getAdR(fid), this.NOT_FOUND); };
		this.demorado = function (fid) { this.registrarAccion(this.getAdR(fid), this.DEMORADO); };
		this.customAction = function (fid, ca) {
			if (this.CUSTOM_ACTION[ca]) {
				this.registrarAccion(this.getAdR(fid), this.CUSTOM_ACTION[ca]);
			}
		};

		this.registrarAccion = function (ad, at, st, qa) {
			var t = ad.tracker, u;
			if (!t || (at === this.ENCENDIDO && t.end)) { return; }
			if (!at) { at = 0; }
			if (at !== this.INICIO && !t.start) { //queue
				t.q.push(at);
				setTimeout("eplDoc.eplTH4.qActions(" + ad.getFIDQ() + ");", 3000);
			} else {
				if (!t.sent[at] || at === this.ENCENDIDO) {
					this.updateTime(t);
					u = ad.getTrackURL('&f=j&at=' + at + '&t=' + (Math.round(t.time)));
					eplDoc.epl.request(u);
				}
				if (at === this.INICIO) {
					if (st) { this.startTimer(t); }
				} else if (!qa && (at === this.START_BUTTON || at === this.RESTART_BUTTON || at === this.DESPLEGAR)) {
					this.startTimer(t);
				} else if (at === this.STOP_BUTTON || at === this.CLOSE_BUTTON || at === this.REPLEGAR || at === this.COMPLETO) {
					if (at === this.COMPLETO) { t.end = true; }
					this.stopTimer(t);
				}
				t.sent[at] = new Date();
			}
		};
		this.qActions = function (fid) {
			var ad = this.getAdR(fid), t = ad.tracker, at;
			if (t.start) {
				while (t.q.length) {
					at = t.q.pop();
					this.registrarAccion(ad, at, false, true);
				}
			} else {
				setTimeout("eplDoc.eplTH4.qActions(" + ad.getFIDQ() + ");", 3000);
			}
		};
		this.sendTimerValue = function (fid) {
			var ad = this.getAdR(fid), t = ad.tracker;
			if (t.time > 120000 || t.end) {
				eplDoc.eplTH4.stopTimer(t);
			} else {
				this.registrarAccion(ad, this.ENCENDIDO);
			}
		};
		this.updateTime = function (t) {
			var current = (new Date()).getTime();
			if (!t.time_init) { return; }
			t.time += (current - t.time_init);
			t.time_init = current;
		};
		this.startTimer = function (t) {
			if (t.timer_id || t.end || t.time > 120000) { return; }
			t.time_init = (new Date()).getTime();
			t.timer_id = setInterval('eplDoc.eplTH4.sendTimerValue(' + t.ad.getFIDQ() + ')', 5000);
		};
		this.stopTimer = function (t) {
			if (!t.timer_id) { return; }
			clearInterval(t.timer_id);
			this.updateTime(t);
			t.time_init = null;
			t.timer_id = null;
		};
	}
	eplDoc.eplTH4 = new TrackHelper();
	eplDoc.eplTH = new TrackWrapper();
	/* TRACKER HELPER 2.0 - END*/

	function replaceRandom(string) {
		return string.split('$RANDOM').join(getRnd());
	}
	function pushQAd(type, adObj) {
		if (!queuedAds[type]) {
			queuedAds[type] = [];
		}
		queuedAds[type].push(adObj);
	}
	this.pushQAd = pushQAd;

	this.shiftQAd = function (type) {
		var a = queuedAds[type], ad = null;

		if (a && (a.length > 0)) {
			ad = a.shift();
		}

		return ad;
	};

	this.showIframe = function (adObj, container) {
		var dyn = adObj.useFIF(), ur = adObj.getFrameURL(dyn), iF = eplDoc.createElement('iframe'), e = container || adObj.div, f;
		adObj.sIF = 1;
		iF.src = dyn ? ((eplDoc.epl.browser.isFFAll) ? eplDoc.epl.window.location.href.toString() : 'about:blank' ) : ur + '&fr=do';
		iF.id = 'ifr' + adObj.id + '_' + adObj.getUIID();
		iF.name = 'ifr' + adObj.id + '_' + adObj.getUIID();
		if (adObj.w && adObj.h) {
			iF.width = adObj.w + 'px';
			iF.height = adObj.h + 'px';
		} else {
			iF.width = "0px";
			iF.height = "0px";
		}
		iF.frameBorder = '0';
		iF.marginwidth = '0px';
		iF.marginheight = '0px';
		iF.scrolling = 'no';
		e.appendChild(iF);
		if (dyn) {
			eplDoc.epl.t3p.push({ i: iF, u: ur, adObj: adObj });
			f = function () {
				var d, h, w = eplDoc.epl.window || eplDoc.window || window, t = eplDoc.epl.t3p.pop(), iF = t.i, xF = (w && w.frames) ? w.frames[iF.id] : null, adObj = t.adObj;
				h = adObj.adm || ('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3c.org/TR/REC-html40/loose.dtd"><html><head><title>Ad</title></head><body id="' + iF.id + '" leftmargin="0" topmargin="0" style="margin:0px;padding:0px"><scri' + 'pt>var inIframe=1;</scri' + 'pt><scri' + 'pt src="' + t.u + '" type="text/javascript"></scri' + 'pt></body></html>');
				d = iF.contentDocument || iF.contentWindow || iF.document || iF.window;
				if (xF && !d) { d = xF.contentDocument || xF.contentWindow || xF.document || xF.window; }
				if (d.document) { d = d.document; }
				d.write(h);
				d.close();
			};
			setTimeout(f, 200);
		}
	};
	this.setOpac = function (e, opac) {
		if (100 === opac || (0 !== opac && !opac)) {
			opac = 99.999;
		}
		e.style.filter = "alpha(opacity:" + opac + ")";
		e.style.KHTMLOpacity = opac / 100;
		e.style.MozOpacity = opac / 100;
		e.style.opacity = opac / 100;
	};

	this.getIS = function (ad) {
		return ad ? (this.is || ad.is) : this.is;
	};
	this.getISJ = function (ad) {
		return this.isV || this.isJ || this.is || ad.is;
	};

	this.setPostShow = function (eI, f) {
		if (this.spaces[eI]) {
			this.spaces[eI].psf = f;
		} else {
			throw "setPostShow: Unknown space: " + eI;
		}
	};

	this.setCustomAdShow = function (eI, f) {
		var x;
		if (this.spaces[eI]) {
			this.spaces[eI].csf = f;
		} else if ('*' === eI) {
			for (x in this.spaces) {
				if (this.spaces.hasOwnProperty(x)) {
					this.spaces[x].csf = f;
				}
			}
		} else {
			this.csfs[eI] = f;
		}
	};

	this.trim = function(str) {
		return str.replace(/^\s+|\s+$/gm,'');
	};

	this.getCookie = function (name) {
		var ca = eplDoc.cookie.split(';'), i,c;

		for (i = 0; i < ca.length; i++) {
			c = ca[i].split('=');
			if (name === this.trim(c[0])) {
				return c[1];
			}
		}
		return null;
	};

	this.setCookie = function(name, val, path, exp) {
		var s;

		s = name + "=" + escape(val);
		if (exp) {
			s += "; expires=" + exp.toGMTString();
		}
		if (path) {
			s += "; path=" + path;
		}
		eplDoc.cookie = s;
	};

	function AdObj(ad) {
		var divCustom = [], divDefault, divLayer, p, FORMATOS = {
			1: {o: 1, x: "gif"},
			2: {o: 2},
			4: {o: 8},
			6: {o: 0},
			7: {o: 1, x: "jpg"},
			8: {o: 1, x: "png"},
			9: {o: 2},
			10: {o: 2, h: "takeover"},
			11: {o: 2, h: "exp"},
			12: {o: 2, h: "impact"},
			13: {o: 2, h: "preview"},
			14: {o: 2, h: "lab"},
			15: {o: 2, h: "split"},
			16: {o: 2},
			17: {o: 2, h: "exp"},
			18: {o: 2, h: "exp2"},
			19: {o: 2, h: "lab"},
			20: {o: 2, h: "impact"},
			30: {o: 2, h: "skin"},
			31: {o: 2, h: "skin"},
			32: {o: 2, h: "mimp"},
			33: {o: 2, h: "mimp"},
			41: {o: 0},
			42: {o: 0},
			43: {o: 2, h: "mintersticial"},
			44: {o: 2, h: "mtakeover"},
			48: {o: 2, h: "slider"},
			49: {o: 1, h: "skin"},
			50: {o: 1, h: "skin"},
			52: {o: 1, h: "pushdown"},
			53: {o: 1, h: "mvideobanner"},
			54: {o: 2},
			55: {o: 2},
			56: {o: 2, h: "exp"},
			57: {o: 2, h: "exp"},
			58: {o: 2},
			59: {o: 0, x: "js" },
			60: {o: 1, h: "onlyskin"},
			61: {o: 1, h: "onlyskin"},
			62: {o: 1, h: "onlyskin"},
			63: {o: 0},
			64: {o: 0},
			101: {o: 2},
			102: {o: 1},
			103: {o: 8},
			104: {o: 0},
			105: {o: 1},
			106: {o: 1},
			107: {o: 2},
			111: {o: 2},
			112: {o: 1},
			113: {o: 8},
			114: {o: 0},
			115: {o: 1},
			116: {o: 1},
			117: {o: 2},
			151: {o: 2, h: null},
			152: {o: 8, h: null},
			153: {o: 1, h: null, x: "gif"},
			154: {o: 1, h: null, x: "jpg"},
			155: {o: 1, h: null, x: "png"},
			157: {o: 2, h: "exp2"},
			158: {o: 2, h: "scroll"},
			159: {o: 2, h: "preview"},
			156: {o: 2, h: null},
			160: {o: 2, h: null},
			161: {o: 2, h: "zocalo"},
			162: {o: 2, h: "madhesion"},
			163: {o: 0, h: "layers", x: "js"},
			164: {o: 0, h: "layers", x: "js"},
			165: {o: 0, h: "layers", x: "js"},
			191: {o: 0, h: "highlight"},
			192: {o: 1, h: "highlight"},
			193: {o: 2, h: "highlight"}
		}, EFECTOS = {
			1: {h: "layers"},
			2: {h: "layerslide"},
			3: {h: "layerslide"},
			4: {h: "layerslide"},
			5: {h: "layers"},
			6: {h: "preview"},
			7: {h: "exp"},
			8: {h: "exp"},
			9: {h: "lab"},
			10: {h: "scroll"},
			11: {h: "cubo"},
			32: {},
			33: {},
			34: {},
			35: {},
			128: {},
			129: {},
			130: {},
			132: {},
			201: {},
			202: {},
			203: {}
		}, OPTIONS_ES_IMAGEN = 1, OPTIONS_ES_FLASH = 2, OPTIONS_ES_HTML = 8, OPTIONS_DOM_DELAYED = 16, 
		LO_TITLE = 1, LO_CLOSE_BUTTON = 2, LO_ADAPTAR_TAMANO = 4, OPTIONS_MASK_POSITION = 240, 
		OPTIONS_SHIFT_POSITION = 4, OPTIONS_POSITION_CENTER = 1, OPTIONS_POSITION_TOP_LEFT = 2,
		OPTIONS_POSITION_SPECIFIC = 3, OPTIONS_POSITION_TOP_RIGHT = 5, OPTIONS_POSITION_TOP_CENTER = 4,
		OPTIONS_POSITION_BOTTON_LEFT = 6, OPTIONS_POSITION_BOTTON_RIGHT = 7, OPTIONS_POSITION_BOTTON_CENTER = 8, OPTIONS_PASSBACK_CHAINING = 524288, OPTIONS_ES_ZIP = 2097152;

		this.doc = eplDoc;
		this.iCs = [];

		for (p in ad) {
			if (ad.hasOwnProperty(p)) { this[p] = ad[p]; }
		}
		if (!this.kw) { this.kw = ''; }
		if (this.desc1) {
			this.desc1 = this.desc1.replace(/\$KEYWORD/g, this.kw);
			if (this.desc2) {
				this.desc2 = this.desc2.replace(/\$KEYWORD/g, this.kw);
				this.desc = this.desc1 + "<br>" + this.desc2;
			} else {
				this.desc = this.desc1;
			}
		}
		this.space = eplDoc.epl.getSpace(this.eI);
		this.sd = this.space.sd;
		this.ct = this.space.ct;
		this.shown = 0;
		this.getReqArgs = function() {
			var s = "&pb=" + this.id;
			if (this.aX > 0) { s += "&x=" + this.aX; }
			if (this.i) { s += "&i=" + this.i; }
			if (this.fi) { s += "&fi=" + this.fi; }
			if (this.ip) { s += "&eip=" + this.ip; }
			if (this.rTL) { s += "&rTL=" + this.rTL; }
			if (this.bk) { s += "&bk=" + this.bk; }
			if (this.bTD) { s += "&btd=" + this.bTD; }
			if (this.aR) { s += "&aR=" + this.aR; }
			if (this.pv) { s += "&pv=" + this.pv; }
			if (this.prod) { s += "&sP=" + this.prod.id + "&dS=" + this.prod.dS; }
			if (this.ki) { s += "&ki=" + this.ki; }
			if (this.du) { s += "&du=" + escape(this.du); }
			s += getkVstr() + dVstr;
			s += getDocURL();
			return s;
		};
		this.getBase = function(h, v) {
			return (this.space.sd.sV || sV) + h + '/' + (eplDoc.epl.ext ? 'c' : '') + (v || cV);
		};
		this.lU = this.getBase('ei', '3') + '/' + (this.sd.sI || sI) + '/' + (this.sd.sec ? (this.sd.sec + '/') : '') + (this.sd.ss ? (this.sd.ss + '/') : '') + this.eI + '?rnd=' + getRnd() + this.getReqArgs() + (this.fR ? ('&fR=' + this.fR) : '') + (this.ct ? ('&3pct=' + this.ct) : '');
		if (!this.nl) { this.nl = 1; }
		if (this.ptv) { this.lU += "&ptv=" + this.ptv; }
		if (this.tit) { this.tit = this.tit.replace(/\$KEYWORD/g, this.kw); }
		if (!FORMATOS[this.t]) {
			throw "(new) Unknown format: " + this.t;
		}
		if ((this.e) && (this.e > 0) && (!EFECTOS[this.e])) {
			throw "Unknown effect: " + this.e;
		}
		this.pos = function () {
			return ((this.o & OPTIONS_MASK_POSITION) >> OPTIONS_SHIFT_POSITION);
		};
		this.isChaining = function() { return (this.o & OPTIONS_PASSBACK_CHAINING); };
		this.isLayer = function () { return ((this.t >= 151) && (this.t <= 165)); };
		this.isPop = function () { return (this.isPopSite() || this.isPopUnder() || this.isPopUp()); };
		this.isOpenedBy3p = function () { return (this.isPop() && (this.po & 256)); };
		this.isPopSite = function () { return (104 === this.t || 114 === this.t); };
		this.isPopUnder = function () { return ((this.t >= 101) && (this.t <= 107)); };
		this.isPopUp = function () { return ((this.t >= 111) && (this.t <= 117)); };
		this.isZip = function() { return (this.o & OPTIONS_ES_ZIP); };
		this.isHTML5 = function () { return (63 === this.t || 64 === this.t || 164 === this.t || 165 === this.t); };
		this.isRmHTML5 = function () { return (64 === this.t || 165 === this.t); };
		this.getHelper = function () { return FORMATOS[this.t].h; };
		this.getHelperEfecto = function () { return (this.e) ? EFECTOS[this.e].h : null; };
		this.posCenter = function () { return (this.pos() === OPTIONS_POSITION_CENTER); };
		this.posTopLeft = function () { return (this.pos() === OPTIONS_POSITION_TOP_LEFT); };
		this.posTopRight = function () { return (this.pos() === OPTIONS_POSITION_TOP_RIGHT); };
		this.posTopCenter = function () { return (this.pos() === OPTIONS_POSITION_TOP_CENTER); };
		this.posBottonLeft = function () { return (this.pos() === OPTIONS_POSITION_BOTTON_LEFT); };
		this.posBottonRight = function () { return (this.pos() === OPTIONS_POSITION_BOTTON_RIGHT); };
		this.posBottonCenter = function () { return (this.pos() === OPTIONS_POSITION_BOTTON_CENTER); };
		this.getFIDQ = function () { return "'" + this.getFID() + "'"; };
		this.getFID = function () { return this.eI + '_' + this.id; };
		this.posSpecific = function () { return (this.pos() === OPTIONS_POSITION_SPECIFIC); };
		this.getLeft = function (a) { 
			var l;
			if (this.posSpecific()) {
				l = ((this.px || 0 ) + ((this.pec) ? (eplDoc.epl.getSW() / 2 - (a ? a.w : this.w) / 2) : 0));
			} else if (this.posCenter() || this.pec || this.posTopCenter() || this.posBottonCenter()) {
				l = (eplDoc.epl.getSW() / 2 - (a ? a.w : this.w) / 2);
			} else if (this.posTopRight() || this.posBottonRight()) {
				l = (eplDoc.epl.getSW() - (a ? a.w : this.w));
			} else {
				l = 0;
			}
			return l;
		};
		this.showWrapper = function () {
			if (this.wh) {
				showWrapperHTML(this);
			}
			if (this.wf) {
				showWrapperHTML(this, 1);
			}
		};
		function showWrapperHTML(ad, nextSibling) {
			var d = eplDoc.createElement('div'), parent_div;
			d.id = 'div' + (nextSibling ? 'Footer' : 'Header') + 'Wrapper' + ad.id;
			d.innerHTML =  (nextSibling ? ad.wf : ad.wh);
			if (divDefault) {
				parent_div = divDefault.parentNode;
				parent_div.insertBefore(d, nextSibling ? divDefault.nextSibling : divDefault);
			} else {
				parent_div = ad.div.parentNode;
				parent_div.insertBefore(d, nextSibling ? ad.div.nextSibling : ad.div);
			}
		}
		this.getTop = function (a) { 
			var t;
			if (this.posSpecific()) {
				t = (this.py || 0);
			} else if (this.posCenter()) {
				t = (eplDoc.epl.getSH() / 2 - (a ? a.h : this.h) / 2);
			} else if (this.posBottonLeft() || this.posBottonRight() || this.posBottonCenter()) {
				t = (eplDoc.epl.getSH() - (a ? a.h : this.h));
			} else {
				t = 0;
			}
			return t;
		};
		this.hasJSFiles = function() {
			var i;
			for (i in this.a) {
				if (this.a.hasOwnProperty(i)) {
					if (this.getExt(this.a[i]) === 'js') {
						return true;
					}
				}
			}
		};
		this.isSWF = function () { return FORMATOS[this.t].o & OPTIONS_ES_FLASH; };
		this.cOS = function () { return (this.uc && !this.rmt) || this.ac; };
		this.isImg = function () { return FORMATOS[this.t].o & OPTIONS_ES_IMAGEN; };
		this.domDelayed = function () { return FORMATOS[this.t].o & OPTIONS_DOM_DELAYED; };
		this.isHTML = function () { return FORMATOS[this.t].o & OPTIONS_ES_HTML; };
		this.isJS = function() { return ('js' === this.getExt() || (this.rmt ? this.hasJSFiles() : false)); };
		this.isDynamic = function () { return this.prod ? true : false; };
		this.getProduct = function () { return this.prod; };

		this.getUIID = function () {
			if (!this.uiid) {
				this.uiid = this.i || this.fi || ((new Date()).getTime() * Math.random()).toString(16);
			}
			return this.uiid;
		};

		this.useFIF = function () {
			if (this.adm) { return true; }
			if (this.bk) { return false; }
			if (this.o & 2048 || this.o & 8192) { return true; }
			if (this.isHTML() && this.isLayer() && !(this.o & 1)) { return false; }
			if (this.isHTML() && !(this.o & 1)) { return true; }
			if (this.isLayer() || this.isPop()) { return true; }
			if (!this.w || 2 > this.w) { return true; }
			if (!this.h || 2 > this.h) { return true; }
			return false;
		};

		// Tracker 2.0
		function Tracker(ad) {
			this.q = [];
			this.sent = [];
			this.ad = ad;
			this.start = false;
			this.end = false;
			this.time = 0;
			this.inicioAnuncio = function (st) { eplDoc.eplTH4.registrarAccion(this.ad, eplDoc.eplTH4.INICIO, st); };
			this.anuncioCompleto = function () { eplDoc.eplTH4.registrarAccion(this.ad, eplDoc.eplTH4.COMPLETO); };
			this.encendido = function () { eplDoc.eplTH4.registrarAccion(this.ad, eplDoc.eplTH4.ENCENDIDO); };
			this.closeButton = function () { eplDoc.eplTH4.registrarAccion(this.ad, eplDoc.eplTH4.CLOSE_BUTTON); };
			this.desplegar = function () { eplDoc.eplTH4.registrarAccion(this.ad, eplDoc.eplTH4.DESPLEGAR); };
			this.replegar = function () { eplDoc.eplTH4.registrarAccion(this.ad, eplDoc.eplTH4.REPLEGAR); };
		}
		if ((this.tV && this.tV > 1) || this.isRmHTML5()) {
			this.tracker = new Tracker(this);
			eplDoc.eplTH4.setAdR(this);
		}

		this.getDiv = function (hidden) {
			if (this.bd) { divCustom[1] = this.getDivCustom(hidden); }
			return divCustom[1] || this.getDivDefault(hidden);
		};
		this.getDivLayer = function (hidden) {
			return this.setDiv(this.topElement(), 'adLayer' + this.id, hidden, 0, eplDoc.epl.in3pIframe() ? parent.document : eplDoc);
		};
		this.getDivDefault = function (hidden) {
			if (!divDefault) { divDefault = this.setDiv(this.div, 'adDefault' + this.id, hidden, 1); }
			return divDefault;
		};
		this.getDivCustom = function (hidden, n) {
			if (!n) { n = 1; }
			var dck = 'bd' + (n > 1 ? n : '');
			if (!this[dck]) { return this.getDivDefault(hidden); }
			if (!divCustom[n]) {
				divCustom[n] = eplDoc.getElementById(this[dck]);
				if (hidden && divCustom[n]) {
					divCustom[n].style.visibility = 'hidden';
					divCustom[n].style.display = 'none';
				}
			}
			return divCustom[n];
		};
		this.getDivCustom2 = function (hidden) { return this.getDivCustom(hidden, 2); };
		this.getDivCustom3 = function (hidden) { return this.getDivCustom(hidden, 3); };
		this.topElement = function () {
			if (eplDoc.epl.in3pIframe()) { return parent.document.body; }
			if (eplDoc.body) { return eplDoc.body; }
			var e = this.div;
			while (e.parent) { e = e.parent; }
			return e;
		};
		this.setDiv = function (parentObj, idChild, hidden, setTA, doc) {
			var d = (doc || eplDoc).getElementById(idChild);

			if (!d && parentObj) {
				d = eplDoc.createElement('div');
				d.id = idChild;
				if (hidden) {
					d.style.visibility = 'hidden';
					d.style.display = 'none';
				}
				if (setTA && this.ta && ('none' !== this.ta)) {
					d.style.textAlign = this.ta;
					if ('center' === this.ta) {
						d.style.margin = 'auto';
					}
				}
				parentObj.appendChild(d);
			}
			return d;
		};
		this.clearDivs = function () {
			if (divDefault) { divDefault.innerHTML = ''; }
			if (divCustom) { divCustom.innerHTML = ''; divCustom = null; }
			if (divLayer) { divLayer.innerHTML = ''; divLayer = null; }
			if (this.div) { this.div.innerHTML = ''; }
		};
		this.showLayer = function () {
			this.showDiv(this.getDivLayer());
		};
		this.hideLayer = function () {
			this.hideDiv(this.getDivLayer());
		};
		this.showDiv = function (x) {
			var d = x || this.getDiv();
			d.style.visibility = 'visible';
			d.style.display = '';
		};
		this.hideDiv = function (x) {
			var d = x || this.getDiv();
			d.style.visibility = 'hidden';
			d.style.display = 'none';
		};
		this.callUC = function () {
			var i, ix;
			if (this.pv) { return; }
			for (i = 0; i < this.uc.length; i++) {
				ix = new Image();
				ix.src = replaceRandom(this.uc[i]);
				this.iCs.push(ix);
			}
		};
		this.lI = function (uC) {
			var u, i;
			if (this.iLG || this.pv) { return; }
			u = this.getBase('eli', vV) + '/' + (this.sd.sI || sI) + '/' + (this.sd.sec ? (this.sd.sec + '/') : '') + (this.sd.ss ? (this.sd.ss + '/') : '') + this.eI + '?rnd=' + Math.random() + this.getReqArgs();
			i = new Image();
			i.src = u;
			this.iCs.push(i);
			if (uC && this.uc) { this.callUC(); }
			this.iLG = 1;
		};
		this.elvI = function () {
			var u, i;
			u = this.getBase('elvi', vV) + '/' + (this.sd.sI || sI) + '/' + (this.sd.sec ? (this.sd.sec + '/') : '') + (this.sd.ss ? (this.sd.ss + '/') : '') + this.eI + '?i=' + this.i + '&pb=' + this.id + '&fi=' + this.fi;
			i = eplDoc.createElement('script');
			i.src = u;
			eplDoc.body.appendChild(i);
		};
		this.setShown = function () {
			if (this.shown) { return; }
			this.shown = 1;
			if (! this.sIF || this.t === 152) {
				if (this.cOS() || this.space.hasChaining()) {
					this.lI();
				}
				if (this.uc) {
					this.callUC();
				}
			}

			if (this.tVi) {
				eplDoc.epl.initCheckVisibility(this);
			}
		};
		this.openExpanded = function (usePATH, useEID) {
			var r = false;
			if (1 === this.ie || 2 === this.ie) {
				usePATH = (this.ieU === 1) ? 0 : usePATH;
				r = (0 === this.getHits(usePATH, useEID));
				this.saveHits(usePATH, useEID);
			}
			if (0 === this.ie) { r = false; }
			if (3 === this.ie) { r = true; }

			return r;
		};
		this.getHits = function (usePATH, useEID) {
			var v, k = 'eplb' + (useEID ? this.getFID() : this.id) + (usePATH ? '_' + escape(eplDoc.location.pathname) : ''), h;
			v = eplDoc.epl.getCookie(k);
			h = (v && (! isNaN(v))) ? parseInt(v, 10) : 0;
			return h;
		};
		this.saveHits = function (usePATH, useEID) {
			var now = new Date(), now00 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0), expDateMillis = now00.getTime() + (3600 * 1000), k, v;
			if (2 === this.ie) { expDateMillis += (3600 * 1000 * 23); }
			k = 'eplb' + (useEID ? this.getFID() : this.id) + (usePATH ? '_' + escape(eplDoc.location.pathname) : '');
			v = this.getHits(usePATH, useEID) + 1;
			eplDoc.epl.setCookie(k, v, '/', new Date(expDateMillis));
		};

		this.getTrackURL = function (firstParam) { return this.getBase('ermt', '3') + '/' + (this.sd.sI || sI) + '/' + (this.sd.sec ? (this.sd.sec + '/') : '') + (this.sd.ss ? (this.sd.ss + '/') : '') + this.eI + '?il=0' + (firstParam || '') + this.getReqArgs(); };
		this.getFlashVars = function (fvx, v) {
			var FV, iX, l, fid, o;
			FV = 'clickTag=' + escape(this.lU);
			for (iX = 2; iX < (this.nl + 1); iX++) {
				l = this.lU + '&lid=' + iX;
				FV += '&clickTag' + iX + '=' + escape(l);
			}
			fid = 8 > v ? this.getFIDQ() : this.getFID();
			if (this.rmt) {
				FV += '&bannerId=' + fid;
				if (!this.pv) { FV += '&trackURL=' + escape(this.getTrackURL()); }
				for (o in this.a) {
					if (this.a.hasOwnProperty(o) && this.a[o].v) {
						FV += '&' + this.a[o].v + '=' + escape(this.getURL(this.a[o]));
					}
				}
			} else if (this.e) {
				FV += '&bannerId=' + fid;
			}
			if (this.vaf) {
				FV += '&' + this.vaf;
			}
			if (this.aT) {
				for (o = 1; undefined !== this['C' + o]; o++) {
					FV += '&C' + o + '=' + this['C' + o];
				}
				for (o = 1; undefined !== this['T' + o]; o++) {
					FV += '&T' + o + '=' + escape(this['T' + o]);
				}
				iX = (this.is || eplDoc.epl.is) + 'esb/4/';
				for (o = 1; undefined !== this['L' + o]; o++) {
					l = this['L' + o].split(':');
					FV += '&L' + o + '=' + escape(iX + l[0].toString(16) + '/' + this.aI + '/' + l[1]) + '.gif';
				}
				for (o = 1; undefined !== this['I' + o]; o++) {
					l = this['I' + o].split(':');
					FV += '&I' + o + '=' + escape(iX + l[0].toString(16) + '/' + this.aI + '/' + l[1]) + '.gif';
				}
			}
			return FV + (fvx ? '&' + fvx : '');
		};
		this.getExt = function (a) { return (a ? a.e : (this.isSWF() ? "swf" : FORMATOS[this.t].x)); };
		this.getURL = function (a, base) {
			var is = this.is || eplDoc.epl.is, u = is + 'esb/4/', pr = this.getProduct();
			if (base) {
				u += this.s.toString(16) + '/' + this.aI + '/' + this.bI;
			} else if (a) {
				u += a.s.toString(16) + '/' + this.aI + '/' + a.bI + '.' + this.getExt(a);
			} else if (pr) {
				u = pr.smallimg || pr.bigimg;
			} else if (!this.rmt) {
				if (this.iurl) {
					u = this.iurl;
				} else {
					u += this.s.toString(16) + '/' + this.aI + '/' + this.bI + '.' + this.getExt();
				}
			} else {
				throw "a is undef and this.rmt is defined";
			}
			return u;
		};
		this.getFrameURL = function (d) {
			var u, k = this.sd.kC || kC, kws = (k && this.kw) ? ('&kw_' + k + '=' + this.kw) : getkVstr(this.eI);
			u = this.getBase('eat', '5') + '/' + (this.sd.sI || sI) + '/' + (this.sd.sec ? this.sd.sec + '/' : '') + (this.sd.ss ? (this.sd.ss + '/') : '') + this.eI + '?o=' + (d ? 'j' : 'f') + kws + '&rnd=' + getRnd() +this.getReqArgs() + (this.ct ? ('&3pct=' + this.ct) : '');
			return u;
		};

		this.getFVID = function () {
			var id = (2 === this.fv) ? '2' : (4 === this.fv) ? '4,0,2,0' : this.fv + ',0,0,0';
			return id;
		};
		this.getIframeHTML = function(id, s, h) {
			return '<html><head><title>Ad</title>' +(h || '') + '</head><body id="' + id + '" leftmargin="0" topmargin="0" style="overflow:hidden; margin:0px; padding:0px;">' + s + '</body></html>';
		};
		this.setHTML5Tag = function(div, ao, opts) {
			var u, a, ct = '', p = '', iframe, d, is = eplDoc.epl.getISJ(this), h, l, isw, width, height, fvars, fvarsp, fvarsq, LAST_VERSION = 11, params, values, o, scriptIndex, base, scriptCT;
			a = ao ? this.a[ao] : null;
			u = this.getURL(a);
			width = ((a && (a.cw || a.w)) ? (a.cw || a.w) : (this.cw || this.w)) - 2 * (this.brdw || 0) + 'px';
			height = ((a && (a.ch || a.h)) ? (a.ch || a.h) : (this.ch || this.h)) - 2 * (this.brdw || 0) + 'px';
			iframe = document.createElement('iframe');
			iframe.id = 'ifr' + this.id + '_' + this.getUIID();
			iframe.name = 'ifr' + this.id + '_' + this.getUIID();
			iframe.src = 'about:blank';
			iframe.scrolling = '0';
			iframe.frameBorder = 'no';
			iframe.style.width = width;
			iframe.style.height = height;
			iframe.style.border = '0px none';
			iframe.style.overflow = 'hidden';

			if (this.isLayer() && (! this.rmt) && (! this.isRmHTML5())) {
				div.innerHTML = (div.innerHTML || '') + this.getPreLayerContainer() + '<span id="span_' + this.getFID() + '"></span>'  + this.getPostLayerContainer();
				eplDoc.getElementById('span_' + this.getFID()).appendChild(iframe);
			} else {
				div.appendChild(iframe);
			}
			if (this.isHTML5()) {
				scriptCT = "<script type='text/javascript'>" + "window.clickTag='" + this.lU + "'; window.bannerId='" + this.getFID() + "';</script>";
				scriptIndex = "<script type='text/javascript'";
				scriptIndex.id = 'index_js';
				if (this.isZip()) {
					base= "<base href='" + this.getURL(undefined, 1) + "/'/>";
					scriptIndex += "src='" + this.getURL(undefined, 1) + "/__index.js'></script>";
				} else {
					scriptIndex += "src='" + this.getURL(undefined, 1) + ".js'></script>";
				}
				h = this.getIframeHTML(iframe.id, scriptCT + scriptIndex, base);
			} else if (this.rmt) {
				p = 'var isSwiffy = true;';
				if (!opts) { opts = {}; }
				if (opts) {
					for (i in opts) {
						if (opts.hasOwnProperty(i)) {
							if (i === 'fv') {
								params = opts[i].split('&');
								for (o in params) {
									if (params.hasOwnProperty(o)) {
										values = params[o].split('=');
										if (values.length >= 2) {
											p += 'var ' + values[0] + ' = ' + values[1] + ';';
										}
									}
								}
							} else {
								p += 'var ' + i + ' = ' + JSON.stringify(opts[i]) + ';';
							}
						}
					}
				}
				fvars = this.getFlashVars(LAST_VERSION);
				if (fvars) {
					fvarsp = fvars.split('&');
					for (i = 0; i < fvarsp.length; i++) {
						fvarsq = fvarsp[i].split('=');
						if (fvarsq.length && fvarsq.length === 2) {
							p += 'var ' + fvarsq[0] + '="' + fvarsq[1] + '";';
						}
					}
				}
				isw = '<div id="sc" style="width: ' + width + '; height: ' + height + '"></div><scr' + 'ipt>var stage = new swiffy.Stage(document.getElementById("sc"),swiffyobject, {});stage.start();</scr' + 'ipt>';
				h = this.getIframeHTML(iframe.id, '<scr' + 'ipt>' + p + '</scr' + 'ipt><scr' + 'ipt type="text/javascript" src="https://www.gstatic.com/swiffy/v7.3.0/runtime.js"></scr' + 'ipt><scr' + 'ipt src="' + u + '" type="text/javascript"></scr' + 'ipt>' + isw);
			} else {
				ct = '<div style="width:100%; height:100%; position:absolute; z-index:2147483647; cursor:pointer;" onclick="window.open(\'' + this.lU + '\', \'_blank\');"></div>';
				h = this.getIframeHTML(iframe.id, ct + '<scr' + 'ipt src="' + u + '" type="text/javascript"></scr' + 'ipt><scr' + 'ipt src="' + is + 'layers/v4_sprite5.js" type="text/javascript"></scr' + 'ipt>');
			}
			d = iframe.contentDocument || iframe.contentWindow || iframe.document || iframe.window;
			if (d.document) { d = d.document; }
			d.write(h);
			d.close();
			return iframe;
		};
		this.getFlashTag = function (a, opts) {
			var prop, cT = '', w, h, ver, A, x, u, iX, l, wh;
			if (!this.isSWF()) {
				throw "Not a flash ad";
			}
			if (!opts) { opts = {}; }
			ver = this.getFVID();
			if (this.lo & LO_ADAPTAR_TAMANO) {
				w = eplDoc.epl.getSW();
				h = eplDoc.epl.getSH();
				if (this.lo & (LO_CLOSE_BUTTON | this.lo & LO_TITLE)) {
					h -= 13;
				}
			} else {
				w = (a ? a.cw || a.w : this.cw || this.w) - 2 * (this.brdw || 0);
				h = (a ? a.ch || a.h : this.ch || this.h) - 2 * (this.brdw || 0);
			}
			wh = 'width="' + w + '" height="' + h + '"';
			A = {quality: "autohigh", loop: "true", allowscriptaccess: "always", allowFullScreen: "true"};
			if (opts.p) {
				for (x in opts.p) { if (opts.p.hasOwnProperty(x)) { A[x] = opts.p[x]; } }
			}
			u = this.getURL(a);
			if (this.fv < 6) {
				u += '?clickTag=' + escape(this.lU);
				for (iX = 2; iX < (this.nl + 1); iX++) {
					l = this.lU + '&lid=' + iX;
					u += '&clickTag' + iX + '=' + escape(l);
				}
			} else {
				A.flashvars = this.getFlashVars(opts.fv, a ? a.fv : this.fv);
			}
			cT = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + ver + '" ' + wh + ' border="0" id="eplb' + this.id + '_object">';
			cT += '<param name=movie value="' + u + '">';
			A.wmode = ('t' === this.fbt) ? 'transparent' : 'opaque';
			if ('c' === this.fbt) { A.bgcolor = this.fbc; }
			for (prop in A) {
				if (A.hasOwnProperty(prop)) { cT += '<param name=' + prop + ' value="' + A[prop] + '">'; }
			}
			cT += '<embed id="eplb' + this.id + '_embed" name="eplb' + this.id + '" src="' + u + '" ';
			for (prop in A) {
				if (A.hasOwnProperty(prop)) { cT += prop + '="' + A[prop] + '" '; }
			}
			cT += 'pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" ' + wh + ' border="0"></embed></object>';
			return cT;
		};
		this.getImgTag = function () {
			var funcs = '', iId = 'eplad_' + this.getFID() + '_image', wA, l, cT;
			if (8 === this.e) {
				funcs = ' onmouseover="eplExpandLayer(' + this.getFIDQ() + ');" ';
				funcs += ' onmouseout="eplShrinkLayer(' + this.getFIDQ() + ');"';
			} else if (7 === this.e) {
				funcs = ' onmouseover="eplExpandLayer(' + this.getFIDQ() + ');" ';
				funcs += ' onmouseout="eplShrinkLayer(' + this.getFIDQ() + ');"';
			} else if (this.lnw && this.po && (this.po & 128)) {
				funcs = ' onclick="window.open(this.href); window.close(); return false;"';
			}
			if (6 === this.e && this.lo & LO_ADAPTAR_TAMANO) {
				this.cw = eplDoc.epl.getSW();
				this.ch = eplDoc.epl.getSH();
				if (this.lo & (LO_CLOSE_BUTTON | this.lo & LO_TITLE)) {
					this.ch -= 13;
				}
			}
			wA = ((!this.nlu) || funcs);
			l = this.nlu ? '#' : this.lU;
			cT = '';
			if (wA) { cT += '<a href="' + l + '"' + funcs + ' target="' + (this.lnw ? "_blank" : "_top") + '">'; }
			cT += '<img src="' + this.getURL() + '" id="' + iId + '" name="' + iId + '" border="0" width="' + (this.cw || this.w) + '" height="' + (this.ch || this.h) + '" alt="' + this.tit + '">';
			if (wA) { cT += '</a>'; }
			if ((34 === this.e) || (32 === this.e) || (35 === this.e)) {
				cT += '<br/>' + this.tit;
			}
			if ((34 === this.e) || (33 === this.e) || (35 === this.e)) {
				cT += '<br/>' + this.desc;
			}
			if ((35 === this.e) && this.urlv) {
				cT += '<br/>';
				if (!this.nlu) { cT += '<a href="' + l + '" target="' + (this.lnw ? "_blank" : "_top") + '">'; }
				cT += this.urlv;
				if (!this.nlu) { cT += '</a>'; }
			}
			return cT;
		};
		this.getTxtTag = function () {
			var f = {c: this.fC || 'black', f: this.fF || 'arial', s: this.fS || 12}, tit = this.nlu ? this.tit : ('<a style="color:' + f.c + ';decoration:none;" target="_blank" href="' + this.lU + '">' + this.tit + '</a>'), desc = (this.desc && 128 !== this.e) ? this.desc : '', url = '', cT;

			if (130 === this.e || 132 === this.e) {
				url = (this.nlu || 130 === this.e) ? this.urlv : ('<a style="color:' + f.c + ';decoration:none;" target="_blank" href="' + this.lU + '">' + this.urlv + '</a>');
			}
			cT = '<table style="font-family:' + f.f + ';color:' + f.c + ';font-size:' + f.s + 'px;">';
			cT += '<tr><th align=left>' + tit + '</th></tr>';
			if (desc) { cT += '<tr><td>' + desc + '</td></tr>'; }
			if (url) { cT += '<tr><td>' + url + '</td></tr>'; }
			cT += '</table>';
			return cT;
		};
		this.getPreLayerContainer = function() {
			var pre = '<table style="' + (6 === this.e ? 'margin:auto;' : '') + '" width="' + (this.lo & LO_ADAPTAR_TAMANO ? eplDoc.epl.getSW() : ad.w) + '" cellspacing="0" cellpadding="0"><tr>';
			if (this.lo & LO_TITLE) {
				pre += '<td align="left" style="color: #7f7f7f; font-family: Arial; font-size: 11px;">' + this.tit + '</td>';
			}
			if (this.lo & LO_CLOSE_BUTTON || (this.isJS() && !this.isHTML5())) {
				pre += '<td style="color: #7f7f7f; font-family: Arial; font-size: 11px;" align="right"><a style="text-decoration: none;" href="#" onClick="eplHideLayer(\'' + this.getFID() + '\');return false;">' + (ad.lbc ? '<img id="boton_cerrar_custom" src="' + ad.lbc + '">' : '&nbsp;X') + '</a></td>';
			}
			pre += '</tr><tr><td ';
			if ((this.lo & LO_CLOSE_BUTTON) && (this.lo & LO_TITLE)) { pre += ' colspan="2"'; }
			pre += '>';
			return pre;
		};
		this.getPostLayerContainer = function() {
			return '</td></tr></table>';
		};
		this.getBaseTag = function (ao, opts) {
			var a, cT, pre, post;
			if (this.rmt && (!ao)) {
				throw "orden must be defined for RMT";
			} else if (ao && (!this.a[ao])) {
				throw "unknown orden: " + ao;
			}
			if (ao) {
				a = this.a[ao];
			}
			if ((!ao) && (this.lo & (LO_TITLE | LO_CLOSE_BUTTON))) {
				pre = this.getPreLayerContainer();
				post = this.getPostLayerContainer();
			}
			if (this.brdw) {
				pre = '<table border="0" cellspacing="0" cellpadding="0"><tr><td style="padding:0px; border:' + this.brdw + 'px solid ' + this.brdc + '">';
				post = '</td></tr></table>';
			}
			if (a) {
				if ("swf" === a.e) {
					cT = this.getFlashTag(a, opts);
				} else if (("gif" === a.e) || ("jpg" === a.e) || ("png" === a.e)) {
					if (a.nlu) {
						cT = '<img src="' + this.getURL(a) + '" border="0" width="' + (a.cw || a.w) + '" height="' + (a.ch || a.h) + '" alt="' + this.tit + '">';
					} else {
						cT = '<a href="' + this.lU + '"><img src="' + this.getURL(a) + '" border="0" width="' + (a.cw || a.w) + '" height="' + (a.ch || a.h) + '" alt="' + this.tit + '">';
					}
				} else {
					throw "unknown ext for a: " + a.e;
				}
			} else if (this.isSWF()) {
				cT = this.getFlashTag(null, opts);
			} else if (this.isImg()) {
				cT = this.getImgTag();
			} else if (41 === this.t) {
				cT = this.getTxtTag();
			} else if (6 === this.t) {
				cT = "";
			} else {
				throw "getBaseTag: Unknown format: " + this.t;
			}
			if (pre) {
				cT = pre + cT;
			}
			if (post) {
				cT = cT + post;
			}
			return cT;
		};
		this.showPopUp = function () {
			var tag = '', u = 'about:blank', fu = this.getFrameURL(false), x = (this.x || 0 === this.x) ? this.x : (eplDoc.epl.getSW() / 2 - this.w), y = (this.y || 0 === this.y) ? this.y : (eplDoc.epl.getSH() / 2 - this.h), opts = 'width=' + this.w + ',height=' + this.h + ',left=' + x + ',top=' + y, w, i,
			openCloseWindow = function () {
				var ghost = window.open('about:blank');
				ghost.focus();
				ghost.close();
			},
			openCloseTab = function () {
				var nothing = '', ghost = document.createElement("a");
				ghost.href   = "data:text/html,<scr"+nothing+"ipt>window.close();</scr"+nothing+"ipt>";
				document.getElementsByTagName("body")[0].appendChild(ghost);
				ghost.parentNode.removeChild(ghost);
			};

			opts += ',toolbar=' + ((this.po & 1) ? 'yes' : 'no');
			opts += ',status=' + ((this.po & 2) ? 'yes' : 'no');
			opts += ',scrollbars=' + ((this.po & 4) ? 'yes' : 'no');
			opts += ',menubar=' + ((this.po & 8) ? 'yes' : 'no');
			opts += ',directories=' + ((this.po & 16) ? 'yes' : 'no');
			opts += ',location=' + ((this.po & 32) ? 'yes' : 'no');
			opts += ',resizable=' + ((this.po & 64) ? 'yes' : 'no');

			if (!this.isPopSite() && !this.isHTML() && (!this.o & 1)) {
				tag = '<html><head><title>' + this.tit + '</title></head><body style="margin:0px">' + this.getBaseTag(this.rmt ? 1 : null) + '<img src="' + fu + '" width="1" height="0" /></body></html>';
			}

			if (this.isPopSite()) {
				u = this.iurl;
			} else if (this.isHTML() || this.o & 1) {
				u = fu;
			}

			w = eplDoc.epl.window.open(u, 'pop' + this.getFID(), opts);
			if (w) {
				if (!this.isPopSite() && !this.isHTML() && !this.o&1) {
					w.document.write(tag);
					w.document.close();
				}
				if (this.isPopSite()) {
					i = new Image(); 
					i.src = fu;
					this.iCs.push(i);
				}
				if (this.isPopUnder()) {
					try{
						w.blur();
						w.opener.window.focus();
						window.self.window.focus();
						window.focus();
						if (eplDoc.epl.browser.isFF) { 
							setTimeout(function() {
								openCloseWindow(); 
							}, 1000);
							w.blur();
							w.opener.window.focus();
							window.self.window.focus();
							window.focus();
						}
						if (eplDoc.epl.browser.webkit) { openCloseTab(); }
						if (eplDoc.epl.browser.isIE) {
							setTimeout(function() {
								w.blur();
								w.opener.window.focus();
								window.self.window.focus();
								window.focus();
							}, 1000);
						}
						tag = '<html><head><title>' + this.tit + '</title><script> window.blur(); </script></head><body style="margin:0px">' + this.getBaseTag(this.rmt ? 1 : null) + '<img src="' + fu + '" width="1" height="0" /></body></html>';
						w.document.write(tag);
						w.document.close();
					} catch (ignore) {}
				}
			}
		};
	}

	function Space(d) {
		var wha = d.wh ? d.wh.split("x") : null, sda = d.sd ? d.sd.split('!') : null;
		if (!firstRequestTime) {
			firstRequestTime = (new Date()).getTime();
		}
		this.vNotify = function() {
			var sw = eplDoc.epl.getSW(), sh = eplDoc.epl.getSH(), url = this.getBase('vs', vV) + '/' + (this.sd.sI || sI) + '/' + (this.sd.sec ? this.sd.sec + '/' :'') + this.eI;
			if (sw && sh) { url += '?n=' + sw.toString(16) + 'x' + sh.toString(16); }
			eplDoc.epl.request(url);
			return url;
		};
		this.sd = { sI:(sda?sda[0] : sI), sec:(sda?sda[1] : sec), sV:(sda?sda[2] : sV) };
		this.autoc = { sd: d.wh || (d.w&&d.h?d.w + 'x' + d.h : null), lnw: d.lnw };
		this.sd.ss = this.sd.sec ? (sda?sda[4]:ss) : null;
		this.sd.ssu = this.sd.ss ? this.sd.ss.split('/').join('_') : null;
		this.t = parseInt(d.t,10);
		this.status=0;
		this.timeout = d.timeout || 0;
		this.eI=d.eI;
		this.ma = parseInt(d.ma, 10);
		this.ct = encodeURIComponent(d.ct || '');
		this.w = wha ? wha[0] : d.w;
		this.h = wha ? wha[1] : d.h;
		this.ads_shown=0;
		this.csf = null;
		this.psf = null;
		this.getSSSE = function() {
			return (this.sd.sI || sI) + '_' + (this.sd.sec ? this.sd.sec + '_' : '') + (this.sd.ss ? this.sd.ss + '_' : '') + this.eI;
		};
		this.cbNoAd = d.cbNoAd;
		this.cbAd = d.cbAd;
		this.p = d.p;
		this.sRender = function() {
			var key = 'sr_' + this.getSSSE();
			eplDoc.epl.localStorage.add(key, 1);
		};
		this.elvI = function() {
			var key = 'vi_' + this.getSSSE(), value = eplDoc.epl.localStorage.get(key);
			eplDoc.epl.localStorage.add(key, 1);
		};
		this.getViewabilityData = function() {
			var ssse = this.getSSSE(), r = eplDoc.epl.localStorage.get('sr_' + ssse) || 0, v = eplDoc.epl.localStorage.get('vi_' + ssse) || 0, ratio = r > 0 ? (v/r) : 0;
			return {
				render: r,
				ratio: window.parseInt(ratio * 10, 10)
			};
		};
		if ((2 === this.t) || (3 === this.t)) {
			this.sd.kC = sda ? sda[3] : kC;
			this.kws_count=0;
			this.ids=[];
			this.nids=[];
			elist.push(d.eI);
		} else if (1!==this.t) {
			throw "Unknown space type: " + this.t;
		}
		this.id2hex = function (d) {
			var hD='0123456789ABCDEF', h = hD.substr(d&15,1);
			while (d>15) {
				d>>=4;
				h = hD.substr(d&15,1) + h;
			}
			while (h.length < 6) { h = '0' + h; }
			return h;
		};
		this.getBase = function(h, v) {
			return (this.sd.sV || sV) + h + '/' + (eplDoc.epl.ext ? 'c' : '') + (v || cV);
		};
		this.getAdsURL = function () {
			var i,j,url=this.getBase('eb') + '/' + (cI ? cI + '/' : ((this.sd.sI || sI) + '/' + (this.sd.sec?this.sd.sec + '/':'') + (this.sd.ss?(this.sd.ss + '/'):''))) + this.eI + '?rnd=' + getRnd() + '&fv=' + eplDoc.epl.getBFV() + (this.autoc.sz?'&sz=' + this.autoc.sz:'') + (0 === this.autoc.lnw?'&lnw=0':'') + getkVstr() + dVstr + getDocURL() + getReferrerURL(), sw, sh, cs, o, skip, str, s;
			if (this.ma) { url +=  '&ma=' + this.ma; }
			if (eplDoc.epl.hasCSDCookie()) { url += "&csd=1"; }
			if (this.p) { url += "&p=" + this.p; }
			sw = eplDoc.epl.getSW(); sh = eplDoc.epl.getSH();
			if (sw&&sh) { url += "&n=" + sw.toString(16) + "x" + sh.toString(16); }

			cs = eplDoc.epl.getCS();
			if (cs) { url += '&crs=' + cs; }

			if ((2 === this.t) || (3 === this.t)) {
				url +=  '&kc=' + (this.sd.kC || kC);
				o = 3 === this.t?'h':'x';
				url += '&o=' + o;

				// keyword + ids
				for (i = 0; (i < this.ids.length) && (url.length < 2000); i++) {
					skip = false;
					for (j=0; j<this.ids[i][1].length; j++) {
						if (1 === this.nids[this.ids[i][1][j]]) {
							skip = true;
						}
					}
					if (! skip) {
						str = this.ids[i][0].replace('&','%26').replace('=','%3D');
						url += '&kps_' + str + '=';
						for (j=0; j<this.ids[i][1].length; j++) {
							url += this.id2hex(this.ids[i][1][j]);

						}
					}
				}
			}

			str = eplDoc.epl.getSearchQuery();
			if (str) {
				url += "&q=" + str;
			}
			s = this.getViewabilityData();
			url += '&vs=' + (s.render >= 4 ? s.ratio.toString(16) : 'F');
			return url;
		};
		this.loadAds = function () {
			eplDoc.epl.request(this.getAdsURL());
		};
		this.isDefferred = function() {
			return (this.e & 1);
		};
		this.rendered = function() {
			return this._r;
		};
		this.setAds = function (ads) {
			var i, a;
			if (!ads || !ads.length) {
				ads = [];
			}
			this.ads=[];
			for (i=0; i<ads.length; i++) {
				ads[i].eI=this.eI;
				ads[i].aX=i;
				a = new AdObj(ads[i]);
				this.ads.push(a);
			}
		};
		this.clearAds = function () {
			var ad;
			while (this.ads.length) {
				ad = this.ads.shift();
				ad.clearDivs();
			}
			this.ads_shown = false;
		};
		this.reload = function () {
			this.clearAds();
			this.loadAds();
		};
		this.nextChain = function() {
			var adObj = this.ads[this.chainCounter + 1];
			if (adObj) {
				if (adObj.isChaining()) {
					this.chainCounter++;
					this.showChain();
				} else {
					this.removeChainIframe();
					this.showAds(this.chainCounter + 1);
				}
			}
		};
		this.hasChaining = function() {
			var i;
			for (i = 0; i < this.ads.length; i++) {
				if (this.ads[i].isChaining()) {
					return true;
				}
			}
			return false;
		};
		this.impChain = function() {
			var adObj = this.ads[this.chainCounter];
			adObj.setShown();
		};
		this.showChain = function() {
			var iF = this.chainIframe, adObj = this.ads[this.chainCounter], h, d, t, ct = 0, that = this, maxTime = spaceRequestDelay ? (spaceRequestDelay * 20) : 3000;
			if (maxTime < 1500) {
				maxTime = 1500;
			}
			iF.id = 'ifr' + adObj.id + '_' + adObj.getUIID();
			iF.name = 'ifr' + adObj.id + '_' + adObj.getUIID();
			if (adObj.w && adObj.h) {
				iF.width = adObj.w + 'px';
				iF.height = adObj.h + 'px';
			} else {
				iF.width = '0px';
				iF.height = '0px';
			}
			h = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3c.org/TR/REC-html40/loose.dtd"><html><head><title>Ad</title></head><body id="' + iF.id + '" leftmargin="0" topmargin="0" style="margin:0px;padding:0px"><scri' + 'pt>var inIframe=1, eplChainNext = function() { parent.window.eplDoc.epl.spaces["' + this.eI + '"].nextChain(); }, eplChainImp = function() { parent.window.eplDoc.epl.spaces["' + this.eI + '"].impChain(); };</scri' + 'pt>' + decodeURIComponent(adObj.tag) + '</body></html>';
			d = iF.contentDocument || iF.contentWindow || iF.document || iF.window;
			if (d.document) { d = d.document; }
			d.write(h);
			if (eplDoc.epl.browser.isFFAll) {
				d.close();
			}
			t = setInterval(function() {
				if (that.hasAdInChain()) {
					that.impChain();
					clearInterval(t);
				} else if (ct >= maxTime) {
					that.nextChain();
					clearInterval(t);
				}
				ct += 200;
			}, 200);
		};
		this.hasAdInChain = function() {
			var iF = this.chainIframe, d, html, body, height, HeightOffset = 30;
			if (iF) {
				d = iF.contentDocument || iF.contentWindow || iF.document || iF.window;
				html = d.documentElement;
				body = d.body;
				height = Math.max(body.offsetHeight, html.scrollHeight, html.offsetHeight);
				if (height >= HeightOffset) {
					return true;
				}
				return false;
			}
			return false;
		};
		this.removeChainIframe = function() {
			if (this.chainIframe) {
				this.chainIframe.parentNode.removeChild(this.chainIframe);
				this.chainIframe = null;
			}
		};
		this.setChainIframe = function() {
			var iF = eplDoc.createElement('iframe'), e = this.getDiv();
			iF.src = eplDoc.epl.browser.isFFAll ? eplDoc.epl.window.location.href.toString() : 'about:blank';
			iF.width = '0px';
			iF.height = '0px';
			iF.frameBorder = '0';
			iF.scrolling = 'no';
			this.chainIframe = iF;
			e.appendChild(iF);
		};
		this.setChain = function(i) {
			this.chainCounter = i;
			this.setChainIframe();
			this.showChain();
		};
		this.getDiv = function () { return ( oIF && eplDoc.epl.in3pIframe() ? parent.eplDoc : eplDoc).getElementById('eplAdDiv' + this.eI); };
		this.showAds = function (init) {
			var aDiv = this.getDiv(), c, ret, hlp, i, adObj, tY, h, eh, shown, t, withIframes = false, intDiv;
			if (init) {
				this.ads_shown = 0;
			}
			if (!spaceRequestDelay) {
				spaceRequestDelay = (new Date()).getTime() - firstRequestTime;
			}
			if (this.ads_shown) {
				throw "ads for " + this.eI + " already shown";
			}

			if (aDiv && this.ads) {
				this.ads_shown=1;
				c=[];
				if (this.csf) {
					ret = this.csf(this.ads);
					if (ret) {
						c.push(ret);
						for (i = init || 0; i < this.ads.length; i++) {
							adObj = this.ads[i];
							if (adObj.shown) {
								adObj.shown = 0;
								adObj.setShown();
							}
						}
					}
				}
				hlp = [];

				for (i = init || 0; i < this.ads.length; i++) {
					adObj = this.ads[i];
					adObj.div = aDiv;
					tY = adObj.t;
					if (!adObj.shown) {
						h = adObj.getHelper();
						eh = adObj.getHelperEfecto();
						shown = 1;
						if (adObj.isChaining()) {
							this.setChain(i);
							break;
						} else if (adObj.isPop() && !adObj.isOpenedBy3p()) {
							adObj.showPopUp();
						} else if ((adObj.o & 32769) || (4 === tY) || adObj.isOpenedBy3p()) {
							eplDoc.epl.showIframe(adObj);
							withIframes = true;
						} else if (eh) {
							pushQAd(eh, adObj);
							hlp.push(eh);
							shown = 0;
						} else if (h) {
							pushQAd(h, adObj);
							hlp.push(h);
							shown = 0;
						} else if (59 === tY || adObj.isHTML5()) {
							adObj.setHTML5Tag(aDiv);
							if (adObj.isRmHTML5()) {
								adObj.tracker.inicioAnuncio();
							}
						} else if (adObj.isJS()) {
							adObj.setHTML5Tag(aDiv, 1);
							if (adObj.tracker && !adObj.fI) {
								adObj.tracker.inicioAnuncio();
							}
						} else if (1 === tY || 7 === tY || 8 === tY || 2 === tY || 41 === tY || 6 === tY) {
							c.push(adObj.getBaseTag());
						} else if (9 === tY || 16 === tY || 54 === tY || 55 === tY) {
							c.push(adObj.getBaseTag(1));
							if (adObj.tracker && !adObj.fI) {
								adObj.tracker.inicioAnuncio();
							}
						} else {
							throw "[showAds] Unknown format: " + tY;
						}
						if (adObj.isChaining()) {
							adObj.shown = 0;
							shown = 0;
						}
						if (shown) {
							adObj.setShown();
						}
					}
					adObj.showWrapper();
				}
				if (c.length) {
					if (withIframes) {
						intDiv = document.createElement('div');
						intDiv.innerHTML = c.join('');
						aDiv.appendChild(intDiv);
					} else {
						aDiv.innerHTML += c.join('');
					}
				}
				if (hlp.length > 0) {
					t = {};
					for (i=0; i<hlp.length; i++) {
						if (! t[hlp[i]]) {
							t[hlp[i]] = 1;
							if (! eplDoc.epl.helpers[hlp[i]]) {
								eplDoc.epl.addHelper(hlp[i], aDiv, adObj);
							} else {
								eplDoc.epl.showByType(hlp[i]);
							}
						}
					}
				}

				if (this.psf) {
					this.psf(this, aDiv);
				}
				if (! this.ads.length && this.cbNoAd && typeof(this.cbNoAd) === 'function') {
					this.cbNoAd();
				} else if (this.ads.length && this.cbAd && typeof(this.cbAd) === 'function') {
					this.cbAd();
				}
			} else {
				throw "ads or div undefined for " + this.eI + "; div=" + aDiv + "; ads=" + this.ads;
			}
		};

		this.setContextual = function() {
			if (2 === eplDoc.epl.contextualStatus) {
				eplDoc.epl.setContextual(this);
			} else {
				eplDoc.epl.contextualArray.push(this);
				if (0 === eplDoc.epl.contextualStatus) {
					eplDoc.epl.appendContextual();
				}
			}
		};	
		this.loadContextual = function() {
			if ("undefined" !== typeof(this.loadKWs) && this.loadKWs) {
				this.loadKWs();
			} else {
				this.setContextual();
			}
		};
	}

	// Para compatibilidad con versiones anteriores
	this.eplPushAd = function (eI, t, timeout, ma) {
		this.setSpace(eI, {t:t,timeout:timeout,ma:ma});
	};
	this.addSpace = function (eI, t, timeout, ma) {
		this.setSpace(eI, {t:t,timeout:timeout,ma:ma});
	};
	this.setOutsideDiv = function (eI) {
		var id = 'eplAdDiv'+eI,
		    d = parent.document,
		    e = d.getElementById(id),
		    cf = window.frameElement,
		    pFs, pEs, pfx;
		if (!e) {
			if (!cf) {
				pFs = d.frames; pEs = d.getElementsByTagName('iframe'); pfx=0;
				while ((pfx < pFs.length) && (pFs[pfx].document !== document)) {
					pfx++;
				}
				cf = pEs[pfx];			
			}
			e = d.createElement('div'); e.id = id;
			cf.parentNode.insertBefore(e, cf);
			cf.style.display='none';
			cf.style.height='0px';
			cf.style.width='0px';
		}
	};
	this.setSpace = function (eI, opts) {
		if (eI) {
			if (!opts) {
				opts = {eI:eI, t:1};
			} else {
				opts.eI = eI;
				if (!opts.t) {
				    opts.t = 1;
				}
			}
			if (opts.kVs) {
				kVsLast = opts.kVs;
				kVsObj[eI] = opts.kVs;
			}
			if (!(parent && this.in3pIframe() && 1 === opts.t)) {
				this.setSpaceHere(eI, opts);
			} else { //salir del iframe
				var d = parent.document, a = this.args;
				if (!d) {
					throw "no document element outside iframe";
				}
				if (!d.epl) {
					a.in3pIF = false;
					parent.oIF = true;
					parent.eplDoc = d;
					d.epl = new EPL();
					d.epl.eplInit(a);
				}
				this.setOutsideDiv(eI, parent);
				eplDoc.epl = d.epl;
				if (opts.custF) {
					d.epl.csfs[eI] = opts.custF;
					if (d.epl.spaces[eI]) {
						d.epl.spaces[eI].csf = opts.custF;
					}
				}
				d.epl.setSpaceHere(eI, opts);
				if (eplDoc && eplDoc.epl && eplDoc.epl.spaces && eplDoc.epl.spaces[eI]) {
					eplDoc.epl.spaces[eI].in3pIf = true;
				}
			}
		}
	};
	this.parseDVs = function (a) {
		var prov, k, str = "", v, vs, i;

		for (prov in a) {
			if (a.hasOwnProperty(prov)) {
				for (k in a[prov]) {	
					if (a[prov].hasOwnProperty(k)) {
						v = a[prov][k];
						vs = [];
						if ('object' === typeof v) {
							for (i = 0; i < v.length; i++) {
								vs.push(escape(v[i]));
							}
						} else {
							vs.push(escape(v));
						}
						str += "&d_" + prov + "_" + k + "=" + vs.join("|");
					}
				}
			}
		}
		return str;
	};
	this.setSpaceHere = function (eI, opts) {
		var e, that;
		if (eI && !this.spaces[eI]) {
			if (!opts) {
				opts = {eI:eI,t:1};
			} else {
				opts.eI = eI;
			}
			e = new Space(opts);
			this.spaces[eI]=e;

			eplDoc.epl.initCheckVisibility(e, function() {
				e.sRender();
			});

			if (this.csfs[eI]) {
				this.spaces[eI].csf = this.csfs[eI];
			}

			if (2 === e.t || 3 === e.t) {
				e.loadContextual();
			} else {
				e.loadAds();
			}
		}
	};
	this.addSpaces = function (eIs) {
		var i, n, e, f = function() { e.sRender(); }, d;
		this.spaceArgs = {};
		for (i = 0; i < eIs.length; i++) {
			n = eIs[i];
			if (-1 !== n.indexOf(':')) {
				d = n.substring(0, n.indexOf(':'));
			} else {
				d = n;
			}
			this.spaceArgs[d] = n;
			e = new Space({eI:d,t:1});
			this.spaces[d]=e;
			eplDoc.epl.initCheckVisibility(e, f);
		}
	};
	this.showSpace = function (eI) {
		var e;
		if (this.spaces[eI]) {
			e = this.spaces[eI];
			if (e.isDefferred()) {
				delete e.e;
				e.ads_shown = 0;
				this.loadAdM(eI);
			} else {
				e._r = true;
				eplDoc.epl.vSpaceNotify(eI);
				if ((e.ads) && (! e.ads_shown)) {
					this.spaces[eI].showAds();
				}
			}
		} else {
			throw "Undefined space: " + eI;
		}
	};
	this.eplReady = function () {
		return this.initDone;
	};
	this.setCookieCSD = function() {
		this.setCookie('CSD', '1', '/', new Date((new Date()).getTime() + 42300 * 1000));
	};
	this.sCsRequested = [];
	this.sCs = function(a) {
		var i, im, s, d;
		for (i = 0; i < a.length; i++) {
			if (typeof a[i] === "object") {
				if (this.sCsRequested.indexOf(a[i].u) === -1) {
					if (a[i].j) {
						s = document.createElement('script');
						s.src = a[i].u;
					} else if (a[i].ifr) {
						s = document.createElement('iframe');
						s.src = a[i].u;
						s.style.width = s.style.height = '1px';
						s.style.display = 'none';
					}

					if (a[i].data) {
						for (d in a[i].data) {
							if (a[i].data.hasOwnProperty(d)) {
								s.setAttribute('data-' + d, a[i].data[d]);
							}
						}
					}
					document.body.appendChild(s);
					this.sCsRequested.push(a[i].u);
				}
			} else if (typeof a[i] === "string") {
				if (this.sCsRequested.indexOf(a[i]) === -1) {
					im = new Image();
					im.src = a[i];
					this.sCsRequested.push(a[i]);
				}
			}
		}
		this.setCookieCSD();
	};
	this.hasCSDCookie = function() {
		var v = this.getCookie('CSD');
		return v ? true : false;
	};
	this.in3pIframe = function () {
		return this.in3pIF;
	};
	this.window = oIF ? window : self.parent;
	this.eplVersion = this.window.eplVersion || 0;

	this.prepareDmpnvg = function (dVs, NVG_QRY) {
		var property;
		for (property in NVG_QRY) {
			if (NVG_QRY[property].indexOf(',') !== -1) {
				NVG_QRY[property] = NVG_QRY[property].split(',');
			}
		}
		return NVG_QRY;
	};

	this.prepareDmpcxs = function (CX_SEGMENTS) {
		if (CX_SEGMENTS instanceof Array || Object.prototype.toString.apply(CX_SEGMENTS) === '[object Array]') {
			return {"segments" : CX_SEGMENTS};
		} else {
			return {};
		}
	};

	this.dmpttargetSetCluster = function (ttprofiles, cluster, data) {
		var value = ttprofiles["get" + cluster];

		if (!value) { return; }
		if (value === "na" || value === "") { return; }
		if (typeof(value) === "object" && value.length && value[0] === "na") { return; }

		data[cluster.toLowerCase()] = value;
	};

	this.prepareDmpttarget = function (ttprofiles) {
		var i, data = {}, clusters = [
			"Age",
			"Gender",
			"Team",
			"Subjects",
			"Profiles",
			"SocialClass",
			"Equipment"
		];
		for (i = clusters.length - 1; i >= 0; i--) {
			this.dmpttargetSetCluster(ttprofiles, clusters[i], data);
		}

		return data;
	};

	this.getdVs = function (dVs) {
		if (!dVs) {
			dVs = {};
		}
		if (this.window.NVG_QRY && (!dVs.nvg)) {
			dVs.nvg = this.prepareDmpnvg(dVs, this.window.NVG_QRY);
		}
		if (this.window._ttprofiles && (!dVs.ttg)) {
			dVs.ttg = this.prepareDmpttarget(this.window._ttprofiles);
		}
		if (this.window.CX_SEGMENTS && (!dVs.cxs)) {
			dVs.cxs = this.prepareDmpcxs(this.window.CX_SEGMENTS);
		}

		return dVs;
	};
	this.eplInit = function (args) {
		var s = args.eIs, e,i,kct,in3pIF, nvgValues;
		sV = args.sV;
		vV = args.vV;
		cV = args.cV || 5;
		sI = args.sI;
		cI = args.cI;
		kC = args.kC;
		rF = args.rF;
		dfpI = args.dfpI;
		dom = args.dom;
		this.ext = args.ext;

		args.dVs = this.getdVs(args.dVs);
		dVstr = this.parseDVs(args.dVs);

		if (args.kVs) {
			kVsLast = args.kVs;
		}

		sec = args.sec;
		ss = args.ss;
		ssu = ss ? ss.split('/').join('_') : null;
		if (s) {
			eIs = [];
			for (i = 0; i < s.length; i++) {
				if ('string' === typeof(s[i])) {
					eIs.push(s[i]);
				} else if (s[i].e) {
					e = s[i].e + (s[i].ma ? (':'+s[i].ma + (s[i].f ? '_'+s[i].f : '')) : '');
					if ((s[i].w && s[i].h) || (s[i].s)) {
						e += '!';
						e += (s[i].w && s[i].h) ? (s[i].w.toString(36).toUpperCase()+'x'+s[i].h.toString(36).toUpperCase()) : '';
						e += s[i].s ? 's' : '';
					}
					eIs.push(e);
				}
			}
		}
		
		this.eId = args.eId;
		this.eClassName = args.eClassName;
		in3pIF = args.in3pIF;
		in3pIF |= (("undefined" !== typeof inIframe) && inIframe);
		in3pIF |= (("undefined" !== typeof inDapIF) && inDapIF);
		in3pIF |= (("undefined" !== typeof inDapMgrIf) && inDapMgrIf);
		in3pIF |= (("undefined" !== typeof inFIF) && inFIF);
		allCSF = args.allCSF;
		this.in3pIF = in3pIF;
		this.isV = args.isV;
		this.args = args;
		if (eIs) {
			// Request multiple - precargar los espacios ahora
			this.addSpaces(eIs);
			if (allCSF) { this.setCustomAdShow('*', allCSF); }
			this.loadAdsM();
		}
		this.initDone = true;
	};
	this.changeSec = function (newSec,newSS) {
		var e, i;
		sec = newSec || sec;
		ss = newSS || ss;
		for (i = 0; i < eIs.length; i++) {
			e = eplDoc.epl.getSpace(eIs[i]);
			if (e.sd && e.sd.sec) { e.sd.sec = sec; }
			if (e.sd && e.sd.ss) { e.sd.ss = ss; }
		}
	};
	this.rH = function (d) {
		var eI, e, s, i, space, rendered = [], respace = [];
		d.sec = d.sec ? d.sec.k : '';
		if (d.sec && -1 !== d.sec.indexOf('/')) {
			s = d.sec.split('/');
			d.sec = s.shift();
			d.ss = s.join('/');
		}
		if (d.sI && d.sI.k !== sI) {
			throw "sI mismatch: " + sI + "!=" + d.sI.k;
		} else if (d.sec && d.sec !== sec) {
			throw "sec mismatch: " + sec + "!=" + d.sec;
		} else if (d.ss && (d.ss !== ss)) {
			throw "subsec mismatch: " + ss + "!=" + d.ss;
		} else {
			if (d.is) {
				this.is = d.is;
			}
			if (d.isJ) {
				this.isJ=d.isJ;
			}
		}
		for (i = 0; i < d.sp.length; i++) {
			space = d.sp[i];
			if (this.spaces[space.k]) {
				e = this.spaces[space.k];
				e.e = space.e;
				if (!e.isDefferred()) {
					e.setAds(space.a);
					if ((e.getDiv()) && (! e.ads_shown)) {
						e.showAds();
						if (e.ads) {
							respace.push(space.k);
						}
					}
				} else if (e.rendered() && !e._rp) {
					rendered.push(space.k);
					e._rp = true;
				}
			} else {
				throw "Unknown space: " +space.k;
			}
		}
		if (rendered.length) {
			eplDoc.epl.loadAdsM(rendered, { dc: 1 });
		}
		if ("undefined" !== typeof(d.cs) && d.cs && d.cs.length) {
			eplDoc.epl.sCs(d.cs);
		}
		if ("undefined" !== typeof(d.spt) && d.spt && d.spt.length) {
			this.sptProcessAll(d.spt);
		}
		if (eplDoc.hbepl && eplDoc.hbepl.done && typeof(eplDoc.hbepl.done) === "function") {
			eplDoc.hbepl.done(respace);
		}
	};
	this.sptL = [];
	this.sptTrack = function(n, o) {
		var url = sV + 'spt/1/' + n.e + '?i=' + n.i + '&fi=' + n.fi + (o.e ? '&e=' + o.e : '&dt=' + o.dt), that = eplDoc.epl;
		if (that.sptL.indexOf(n.i) === -1) {
			that.sptL.push(n.i);
			eplDoc.epl.request(url);
		}
	};
	this.sptProcess = function(n) {
		var st = new Date().getTime(), img = new Image(), that = this;
		img.onload = function() {
			that.sptTrack(n, { dt: (new Date().getTime() - st) });
		};
		img.onerror = function(e) {
			that.sptTrack(n, { e: 404 });
		};
		if (n.u) {
			img.src = n.u;
		}
	};
	this.sptProcessAll = function(a) {
		var i;
		for (i = 0; i < a.length; i++) {
			this.sptProcess(a[i]);
		}
	};
	this.getSpace = function (eI) {
		var s;
		if (!eI) { throw "eI is undefined"; }
		if (this.spaces) {
			s = this.spaces[eI];
			if (s) { return s; }
		} else {
			throw "spaces array not ready";
		}
		throw "Space not found for eI " +eI;
	};
	this.getAd = function (FID) {
		var a, bID, eID, ads, i;
		if (!FID) {
			throw "FID is undefined";
		}
		a = FID.split("_");
		bID = a.pop();
		eID = a.join("_");
		ads = this.spaces[eID].ads;
		for (i=0;i<ads.length;i++) {
			if (ads[i].id === bID) {
				return ads[i];
			}
		}
		throw "Ad not found for FID " +FID;
	};
	
	this.reloadSpace = function (eI) {
		var s = this.getSpace(eI);
		rnd = Math.random();
		if (s) { s.reload(); }
	};
	this.refreshAdsM = function (newSec,newSS) {
		var s;
		if (newSec || newSS) { this.changeSec(newSec || sec,newSS || ss); }
		for (s in this.spaces) {
			if (this.spaces.hasOwnProperty(s)) {
				this.spaces[s].clearAds();
				if (this.spaces[s].in3pIf) {
					delete this.spaces[s];
				}
			}
		}
		rnd = Math.random();
		this.loadAdsM();
	};
	this.refreshAds = function () {
		var s;
		rnd = Math.random();
		for (s in this.spaces) {
			if (this.spaces.hasOwnProperty(s)) { this.spaces[s].reload(); }
		}
	};

	this.getBFV = function () {
		var FV=0, nmT=navigator.mimeTypes, swF='application/x-shockwave-flash', fP=(nmT && nmT[swF])?nmT[swF].enabledPlugin:0, ua = navigator.userAgent.toLowerCase(), av = navigator.appVersion.toLowerCase(), fvT, nP, sf, axo, fvW, i;

		if (fP) {
			nP=navigator.plugins;
			sf="Shockwave Flash";
			if (nP[sf]) {
				fvT=nP[sf].description;
			}
		} else if (ua && ua.indexOf("msie")>=0 && (av.indexOf("win")!==-1)) {
			try {
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
				axo.AllowScriptAccess="always";
				fvT=axo.GetVariable("$version");
			} catch (e) {}
		} 
		if (fvT) { 
			fvW=fvT.split(" ");
			for (i = 0; i < fvW.length; ++i) {
				if (isNaN(parseInt(fvW[i],10))) { continue; }
				FV=fvW[i];
			}
		}
		return FV;
	};
	this.getBase = function(h, v) {
		return sV + h + '/' + ((eplDoc.epl.ext && ! dfpI) ? 'c' : '') + (v || cV);
	};
	this.getAdsMURL = function (eI, o) {
		var e = (eI && eI.length) ? eI.join('+') : eIs.join('+'), u, sw = eplDoc.epl.getSW(), sh = eplDoc.epl.getSH(), cs = eplDoc.epl.getCS(), q = eplDoc.epl.getSearchQuery(), i, s, vs = "", p = '?rnd=' + getRnd() + '&e=' + e + '&fv=' + this.getBFV() + getkVstr() + dVstr + getDocURL() + getReferrerURL();
		if (! eplDoc.hbepl) {
			u = this.getBase('cm') + '/' + (cI || (sI + '/' + sec + (ss ? ('/' + ss) : ''))) + p;
		} else {
			u = this.getBase('hb', '1') + '/' + cI + '/' + dfpI + '/' + dom + "/" + sec + (ss ? ('/' + ss) : '') + p;
		}
		if(sw&&sh){u += "&n="+sw.toString(16)+"x"+sh.toString(16);}
		if (this.hasCSDCookie()) { u += "&csd=1"; }
		if (cs) { u += '&crs='+cs; }
		if (q) { u += '&q=' + q; }
		if (o && o.dc) { u += '&dc=' + o.dc; }
		if (!(eI && eI.length)) {
			for (i = 0; i < eIs.length; i++) {
				if (eplDoc.epl.spaces[eIs[i]]) {
					s = eplDoc.epl.spaces[eIs[i]].getViewabilityData();
					vs += (s.render >= 4 ? s.ratio.toString(16) : 'F');
				}
			}
			u += '&vs=' + vs;
		}
		return u;
	};
	this.loadAdM = function(e) {
		var u;
		if (this.spaceArgs[e]) {
			u = this.getAdsMURL([this.spaceArgs[e]], { dc: 2 });
			this.spaceArgs[e] = null;
			eplDoc.epl.request(u);
		}
	};
	this.loadAdsM = function(eI, o) {
		var u = this.getAdsMURL(eI, o);
		eplDoc.epl.request(u);
	};

	this.showByType = function (type) {
		var hlp, ad;

		if (! this.helpers[type]) {
			throw "No helper for: " + type;
		}

		hlp = this.helpers[type];
		while (null !== (ad = this.shiftQAd(type))) {
			if (hlp.show(ad)) { 
				ad.setShown();
			}
		}
		return true;
	};

	this.addHelper = function (type, div, ad) {
		var t = eplDoc.createElement('script');
		t.src = this.getISJ(ad) + "layers/v4_" + type + ".js" + (this.eplVersion ? "?eplv=" + this.eplVersion : "");
		t.language = "JavaScript1.1";
		t.type = "text/javascript";
		div.appendChild(t);
	};

	String.prototype.ltrim = function () {
		return this.replace(/^\s+/,"");
	};
	this.appendContextual = function() {
		var t, s = document.querySelector('script[src*="epl-41.js"]'), src = s.src.replace('epl-41', 'v4_contextual');
		if (!this.contextualStatus) {
			t = document.createElement("script");
			t.src = src;
			document.body.appendChild(t);
			this.contextualStatus = 1;
		}
	};
	function ponLoad() {
		var i;
		if (!eplDoc.epl.onLoad) {
			eplDoc.epl.onLoad = true;
			if (elist.length) {
				eplDoc.epl.appendContextual();
			}
		}
	}

	function onLoadHandler() {
		ponLoad();
		if (onLoadO) { onLoadO(); }
	}

	/* Inicializacion de la clase */
	onLoadO = window.onload;
	window.onload = onLoadHandler;
}
/* Evitar objetos epl duplicados */
if (!eplDoc.epl) { eplDoc.epl = new EPL(); }

eplDoc.forceChromeRender = function() {
	var object = eplDoc.getElementsByTagName("object"), embed = eplDoc.getElementsByTagName("embed"), i, o, origstyles;
	for (i = 0; i < object.length; i++) {
		for (o = 0; o < object[i].getElementsByTagName("param").length; o++) {
			if (object[i].getElementsByTagName("param")[o].name === "movie" && object[i].getElementsByTagName("param")[o].value.indexOf(".e-planning.net")) {
				origstyles = object[i].style.display;
				object[i].style.display = "block";
				object[i].style.display = origstyles;
			}
		}
	}
	for (i = 0; i < embed.length; i++) {
		if (-1 !== embed[i].src.indexOf(".e-planning.net")) {
			origstyles = embed[i].style.display;
			embed[i].style.display = "block";
			embed[i].style.display = origstyles;
		}
	}
};
if (!eplDoc.chromeRender && eplDoc.epl.browser.chrome && eplDoc.epl.browser.chrome[1] >= 27 && eplDoc.epl.browser.chrome[1] < 31) {
	eplDoc.chromeRender = setTimeout(function() { eplDoc.forceChromeRender(); }, 4000);
}
