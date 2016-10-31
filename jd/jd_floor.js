function getTop(elem){
		var sum=elem.offsetTop;
		while (elem.offsetParent!=null)
		{
			sum+=elem.offsetParent.offsetTop;
			elem=elem.offsetParent;
		}
		return sum;
	}
window.addEventListener("load",function(){floor.init()});
var floor={
	UPLEVEL:0,//亮灯范围的上线距文档显示区顶部的距离
	DOWNLEVEL:0,//高灯范围的下线距文档显示区顶部的距离
	
	distance:0,//保存本次移动的总距离
	DURATION:1000,//保存本次移动的总事件
	STEPS:100,//保存本次移动的总步数
	moved:0,
	step:0,
	INTERVAL:0,//保存每步移动的时间间隔
	timer:null,//保存本次移动的序号

	init:function(){
		this.INTERVAL=this.DURATION/this.STEPS;
		
		var fHeight=parseFloat(getComputedStyle($("#f1")).height);
		this.UPLEVEL=(window.innerHeight-fHeight)/2;
		this.DOWNLEVEL=this.UPLEVEL+fHeight;
		window.addEventListener("scroll",this.checkLight.bind(this));
		//
		$("#elevator>ul").addEventListener("mouseover",this.showEtitle);
		$("#elevator>ul").addEventListener("mouseout",this.hideEtitle);
		//

		$("#elevator>ul").addEventListener("click",this.move.bind(this));
	},
	move:function(e){//负责准备并启动一个动画
		if (e.target.nodeName=="A")//&&e.target.className=="etitle")
		{
			if (this.timer!=null)
			{
				clearTimeout(this.timer);
				this.timer=null;
				this.moved=0;
			}
			var scrollTop=document.body.scrollTop;//获得当前网页滚动的scrollTop
			var i=parseInt(e.target.parentNode.firstElementChild .innerHTML);//获得目标元素的父元素下的第一个a元素的内容，转为整数保存在变量i中
			var span=$("#f"+i+">header>span");
			var totalTop=getTop(span);//获得span距离页面顶部的距离，保存在totalTop中
			this.distance=totalTop-this.UPLEVEL-scrollTop;
			this.step=this.distance/this.STEPS;
			this.timer=setTimeout(this.moveStep.bind(this),this.INTERVAL);
		}
	},
	moveStep:function(){//移动一步
		window.scrollBy(0,this.step);	
		this.moved++;
		if (this.moved<this.STEPS)
		{
			this.timer=setTimeout(this.moveStep.bind(this),this.INTERVAL);
		}else{
			clearTimeout(this.timer);
			this.timer=null;
			this.moved=0;
		}
	},
	showEtitle:function(e){
		var target=e.target;
		if (target.nodeName=="A")
		{
			target=target.parentNode;
		}
		if (target.nodeName=="LI")
		{//在target下找第1个a,将其隐藏
			target.$("a:first-child").style.display="none";
			target.$("a:first-child+a").style.display="block";

		}
	},
	hideEtitle:function(e){
		var target=e.target;
		if (target.nodeName=="A")
		{
			target=target.parentNode;
		}
		if (target.nodeName=="LI")
		{//在target下找第1个a,将其隐藏
			//获得target下第一个a元素的内容，转为整数，保存在变量i中
			//id为f+i下的header下的span
			//如果span的class不是hover
			var i=parseInt(target.$("a:first-child").innerHTML);
			var span=$("#f"+i+">header>span");
			if (span.className!="hover")
			{
				target.$("a:first-child").style.display="block";
				target.$("a:first-child+a").style.display="none";
			}
			
		}
	},
	checkLight:function(){//检查每个楼层中span的亮/灭状态
		var scrollTop=document.body.scrollTop;
		var spans=$(".floor>header>span");
		for (var i=0;i<spans.length ;i++ )
		{
			var totalTop=getTop(spans[i]);
			var innerTop=totalTop-scrollTop;
			
			//查找id为elevator下的ul下
			var li=$("#elevator>ul>li")[i];
			var a1=li.$("a:first-child");
			var a2=li.$("a:first-child+a");

			if (innerTop>=this.UPLEVEL&&innerTop<=this.DOWNLEVEL)
			{
				spans[i].className="hover";
				a1.style.display="none";
				a2.style.display="block";
			}else{
				spans[i].className="";
				a1.style.display="block";
				a2.style.display="none";
			}
		}
		var lightSpan=$(".floor>header>span.hover");
		$("#elevator").style.display=lightSpan!=null?"block":"none";
	}

}