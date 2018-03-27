/*
container 轮播容器的ID
btnPrevious 上一页按钮ID
btnNext 下一页按钮ID
*/
function FocusMoveSlide(container,btnPrevious,btnNext){
	this.Container = jQuery(container);
	this.PreviousButton = jQuery(btnPrevious);
	this.NextButton = jQuery(btnNext);
	this.UlElement = this.Container.find("ul").eq(0);  //轮播的图片列表UL
	this.OlElement = this.Container.find("ol").eq(0);  //轮播导航菜单OL
	this.SlideNum = this.UlElement.find("li").size();  //轮播的图片数量
	this.SlideWidth = this.UlElement.find("li").width() + parseInt(this.UlElement.find("li").css("marginRight"));  //轮播单步长的宽度
	this.autoSlide = false; //自动播放
	this.autoSlideEv = null;
	this.Speed = 800;   //轮播速度
	this.DelayTime = 4000;   //轮播停顿时间
	this.isMoveing = false;  //是否正在移动  不移动:false  正在移动:true
	this.Dir = true;  //移动的方向  next方向:true  prev方向:false
	this.SlideIndex = 0;  //移动计数  每次next方向+1 prev方向-1  点击OL导航先加上本次移动的step值，等移动完赋值为当前点击的li的index值
}
FocusMoveSlide.prototype = {
	init:function(){ //初始化
		this.UlElement.css({"width": this.SlideNum * this.SlideWidth + "px"});
		this.creatMenu();
		if( this.autoSlide ){
			this.AutoSlide();
		}
		this.bind();
	},
	bind: function(){
		var me = this;
		if( me.PreviousButton ){
			me.PreviousButton.bind("click", function(){
				if(me.isMoveing == true){return;}
				me.isMoveing = true;
				if( me.autoSlideEv ){
					clearInterval(me.autoSlideEv);
				}
				me.Dir = false;
				me.slide();
				if( me.autoSlide ){
					me.reAutoSlide();
				}
			});
		}
		if( me.NextButton ){
			me.NextButton.bind("click", function(){
				if(me.isMoveing == true){return;}
				me.isMoveing = true;
				if( me.autoSlideEv ){
					clearInterval(me.autoSlideEv);
				}
				me.Dir = true;
				me.slide();
				if( me.autoSlide ){
					me.reAutoSlide();
				}
			});
		}
		me.OlElement.bind("click", function(e){
			if(e.target.tagName == "LI"){
				if(me.isMoveing == true){return;}
				me.isMoveing = true;
				if( me.autoSlideEv ){
					clearInterval(me.autoSlideEv);
				}
				me.pageSlide(parseInt(jQuery(e.target).text()));
				if( me.autoSlide ){
					me.reAutoSlide();
				}
			}
		});
		me.UlElement.parent().bind("mouseover", function(){
			if( me.autoSlideEv ){
				clearInterval(me.autoSlideEv);
			}
			// me.isMoveing = false;
		});
		me.UlElement.parent().bind("mouseout", function(){
			if( me.autoSlide ){
				me.reAutoSlide();
			}
		});
	},
	reAutoSlide: function(){//恢复自动轮播
		if( this.autoSlideEv ){
			clearInterval(this.autoSlideEv);
		}
		this.AutoSlide();
	},
	AutoSlide:function(){  //自动轮播
		var me = this;
		this.autoSlideEv = setInterval(function(){
			if(me.isMoveing == true){return;}
			me.isMoveing = true;
			me.Dir = true;
			me.slide();
		}, me.DelayTime);
	},
	slide:function(){   //单步长移动
		var me = this;
		if (me.SlideNum < 2) return;
		var SlideLiElements = me.UlElement.find("li");
		if(me.Dir == true){
			me.SlideIndex++;
			me.setCurrent();
			me.UlElement.stop().animate({marginLeft:- me.SlideWidth + "px"}, me.Speed, function(){
				SlideLiElements.first().appendTo(me.UlElement);
				me.UlElement.css("marginLeft",0);
				me.isMoveing = false;
			});
		}else{
			me.SlideIndex--;
			me.setCurrent();
			SlideLiElements.last().prependTo(me.UlElement);
			me.UlElement.css("marginLeft",- me.SlideWidth + "px");
			me.UlElement.stop().animate({marginLeft:"0px"}, me.Speed, function(){
				me.isMoveing = false;
			});
		}
	},
	pageSlide:function(index){   //多步长移动
		var me = this;
		if (me.SlideNum < 2) return;
		var SlideLiElements = me.UlElement.find("li");
		var SlideIndex_Current = (me.SlideIndex) % me.SlideNum;
		var SlideStep = index - SlideIndex_Current;
		var SlideStep_Width = SlideStep * me.SlideWidth;
		var SlideLiElements_Tmp = SlideLiElements.clone();
		me.SlideIndex = me.SlideIndex + SlideStep;
		me.setCurrent();
		if(SlideStep > 0){
			me.UlElement.append(SlideLiElements_Tmp);
			me.UlElement.stop().animate({marginLeft:- SlideStep_Width + "px"}, me.Speed, function(){
				SlideLiElements.slice(0,SlideStep).appendTo(me.UlElement);
				SlideLiElements_Tmp.remove();
				me.UlElement.css("marginLeft",0);
				me.SlideIndex = index;
				me.isMoveing = false;
			});
		}else{
			me.UlElement.prepend(SlideLiElements_Tmp);
			SlideLiElements.slice(me.SlideNum+SlideStep).prependTo(me.UlElement);
			me.UlElement.css("marginLeft",SlideStep_Width+"px");
			me.UlElement.stop().animate({marginLeft:"0px"},me.Speed,function(){
				SlideLiElements_Tmp.remove();
				me.SlideIndex = index;
				me.isMoveing = false;
			});
		}
	},
	setCurrent:function(){  //设置轮播导航的当前状态样式
		var SlideIndex_Current = (this.SlideIndex)%this.SlideNum;
		this.OlElement.find("li").eq(SlideIndex_Current).siblings().removeClass("current");
		this.OlElement.find("li").eq(SlideIndex_Current).addClass("current");
	},
	creatMenu:function(){  //创建轮播导航的ol内容 设置第一个li为当前状态 设置导航的点击事件
		for(var i=0; i<this.SlideNum; i++){
			var OlElement_Html = "<li>" + i + "</li>";
			this.OlElement.append(OlElement_Html);
		}
		this.OlElement.find("li").eq(0).siblings().removeClass("current");
		this.OlElement.find("li").eq(0).addClass("current");
	}
};