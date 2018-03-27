var picSlide = {
        navContainer: null,
        navULElement: null,
        navLiElement: null,
        navPrev: null,
        navNext: null,
        slideLen: null,
        slideScreenLen: 5,
        slideWidth: null,
        slideIndex: null,
        slideSpeed: 500,
        isNavSliding: false,//列表移动开关：false不移动，true正在移动
        init: function(idx){
            var me = this;
            this.navContainer = $(".invitedGuests");
            this.navPrev = this.navContainer.find("#invitedGuests_prev").eq(0);
            this.navNext = this.navContainer.find("#invitedGuests_next").eq(0);
            this.navULElement = this.navContainer.find("ul").eq(0);
            this.navLiElement = this.navULElement.find("li");
            this.slideLen = this.navLiElement.length;
            this.slideWidth = parseInt(this.navLiElement.eq(0).width()) + parseInt(this.navLiElement.eq(0).css("marginRight"));
            this.slideIndex = idx || 2;
            this.navULElement.css({"width": this.slideWidth * this.slideLen + "px"});
            this.navLiElement.each(function(idx,ele){
                if(idx == 0){
                    $(ele).addClass('first');
                }else if(idx == me.slideLen-1){
                    $(ele).addClass('last');
                }
                
            });
            this.bind();
            this.navSlide();
            
        },
        imgResizeInit: function(){
            var me = this;
            var img0 = new Image();
            img0.src = me.bigImg.attr("src");
            var timer0 = setInterval(function(){
                if(img0.complete) {
                    clearInterval(timer0);
                    me.imgResize(img0.width,img0.height);
                    img0 = null;
                }
            }, 50)
        },
        bind: function(){
            var me = this;
            me.navULElement.on("click", function(e){
                var tgt = e.target;
                console.log(tgt.tagName);
                if(tgt.tagName == "LI" || tgt.tagName == "IMG"){
                    if(me.isNavSliding == false){   
                        me.isNavSlideing = true;
                        me.slideIndex = $(e.target).parents("li").index();
                        me.navSlide();
                    }
                }
            });
            me.navPrev.on("click", function(){
                if(me.slideIndex == 0){
                    return;
                }
                if(me.isNavSliding == false){   
                    me.isNavSlideing = true;
                    me.slideIndex --;
                    me.navSlide();
                }
            });
            me.navNext.on("click", function(){              
                if(me.slideIndex == me.slideLen - 1){
                    return;
                }
                if(me.isNavSliding == false){ 
                    me.isNavSlideing = true;
                    me.slideIndex ++;
                    me.navSlide();
                }
            });
        },
        navSlide: function(){//列表移动，两端不动，列表中段移动到中间位置
            var me = this;
            me.navLiElement.eq(me.slideIndex).addClass('active').siblings().removeClass('active');

            if(me.slideLen <= me.slideScreenLen){
                me.navULElement.css({"marginLeft":  "0px"});
            }else{
                if(me.slideIndex < 2){//列表前端(0,1)
                    me.navULElement.animate({"marginLeft":  "0px"}, me.slideSpeed,function(){
                        me.isNavSliding = false;
                    });
                }else if(me.slideIndex >= 2 && me.slideIndex < me.slideLen - 2){//列表中端
                    me.navULElement.animate({"marginLeft": - me.slideWidth * (me.slideIndex - 2) + "px"}, me.slideSpeed, function(){
                        me.isNavSliding = false;
                    });
                }else{//列表末端(len-3,len-2,len-1)
                    me.navULElement.animate({"marginLeft": - me.slideWidth * (me.slideLen - me.slideScreenLen) +"px"}, me.slideSpeed,function(){
                        me.isNavSliding = false;
                    });
                }
            }

               
        }
    };