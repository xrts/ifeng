jQuery('.interview li').on('click',function(){
    var vid = jQuery(this).attr('vid');
    if(!(vid =='' || typeof(vid) == 'undefined' || vid == null)){
        showPop(vid);
    }

})
jQuery('.close').click(function(){
    jQuery('#videoPlay1').html('');
    jQuery('.overlay,.pop-video').fadeOut();
})
function showPop(vid){
    videoPlay('videoPlay1',vid,800,450,true);
    jQuery('.pop-video').css('top',(jQuery(window).height()-450)/2);
    jQuery('.overlay,.pop-video').fadeIn();
}
function videoPlay(id,guid,w,h,autoplay, adplay) {
    if (navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("Android") != -1) // ipad,iphone,android
    {
        var url = "http://dyn.v.ifeng.com/cmpp/video_msg_ipad.js?msg=" + guid + "&callback=showhtml5video&param=playermsg";
        getScript_cds(url, showhtml5video);
    } else {
        var _sitedomain = window.location.href;
        var fo = new FlashWriter({
            url : 'http://vxml.ifengimg.com/swf/zuhe/zuhePlayer_v1.0.41.swf',/*http://img.ifeng.com/swf/zuheVplayer_v5.0.11.swf*/
            width : w,
            height : h,
            id : 'fplay'
        });
        fo.addVariable('guid', guid);
        fo.addVariable('from', _sitedomain);
        fo.addVariable('playerName', "VZHPlayer");
        fo.addVariable('adType', "1");

        if ( typeof (autoplay) != "undefined")
            fo.addVariable('AutoPlay', autoplay);
        else
            fo.addVariable('AutoPlay', 'false');

        if ( typeof (adplay) != "undefined")
            fo.addVariable('ADPlay', adplay);
        else
            fo.addVariable('ADPlay', 'true');
        fo.addVariable('writeby', 'webjs');
        //涓轰簡鍏煎浠ュ墠鐨勭粍鍚堜紶鎾〉闈€傚鏋渟ource=webjs锛岃〃绀烘槸js娓叉煋鎾斁鍣紝姝ゆ椂鍒嗕韩鍔熻兘鐩存帴璋冪敤鑴氭湰鏂规硶锛涘惁鍒欒皟鐢╯wf鑷韩鐨勫垎浜柟娉�
        fo.addVariable('clickPlay', 'true');
        fo.addVariable('subject', '2013addzzzt');
        fo.addVariable('width', w);
        fo.addVariable('height', h);
        fo.addParam('allowFullScreen', 'true');
        fo.addParam('wmode', 'transparent');
        fo.addVariable('canShare', 'true');
        fo.addVariable('ADOrderFirst', '1');//椤甸潰鎵撳紑灏辨挱鏀惧箍鍛�
        fo.addVariable('adType', '1');//琛ㄧず鏄祫璁唴椤�
        fo.addParam('allowScriptAccess', 'always');
        fo.write(id);
    }
}
function showhtml5video(playermsg) {
    if (typeof(playermsg) != "undefined") {
        var nextvideo =1;
        var strvideo = '';
        strvideo = '<video  src="' + playermsg.videoplayurl + '" width=" 800" height="500" controls  id="player" onplay="SendHTML5VideoInfo();"/>';
        document.getElementById('videoPlay1').innerHTML = strvideo;
        document.getElementById('player').load();
        document.getElementById('player').play();
    }
}
function getScript_cds(src, callback) {
    var head = document.getElementsByTagName("head")[0];
    var js = document.createElement("script");
    js.setAttribute("src", src);
    js.onload = js.onreadystatechange = function() {
        if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
            head.removeChild(js);
            if (callback)
                callback();
        }
    }
    head.appendChild(js);
}
function SendHTML5VideoInfo() {
    var sendRequest = function(params) {
        if (typeof params !== 'undefined') {
            // 鍚堝苟瀵硅薄銆�
            var _merge = function(s, t) {
                var result = {};

                if (!t) {
                    return result;
                }

                for (var i in s) {
                    result[i] = typeof t[i] !== "undefined" ? t[i] : s[i];
                }

                return result;
            };

            var url = 'http://stadig.ifeng.com/media.js';
            var data = _merge({
                id: '',
                sid: '',
                uid: '',
                from: 'HTML5',
                provider: 'd5f1032b-fe8b-4fbf-ab6b-601caa9480eb',
                loc: '', //绌�
                cat: '',
                se: '',
                ptype: '',
                vid: 'HTML5Player',
                ref: '', //鍩熷悕
                tm: '' //鏃堕棿鎴�
            }, params);

            pArr = [];
            for (var i in data) {
                pArr.push(i + '=' + encodeURIComponent(data[i]));
            }
            var scriptDom = document.createElement('script');
            url = (pArr.length > 0) ? url + '?' + pArr.join('&') : url;
            scriptDom.src = url;
            document.getElementsByTagName("head").item(0).appendChild(scriptDom);
        }
    };

    var getCookie = function(name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg) {
                return (function(offset) {
                    var endstr = document.cookie.indexOf(";", offset);
                    if (endstr == -1) {
                        endstr = document.cookie.length;
                    }
                    return decodeURIComponent(document.cookie.substring(offset, endstr));
                })(j);
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return "";
    };
    if (this.curGuid !== this.remGuid) {
        this.remGuid = this.curGuid;
        var params = {};
        params.id = playermsg.videoid;
        params.sid = getCookie('sid');
        params.uid = getCookie('userid');
        var cid = playermsg.categoryId ? playermsg.categoryId : '';
        var cname = playermsg.columnName;
        params.cat = cid
        params.se = typeof cname !== 'undefined' ? cname : cid;
        params.ptype = cid.substr(0, 4);
        params.ref = window.location.href.replace(/#/g, '$');
        params.tm = new Date().getTime();
        sendRequest(params);
    }
}