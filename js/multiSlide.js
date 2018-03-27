/*
container 轮播容器
btnPrevious 上一页按钮
btnNext 下一页按钮
*/
function MultiSlide(container,btnPrevious,btnNext){
	this.Container = container;
	this.PreviousButton = btnPrevious;
	this.NextButton = btnNext;
	this.UlElement = this.Container.find("ul").eq(0);  //轮播的图片列表UL
	this.SlideNum = this.UlElement.find("li").size();  //轮播的图片数量
	this.SlideWidth = this.UlElement.find("li").width() + parseInt(this.UlElement.find("li").css("marginRight"));  //轮播单步长的宽度
	this.Speed = 800;   //轮播速度
	this.isMoveing = false;  //是否正在移动  不移动:false  正在移动:true
	this.SlideIndex = null;  //移动计数  每次next方向+1 prev方向-1  点击OL导航先加上本次移动的step值，等移动完赋值为当前点击的li的index值
	this.screenNum = Math.round(this.Container.width() / this.SlideWidth);
}
MultiSlide.prototype = {
	init:function(){ //初始化
		this.UlElement.css({"width": this.SlideNum * this.SlideWidth + "px"});
		this.SlideIndex = 0;
		this.bind();
	},
	bind: function(){
		var me = this;
		if( me.PreviousButton ){
			me.PreviousButton.bind("click", function(){
				if(me.isMoveing == true || me.SlideIndex == 0){return;}
				me.isMoveing = true;
				me.SlideIndex--;
				me.UlElement.animate({marginLeft:- me.SlideWidth * me.SlideIndex + "px"}, me.Speed, function(){
					me.isMoveing = false;
				});
			});
		}
		if( me.NextButton ){
			me.NextButton.bind("click", function(){
				if(me.isMoveing == true || me.SlideIndex + me.screenNum == me.SlideNum){return;}
				me.isMoveing = true;
				me.SlideIndex++;
				if(me.PreviousButton.css("display") == "none"){
					me.PreviousButton.fadeIn();
				}
				me.UlElement.animate({marginLeft:- me.SlideWidth * me.SlideIndex + "px"}, me.Speed, function(){
					me.isMoveing = false;
					if(me.SlideIndex == me.SlideNum - 2){
						me.NextButton.fadeOut();
					}
				});
			});
		}
	}
};
