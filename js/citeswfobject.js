/**
 * @description 视频基础功能
 * @author 猫团儿
 * @date 2013-02-20
 * @version 2.0.0.0
 * @updateTime 2013-02-20
 * @update 2.0.0.0 修改部分功能的比对方式及未添加的分号。
 * @update 2.0.0.1 去除广告技术前端常用脚本库代码 by hongping
 * @update 2.0.0.2 cookie的编解码方法改用encodeURIComponent、decodeURIComponent,by hongping
 * @updateTime 2016-05-05, 播放器结构更新,zhaohp
 */

/*function $(el) {
	if (typeof el == 'string')
		return document.getElementById(el);
	if (typeof el == 'object')
		return el;
	return null;
}*/

var CookieManager = {

	getExpiresDate : function(days, hours, minutes) {
		var ExpiresDate = new Date();
		if (typeof days == "number" && typeof hours == "number" && typeof hours == "number") {
			ExpiresDate.setDate(ExpiresDate.getDate() + parseInt(days));
			ExpiresDate.setHours(ExpiresDate.getHours() + parseInt(hours));
			ExpiresDate.setMinutes(ExpiresDate.getMinutes() + parseInt(minutes));
			return ExpiresDate.toGMTString();
		}
	},

	_getValue : function(offset) {
		var endstr = document.cookie.indexOf(";", offset);
		if (endstr == -1) {
			endstr = document.cookie.length;
		}
		return decodeURIComponent(document.cookie.substring(offset, endstr));
	},

	get : function(name) {
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while (i < clen) {
			var j = i + alen;

			if (document.cookie.substring(i, j) == arg) {
				return this._getValue(j);
			}

			i = document.cookie.indexOf(" ", i) + 1;
			if (i == 0) {
				break;
			}
		}
		return "";
	},

	set : function(name, value, expires, path, domain, secure) {
		document.cookie = name + "=" + encodeURIComponent(value)
				+ ((expires) ? "; expires=" + expires : "")
				+ ((path) ? "; path=" + path : "")
				+ ((domain) ? "; domain=" + domain : "")
				+ ((secure) ? "; secure" : "");
	},

	remove : function(name, path, domain) {
		if (this.get(name)) {
			document.cookie = name + "=" + ((path) ? "; path=" + path : "")
					+ ((domain) ? "; domain=" + domain : "")
					+ "; expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
	},

	clear : function() {
		var cookies = document.cookie.split(';');
		for ( var i = 0; i < cookies.length; i++)
			this.remove(cookies[i].split('=')[0]);
	}
};

function FlashWriter(args) {
	this.params = {};
	this.variables = {};
	this.properties = { url : '', width: 300, height : 225, id : ''};
	for ( var i in args) {
		this.properties[i] = args[i];
	}
}

FlashWriter.prototype = {
	render : function() {
		var html = '';

		if(window.ActiveXObject){
			html='<object  classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" width="'+ this.properties.width +'" height="'+ this.properties.height +'"  id="'+this.properties.id+'">';
			html += '<param name="movie" value="'+this.properties.url+'">';
			html += '<param name="FlashVars" value="'+this.getVariableString()+'">';
			html += this.getParamString(true);
			html += '</object>';
		}else{
			html = '<embed id="'+this.properties.id+'" src="'+this.properties.url+ '" width="'+ this.properties.width +'" height="'+this.properties.height+'" name="'+this.properties.id+'"'+this.getParamString(false)+' FlashVars="'+this.getVariableString()+'"  type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';  
		}
				
        return html;
	},

	addParam : function(name, value) {
		this.params[name] = value;
	},

	addVariable : function(name, value) {
		this.variables[name] = value;
	},

	getVariableString : function() {
		var arr = [];
		for ( var i in this.variables) {
			arr.push(i + "=" + this.variables[i]);
		}
		return arr.join('&');
	},

	getParamString : function(isIE) {
		var arr = [];
		for ( var i in this.params) {
			if (isIE) {
				arr.push('<param name="' + i + '" value="' + this.params[i] + '">');
			} else {
				arr.push(i + "=" + this.params[i]);
			}
		}
		return arr.join(' ');
	},

	write:function(el){
		var o = document.getElementById(el);
		if (o == null) return;

		if (CookieManager.get('userid').length > 0) {
			this.addVariable('uid', CookieManager.get('userid'));
		} else {
			this.addVariable('uid', '');
		}

		if (CookieManager.get('sid').length > 0) {
			this.addVariable('sid', CookieManager.get('sid'));
		} else {
			this.addVariable('sid', '');
		}

		if (CookieManager.get('location').length > 0) {
			this.addVariable('locid', CookieManager.get('location'));
		} else {
			this.addVariable('locid', '');
		}

		var ref = location.href;

		if (ref.length > 0) {
			this.addVariable('pageurl', ref);
		} else {
			this.addVariable('pageurl', '');
		}

		var fls = this.getVersion();

		// 版本小于901 则提示
		if (parseInt(fls[0]) < 10) {
			var otishi = '<div style="!important;margin:50px auto;width:288px;height:163px;border:2px outset #05ABEA;background-color:#eee;">';
			otishi += '<p style="padding:20px;line-height:160%;color:#000;font-size:12px;">请先确认是否安装了 最新Flash 播放器<br/>请点击安装按钮</p>';
			otishi += '<a style="display:block;height:31px;width:115px;line-height:31px;font-size:12px;color:#000;text-decoration:none;text-align:center;margin:10px auto 0 auto;border:2px outset #999;" href="http://get.adobe.com/flashplayer/" target="_blank">安装</a></div>';

			o.style.width = this.properties.width;
			o.style.height = this.properties.height;
			o.innerHTML = otishi;

			// 直播播放器隐藏wmp播放器
			if (document.getElementById('wmpDiv')) {
				document.getElementById('wmpDiv').style.display = "none";
			}

		} else {
			o.innerHTML = this.render();
		}
	},

	getVersion : function() {
		var b=[0,0,0];
		if(navigator.plugins&&navigator.mimeTypes.length){
			var a=navigator.plugins["Shockwave Flash"];
			if(a&&a.description){
				b=a.description.replace(/^\D+/,"").replace(/\s*r/,".").replace(/\s*[a-z]+\d*/,".0").split(".");
			}
		}else{
			if (navigator.userAgent && navigator.userAgent.indexOf("Windows CE") >= 0) {
				var c = 1, f = 3;
				while (c) {
					try {
						f++;
						c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + f);
						b = [ f, 0, 0 ];
					} catch (d) {
						c = null;
					}
				}
			} else {
				try {
					var c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
				} catch (d) {
					try {
						var c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
						b = [ 6, 0, 21 ];
						c.AllowScriptAccess = "always";
					} catch (d) {
						if (b.major == 6) {
							return b;
						}
					}
					try {
						c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
					} catch (d) {
					}
				}
				if (c != null) {
					b = c.GetVariable("$version").split(" ")[1].split(",");
				}
			}
		}
		return b;
	}
};

// flash调用弹窗
function goPage(urlstr) {
	window.open(urlstr);
}