function V4HelperExp() {
	this.show = function(ad) {
		var ct, fve, openExp, a1, d, fStyle, ot, sA = (ad.de===1) ? 'T' : 'L', iframe;
		ad.dpx = [ ((ad.h - ad.trh) / (1+ad.ve*3)) , ((ad.w - ad.trw) / (1+ad.ve*3)) ];
		d = this.getC(ad);
		if (11 === ad.t || 57 === ad.t) {
			fve = 'eplEBExpanded=1';
			openExp = ad.openExpanded(1,0);
			a1 = ad.a[1];
			if (!openExp) {
				fve = 'eplEBExpanded=0';
				ad.cw = a1.cw = ad.trw;
				a1.ch = ad.h;
				ad.ch = ad.trh;
			} else {
				ad.cw = a1.cw = ad.w;
				ad.ch = a1.ch = ad.h;
			}
			fve += '&eplVE=' + ad.ve;
			if (ad.isJS()) {
				ad.setHTML5Tag(d, 1, { fv: fve, p: {scale:'noborder', salingn:sA}});
			} else {
				ct = ad.getBaseTag(1, {fv: fve, p: {scale:'noborder',salign:sA}});
			}
		} else if (17 === ad.t || 56 === ad.t) {
			ad.dpx = [ (ad.h - ad.trh) , (ad.w - ad.trw) ];
			ad.cw=ad.trw;
			ad.ch=ad.trh;
			if (ad.isJS()) {
				iframe = ad.setHTML5Tag(d, 1, { p: { scale:'noborder', salign:sA }});
			} else {
				ct = ad.getBaseTag(1, {p: {scale:'noborder',salign:sA}});
			}
		} else if ((7===ad.e) || (8===ad.e)) {
			if (ad.isImg()) {
				ct = ad.getBaseTag();
			} else {
				if (this.uOF(ad)) {
					sA='TL';
				}
				if (ad.isJS()) {
					ad.setHTML5Tag(d);
				} else {
					ct = ad.getBaseTag(null, {p: {scale:'noborder',salign:sA}});
				}
			}
			ad.cw=ad.trw;
			ad.ch=ad.trh;
		} else {
			throw "Unknown type (" + ad.t + ")/effect(" + ad.e +")";
		}
		if (!ad.z) { ad.z = 999; }
		d.style.height = ad.ch+'px';
		d.style.width = ad.cw+'px';
		if (this.uOF(ad)) {
			if (ad.isJS()) {
				if (17 === ad.t) {
					iframe.style.position = 'absolute';
				}
				if (3 === ad.de) {
					d.style.bottom = '0px';
					d.style.top = '';
					if (17 === ad.t) {
						iframe.style.bottom = '0px';
					}
				} else {
					d.style.top = '0px';
					if (17 === ad.t) {
						iframe.style.top = '0px';
					}
				}
				if (4 === ad.de) {
					d.style.right = '0px';
					d.style.left = '';
					if (17 === ad.t) {
						iframe.style.right = '0px';
					}
				} else {
					d.style.left = '0px';
					if (17 === ad.t) {
						iframe.style.left = '0px';
					}
				}
			} else {
				fStyle = 'position:absolute; width:' + ad.w + 'px; height:' + ad.h + 'px;';
				ot = ct;
				fStyle += (ad.de===3) ? 'bottom:0px;' : 'top:0px;';
			        fStyle += (ad.de===4) ? 'right:0px;' : 'left:0px;';
				if (ad.de===3) { d.style.top='';	d.style.bottom='0px'; } else { d.style.top='0px'; }
				if (ad.de===4) { d.style.left=''; d.style.right='0px'; } else { d.style.left='0px'; }
				ct='<div id="'+ad.getFID()+'_flash" style="'+fStyle+'">'+ ot +'</div>';
			}
		}
		if (ad.isImg()) {
			d.style.overflow = 'hidden';
		}
		if (ct) {
			d.innerHTML = ct;
		}
		ad.showDiv();
		if (ad.tracker && !ad.fI) {
			ad.tracker.inicioAnuncio(openExp);
		}
		this.sfapi = ((window.Y && Y.SandBox) ? Y.SandBox.vendor || null : null) || ((window.$sf) ? window.$sf.ext : null);
		if (this.sfapi && !ad.openExpanded(1, 0)) {
			this.sfapi.register(ad.w, ad.h);
		}
		return true;
	};
	this.uOF = function(ad) {
		return (7 === ad.e || 17 === ad.t || 56 === ad.t || 18 === ad.t);
	};
	this.getC = function(ad) {
		var dc, dp;
		if (!this.uOF(ad)) {
			dc = ad.getDiv();
			dc.style.overflow='hidden';
		} else {
			dc = ad.divOver || eplDoc.getElementById('eplDivOver'+ad.getFID());
			if (!dc) {
				// Crear el container div
				dc = eplDoc.createElement('div');
				dc.id = 'eplDivOver'+ad.getFID();
				dc.style.position = 'absolute';
				dc.style.left = (ad.de===4) ? parseInt(ad.trw - ad.w,10)+'px' : '0px';
				dc.style.top = (ad.de===3) ? parseInt(ad.trh - ad.h,10)+'px' : '0px';
				dc.style.overflow = 'hidden';
				dc.style.textAlign = 'left';
				ad.divOver = dc;
				dp = ad.getDiv();
				dp.style.position = 'relative';
				dp.style.overflow = 'visible';
				dp.style.width = ad.trw+'px';
				dp.style.height = ad.trh+'px';
				dp.style.zIndex = 0;
				dp.appendChild(dc);
			}
		}
		return dc;
	};
	this.resize = function(id,t) {
		var w, h, d, done = false, ad, oF, oE;
		ad = eplDoc.epl.getAd(id);
		clearInterval(ad.interval);

                if (this.sfapi) {
                        if (1 === t) {
				if (2 === ad.de || 4 === ad.de) {
					nw = ((2 === ad.de) ? 1 : -1) * (ad.a[1].w - ad.cw);
					nh = 0;
				} else {
					nh = ((1 === ad.de) ? 1 : -1) * (ad.a[1].h - ad.ch);
					nw = 0;
				}
                                this.sfapi.expand(nw, nh);
                        } else {
                                this.sfapi.collapse();
                        }
                }

		if (1===t) {
			if (((ad.ch + ad.dpx[0]) < ad.h) || ((ad.cw + ad.dpx[1]) < ad.w)) {
				ad.ch += ad.dpx[0];
				ad.cw += ad.dpx[1];
			} else {
				ad.ch = ad.h;
				ad.cw = ad.w;
				done = true;
			}
		} else { 
			if (((ad.ch - ad.dpx[0]) > ad.trh) || ((ad.cw - ad.dpx[1]) > ad.trw)) {
				ad.ch -= ad.dpx[0];
				ad.cw -= ad.dpx[1];
			} else {
				ad.ch = ad.trh;
				ad.cw = ad.trw;
				done = true;
			}
		}
		w=ad.cw;
		h=ad.ch;
		if (this.uOF(ad)) { ad.getDiv().style.zIndex = (1===t) ? ad.z : 0; }
		d = this.getC(ad);
		d.style.height = h+'px';
		d.style.width = w+'px';
		if (ad.tracker) {
			if (1===t) {
				ad.tracker.desplegar();
			} else {
				ad.tracker.replegar();
			}
		}
		if (! done) {
			ad.interval = setTimeout(function() { eplDoc.epl.helpers.exp.resize(id,t); }, 50);
		}
	};
}
if (! eplDoc.epl.helpers.exp) {
	eplDoc.epl.helpers.exp = new V4HelperExp();
}
function eplEBExpandLayer(id){eplDoc.epl.helpers.exp.resize(id,1);}
function eplEBShrinkLayer(id){eplDoc.epl.helpers.exp.resize(id,0);}
function eplExpandLayer(id){eplDoc.epl.helpers.exp.resize(id,1);}
function eplShrinkLayer(id){eplDoc.epl.helpers.exp.resize(id,0);}
function eplFPTExpandLayer(id){eplDoc.epl.helpers.exp.resize(id,1);}
function eplFPTShrinkLayer(id){eplDoc.epl.helpers.exp.resize(id,0);}
function eplAMROExpandLayer(id){eplDoc.epl.helpers.exp.resize(id,1);}
function eplAMROShrinkLayer(id){eplDoc.epl.helpers.exp.resize(id,0);}
eplDoc.epl.showByType('exp');
