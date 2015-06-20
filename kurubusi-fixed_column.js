(function () {
	
	
	
	var switchArea = function(serchclass, serchtag) {
		var par = document,
				reg = new RegExp('(^| +)' + serchclass + '($| +)'),
				nodeList = [];
		if (serchtag === undefined) {
			serchtag = '*';
		}
		var el = par.getElementsByTagName(serchtag);
		for (var i = 0; i < el.length; i++) {
			if (reg.test(el[i].className)){
				nodeList.push(el[i]);
			}
		}
		return nodeList;
	};
	
	var addReadyFunction = function(func){
		if(document.addEventListener){
			document.addEventListener("DOMContentLoaded" , func , false) ;
		}else if(window.ActiveXObject){
			var ScrollCheck = function(){
				try {
					document.documentElement.doScroll("left");
				} catch(e) {
					setTimeout(ScrollCheck , 1 );
					return;
				} 
				func();
			}
			ScrollCheck();
		}
	};
	
	objtComputedStyle = function (obj, properties) {
		return (document.defaultView.getComputedStyle(obj, '') || obj.currentStyle)[properties];
	};
	
	addEventSet = function(elm,listener,fn){
		try { elm.addEventListener(listener,fn,false);}
		catch(e){ elm.attachEvent("on"+listener,fn);};
	};
	
	bodyContentsHeight = function() {
		var h = Math.max.apply( null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight] ); 
		return h;
	};
	
	uniqueId = function(){
		var randam = Math.floor(Math.random()*1000)
		var date = new Date();
		var time = date.getTime();
		return randam + time.toString();
	}
	
	
	var fixedColumn = function (obj) {
		var obj_group = obj.getAttribute('data-kfc-group');
		this.obj = obj;
		this.cut = (function () {
			var cut;
			if ( obj_group ) {
				var kfc_cuts = switchArea('kfc_cut'),
						re = new RegExp(" ");
				for( var i = 0; i < kfc_cuts.length; i++ ){
					var cut_group = kfc_cuts[i].getAttribute('data-kfc-group');
					if (re.test(cut_group)) {
						var str = cut_group.split(" ");
						for( j = 0; j < str.length; j++ ){
							if ( str[j] === obj_group ) {
								cut = kfc_cuts[i];
							}
						}
					} else if ( cut_group === obj_group ) {
						cut = kfc_cuts[i];
					}
				}
			} else {
				cut = (switchArea('kfc_cut'))[0];
			}
			return cut;
		}());
		
		this.settingObj();
		
		(function(this_) {
			addEventSet(window, 'scroll', function(e){
				this_.justiObj();
			});
			addEventSet(window, 'resize', function(e){
				this_.settingObj();
				this_.justiObj();
			});
		}(this));
		
	};
	
	fixedColumn.prototype.settingObj = function () {
		this.dval = {
			obj_top: (document.documentElement.scrollTop || document.body.scrollTop) + (this.obj.getBoundingClientRect()).top,
			obj_left: (this.obj.getBoundingClientRect()).left,
			cut_top: (document.documentElement.scrollTop || document.body.scrollTop) + (this.cut.getBoundingClientRect()).top,
			obj_margin_top: parseFloat(objtComputedStyle(this.obj, 'marginTop')) || 0,
			obj_margin_left: parseFloat(objtComputedStyle(this.obj, 'marginLeft')) || 0,
			obj_margin_bottom: parseFloat(objtComputedStyle(this.obj, 'marginBottom')) || 0,
			cut_margin_top: parseFloat(objtComputedStyle(this.cut, 'marginTop')) || 0,
			ddisplay: this.obj.style.display || 'block',
			dopacity: this.obj.style.opacity || '1.0',
			dclass: this.obj.getAttribute('class'),
			zindex: (objtComputedStyle(this.cut, 'zIndex') === 'auto') ? 10 : objtComputedStyle(this.cut, 'zIndex') +1,
		};
		var newclass = this.dval.dclass.replace('kfc_obj', '');
		if (!this.shadow) {
			this.shadow = this.obj.cloneNode(true);
		}
		this.shadow.style.display = 'none';
		this.shadow.style.position = 'fixed';
		this.shadow.style.bottom = '15px';
		this.shadow.style.left = ( this.dval.obj_left - this.dval.obj_margin_left ) + 'px';
		this.shadow.setAttribute('class', newclass);
		document.body.appendChild(this.shadow);
	};
	
	fixedColumn.prototype.justiObj = function () {
		var scroll_top = document.documentElement.scrollTop || document.body.scrollTop,
				client_height = document.documentElement.clientHeight || document.body.clientHeight,
				scroll_bottom = client_height + scroll_top;
				rect_obj = this.obj.getBoundingClientRect(),
				obj_top = scroll_top + rect_obj.top,
				obj_height =  parseFloat(objtComputedStyle(this.obj, 'height')),
				rect_shadow = this.shadow.getBoundingClientRect(),
				shadow_top = scroll_top + rect_shadow.top,
				shadow_height =  parseFloat(objtComputedStyle(this.shadow, 'height'));
		
		if ( scroll_bottom >= ( this.dval.obj_top + obj_height ) ) {
			if ( scroll_bottom >= this.dval.cut_top ) {
				this.obj.style.opacity = '0.0';
				this.shadow.style.display = this.dval.ddisplay;
				this.shadow.style.bottom = ( scroll_bottom - this.dval.cut_top ) + this.dval.cut_margin_top + 'px';
			} else {
				this.obj.style.opacity = '0.0';
				this.shadow.style.display = this.dval.ddisplay;
				this.shadow.style.bottom = this.dval.cut_margin_top + 'px';
			}
		} else {
			this.shadow.style.display = 'none';
			this.obj.style.opacity = this.dval.dopacity;
		}
		
		return this;
	};
	
	
	
	addReadyFunction(function(){
		var kfc_obj = switchArea('kfc_obj'),
				kfc_objs = [];
		for( var i = 0; i < kfc_obj.length; i++ ){
			kfc_objs[i] = new fixedColumn(kfc_obj[i]);
		}
	});
	
	
	
}());