//Create by dengxiaoli，2014/6/20
function focusSlide(container){
	this.slideList = container.find("ul");//需要显示的图片列表
	this.thumb = container.find("ol");//需要点击的列表
	this.preButton = null;//前一个按钮
	this.nextButton = null;//后一个按钮
	this.ispreNextShow = false;//是否显示前进后退按钮
	this.interval = 4000;
	this.speed = 1000;
	this.currentIdx = null;
	this.curInterval = null;
	this.isLoadImg = null;
	this.pagesAll = null;
	this.pagesCurrent = null;
}
focusSlide.prototype = {	
	init: function(){
		this.currentIdx = 0;
		this.isLoadImg = [];
		if(this.pagesAll){
			this.pagesAll.html(this.slideList.children().length);
		}
		if(this.pagesCurrent){
			this.pagesCurrent.html(this.currentIdx+1);
		}
		if( this.ispreNextShow == false ){
			
			if( this.preButton ) {
				this.preButton.hide();
			}
			if( this.nextButton ) {
				this.nextButton.hide();
			}
		}
		for(var i=0; i<this.slideList.children().length; i++){
			this.isLoadImg[i] = true;//将需要显示的图片个数存入数组
		}
		this.creatThumb();
		// this.autoSlide();
		this.bind();
	},	
	//创建点击列表（如果页面没有就根据需要显示的图片数创建li）	
	creatThumb: function(){
		if( this.thumb.children().length == 0 ){
			var thumb_html = "";
			for(var i=0; i<this.slideList.children().length; i++){
				thumb_html += "<li>" + (i + 1) + "</li>";
			}
			this.thumb.html(thumb_html);
		}
		//给第一个li添加current属性
		this.thumb.children().eq(this.currentIdx).addClass("current");
	},
	loadImg: function(idx){
		if( this.isLoadImg[idx] ){
			var img = this.slideList.children().eq(idx).find("img");
			var src_original = img.attr("src_original");
			img.attr("src",src_original);
			this.isLoadImg[idx] = false;
		}
	},
	//根据传入的点击li的索引,给当前li添加current属性，并找到他的所有兄弟移除current属性
	setCurrent: function(currentIdx){
		this.thumb.children().eq(currentIdx).addClass("current").siblings().removeClass("current");
		this.loadImg(currentIdx);
		this.slideList.children().hide().css({"filter":"alpha(opacity=0)","opacity":0});
		this.slideList.children().eq(currentIdx).show().animate({"filter":"alpha(opacity=100)","opacity":1}, this.speed);
		if(this.pagesCurrent){
			this.pagesCurrent.html(this.currentIdx+1);
		}
	},
	bind: function(){
		var me = this;
		if( me.preButton ){
			me.preButton.on("click", function(){
				clearInterval(me.curInterval);
				me.prev();
				// me.autoSlide();
			});
		}
		if( me.nextButton ){
			me.nextButton.on("click", function(){
				clearInterval(me.curInterval);
				me.next();
				// me.autoSlide();
			});
		}
		me.thumb.on("click", 'li',function(e){
			
			me.currentIdx = $(this).index();
			me.setCurrent(me.currentIdx);
			// me.autoSlide();
		});
		if( me.ispreNextShow == false){
			me.slideList.parent().on("mouseover", function(){
				if( me.preButton ){
					me.preButton.show();
				}
				if( me.nextButton ){
					me.nextButton.show();
				}
			});
			me.slideList.parent().on("mouseout", function(){
				if( me.preButton ){
					me.preButton.hide();
				}
				if( me.nextButton ){
					me.nextButton.hide();
				}
			});
		}
	},
	prev: function(){
		this.currentIdx--;
		if( this.currentIdx < 0 ) this.currentIdx = this.slideList.children().length - 1;
		this.setCurrent(this.currentIdx);
	},
	next: function(){
		this.currentIdx++;
		if( this.currentIdx >= this.slideList.children().length ) this.currentIdx = 0;
		this.setCurrent(this.currentIdx);
	},
	autoSlide: function(){
		var me = this;
		me.curInterval = setInterval(function(){
			me.currentIdx++;
			if( me.currentIdx >= me.slideList.children().length ) me.currentIdx = 0;
			me.setCurrent(me.currentIdx);
		},me.interval);
	}
};