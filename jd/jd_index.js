/*封装$*/
window.$=HTMLElement.prototype.$=function(selector){
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    return elems.length==0?null:elems.length==1?elems[0]:elems;
}
/*广告图片数组*/
var imgs=[
    {"i":0,"img":"images/index/banner_01.jpg"},
    {"i":1,"img":"images/index/banner_02.jpg"},
    {"i":2,"img":"images/index/banner_03.jpg"},
    {"i":3,"img":"images/index/banner_04.jpg"},
    {"i":4,"img":"images/index/banner_05.jpg"},
];

/*广告图片轮波*/
var slider={
	LIWIDTH:670,
	distance:0,//保存本次移动的总时间
	DURATION:1000,//总时间
	STEPS:100,//总步数
	moved:0,//保存本次移动的步数，控制动画停止
	step:0,//保存每一步的步长
	INTERVAL:0,//保存每一步的时间间隔
	timer:null,//保存当前正在播放的动画的序号，专用于停止
	WAIT:3000,
	autoMove:true,//保存是否可以自动轮播
		init:function(){
		this.INTERVAL=this.DURATION/this.STEPS;
		this.updateView();
		var me=this;//留住this在变量me中
		//为id为idxs的Ul元素绑定鼠标进入事件为function(e){
		//获得id为idxs下
		$("#idxs").addEventListener("mouseover",function(e){
			if (e.target.nodeName=="LI"&&e.target.className!="hover")
			{
				var starti=$("#idxs>.hover").innerHTML;
				var endi=e.target.innerHTML;
				me.move(endi-starti);
			}
		});
		//为id为slider的div绑定鼠标进入事件
				$("#slider").addEventListener("mouseover",function(){ 
					me.canAuto=false;
				});
				 //为id为slider的div绑定鼠标移出事件
				$("#slider").addEventListener("mouseout",function(){
				  me.canAuto=true;
				});
		 this.autoMove();//启动自动轮播
	},
		autoMove:function(){//自动轮播
			var me=this;
			this.timer=setTimeout(function(){
				if (me.canAuto)
				{
					me.move(1)
				}else{
					me.autoMove();	
				}
			},this.WAIT);
	
		},
		move:function(n){//将imgs的Ul左移或右移n个
			if (this.timer!=null)//有动画正在运行，就清除动画
			{
				clearTimeout(this.timer);
				this.timer=null;
				this.moved=0;
				$("#imgs").style.left="";
			}
			//计算distance为N*LIWIDTH
			//计算步长
			//启动一次性定时器，设置任务函数为movestep，提前绑定this和n,同时设置时间间隔为INTERVAL,将序号保存在timer中
			this.distance=n*this.LIWIDTH;
			this.step=this.distance/this.STEPS;

			if (n<0)
			{
				var dels=imgs.splice(imgs.length+n,-n);
				
				Array.prototype.unshift.apply(imgs,dels);
				$("#imgs").style.left=n*this.LIWIDTH+"px";
				this.updateView();

			}

			this.timer=setTimeout(this.moveStep.bind(this,n),this.INTERVAL);
		},
		moveStep:function(n){//让imgs的ul移动一步
			//获得id为imgs的ul计算后的样式的left属性，转为浮点数保存在变量left中
			//让left-step
			//设置Id为imgs的ul的left属性值为left
			//将moved+1
			//如果moved<STEPS
				//启动一次性定时器，设置任务函数为moveStep，提前绑定this，同时设置时间间隔为INTERVAL,将序号保存在timer中
				//否则
					//停止定时器，并设置timer为Null,moved归零
					//从imgs数组开头位置删除n个元素，保存在dels中
					//将dels中每个元素，再拼接到imgs结尾，还存回imgs
					//更新界面
			var left=parseFloat(getComputedStyle($("#imgs")).left);
			$("#imgs").style.left=left-this.step+"px";
			this.moved+=1;
			if (this.moved<this.STEPS)
			{
				this.timer=setTimeout(this.moveStep.bind(this,n),this.INTERVAL);
			}else{
				clearTimeout(this.timer);
				this.timer=null;
				this.moved=0;
				if(n>0){
				var dels=imgs.splice(0,n);
				//imgs=imgs.concat(dels);
				Array.prototype.push.apply(imgs,dels);
				this.updateView();
				
				}
				$("#imgs").style.left="";
				
				//再次启动一次性定时器，开始自动轮播
				this.autoMove();//this.timer=setTimeout(this.move.bind(this,1),this.WAIT);
			}
		},


		updateView:function(){//将img数组中的图片，更新到页面
		//找到id为imgs的ul,设置其宽为imgs的元素个数*LIWIDTH
		//遍历imgs数组中的每个图片，同时声明空字符串strImg和strIdx
		//在strImg中拼接：<li><img src="+当前图片对象的img属性+“></li>
		//在strIdx中拼接：<li>+(i+1)+</li>
		//遍历结束
		//找到id为imgs的ul,设置其内容为strImg
		//找到id为idxs的ul,设置其内容为strImg
		//找到id为idxs的ul下所有li,设置下标和imgs数组第一个元素的i属性一致的li的class为“hover”
		$("#imgs").style.width=imgs.length*this.LIWIDTH+"px";
		for (var i=0,strImg="",strIdx="";i<imgs.length ;i++ )
		{
			strImg+='<li><img src="'+imgs[i].img+'"></li>';
			strIdx+="<li>"+(i+1)+"</li>"

		}
		$("#imgs").innerHTML=strImg;
		$("#idxs").innerHTML=strIdx;
		$("#idxs>li")[imgs[0].i].className="hover";


	}

}
//为window绑定load事件：
window.addEventListener("load",function(){slider.init()});