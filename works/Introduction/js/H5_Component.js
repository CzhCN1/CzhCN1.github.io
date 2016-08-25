var H5_Component = function(){


  /*******************************************************
  	基本图文组件对象
   *******************************************************/
  var Base = function(name,config){
  	var cfg = config || {},
  		id = ('c'+Math.random()).replace('.','_'),
  		cls = 'component_'+cfg.type +' name_'+name,
  		component = $('<div class="component '+ cls +'" id=" '+ id +'">');

  	//组件样式
  	cfg.css && component.css(cfg.css);
  	//文字内容
  	cfg.text && component.text(cfg.text);
  	//背景内容
  	cfg.bg && component.css('backgroundImage','url('+cfg.bg+')');
  	//组件宽度，二倍分辨率
  	cfg.width && component.width(cfg.width/2);
  	//组件高度，二倍分辨率
  	cfg.height && component.height(cfg.height/2);

  	if(cfg.center === true){
  		component.css({
  			marginLeft : (cfg.width/4 * -1),
  			left: '50%',
  		});
  	}

  	//如果存在点击事件，则侦听点击事件
  	if(typeof cfg.onclick === 'function'){
  		component.on('click',cfg.onclick);
  	}


  	//上一页所有组件渐隐
  	component.on('onLeave',function(){
  	    component.addClass(cfg.type+'_leave').removeClass(cfg.type+'_load');
  		setTimeout(function(){
  			cfg.animateOut && component.animate(cfg.animateOut);
          },cfg.delayOut || 0);
  		return false;
  	});
  	//当前页所有组件渐显
  	component.on('afterLoad',function(){
  		component.addClass(cfg.type+'_load').removeClass(cfg.type+'_leave');
  		setTimeout(function(){
  			cfg.animateIn && component.animate(cfg.animateIn);
          },cfg.delayIn || 0);
  		return false;
  	});

  	return component;
  };


  /*******************************************************
  	折线图组件对象
   ********************************************************/

  var Polyline = function(name,cfg){
  	var component = new Base(name,cfg);

  	//绘制网格线canvas画布
  	var w = cfg.width - 20,
  		h = cfg.height - 20,

  		canvas = document.createElement('canvas'),
  		ctx = canvas.getContext('2d');
  	canvas.width = cfg.width;
  	canvas.height = cfg.height;
  	component.append(canvas);

  	//网格横线绘制
  	var step = 10;
  	ctx.beginPath();
  	ctx.lineWidth = 2;
  	ctx.strokeStyle = '#AAA';

  	var y;
  	for(var i = 0;i<=step;i++){
  		y = ((h)/step)*i;
  		ctx.moveTo(10,y+10);
  		ctx.lineTo(w+10,y+10);
  	}
  	//网格竖线绘制
  	var x;
  	step = cfg.data.length-1;
  	for(i=0;i<=step;i++){
  		x = ((w)/step)*i;
  		ctx.moveTo(x+10,10);
  		ctx.lineTo(x+10,h+10);
  		//坐标文字添加
  		if(cfg.data[i]){
  			var text = $('<div class="text">');
  			text.text(cfg.data[i][0]);
  			text.css('width',((w)/step)/2)
  				.css('left',x/2+5 - (w)/step/4)
  				.css('-webkit-transition','all 1s '+(1+i*0.2)+'s');
  			component.append(text);
  		}

  	}
  	ctx.stroke();

  	//绘制折线canvas画布
  	canvas = document.createElement('canvas');
  	ctx = canvas.getContext('2d');
  	canvas.width = cfg.width;
  	canvas.height =cfg.height;
  	component.append(canvas);

  	//折线绘制函数
  	//传入参数：per 高度的百分比
  	var drawPolyline = function(per){
  		//清空画布
  		ctx.clearRect(0,0,w+20,h+20);
  		//绘制参数
  		ctx.beginPath();
  		ctx.lineWidth = 5;
  		ctx.strokeStyle = '#FF8878';
  		//画点
  		var item;
  		for(i in cfg.data){
  			item = cfg.data[i];
  			x = (w/(cfg.data.length-1)) * i + 10;
  			y = h*(1 - item[1]*per)+10;
  			ctx.moveTo(x,y);
  			ctx.arc(x,y,5,0,2*Math.PI);
  		}
  		//连线
  		ctx.moveTo(10,h*(1 - cfg.data[0][1]*per)+10);
  		for(i in cfg.data){
  			item = cfg.data[i];
  			x = (w/(cfg.data.length-1)) * i + 10;
  			y = h*(1 - item[1]*per)+10;
  			ctx.lineTo(x,y);
  		}
  		ctx.stroke();
  		//绘制阴影
  		ctx.lineTo(x,h+10);
  		ctx.lineTo(10,h+10);
  		ctx.fillStyle = 'rgba(255,136,118,0.5)';
  		ctx.fill();
  		ctx.strokeStyle = 'rgba(255,136,118,0)';

  		ctx.stroke();
  	};

  	//折线图生长
  	component.on('afterLoad',function(){
  		var  s= 0;
  		for(i=0;i<50;i++){
  			setTimeout(function(){
  				s+=0.02;
  				drawPolyline(s);
  			},i*10+300);
  		}
  	});
  	//折线图退场
  	component.on('onLeave',function(){
  		var  s= 1;
  		for(i=0;i<50;i++){
  			setTimeout(function(){
  				s-=0.02;
  				drawPolyline(s);
  			},i*10);
  		}
  	});

  	return component;
  };


  /*******************************************************
  	雷达图组件对象
   *******************************************************/
  var Pie = function(name,cfg){
  	var component = new Base(name,cfg);

  	//canvas画布
  	var w = cfg.width,
  		h = cfg.height,
  		r = w / 2;

  	//绘制数据层canvas
  	//备用颜色表
  	var colors = ["rgb(249,47,41)","rgb(0,90,141)","rgb(187,30,250)","rgb(146,156,154)","rgb(10,219,185)","rgb(15,170,22)","rgb(241,241,26)"];
  	canvas = document.createElement('canvas');
  	ctx = canvas.getContext('2d');
  	canvas.width = cfg.width;
  	canvas.height = cfg.height;
  	$(canvas).css('zIndex',2);
  	component.append(canvas);

  	var sAngle = 1.5 * Math.PI,		//设置开始角度在12点位置
  		eAngle = 0,					//设置结束角度
  		step = cfg.data.length;		//份数
  	for(var i=0;i<step;i++){
  		var item = cfg.data[i],
  			color = item[2] || (item[2] = colors.pop());
  		eAngle = sAngle + Math.PI * 2 *item[1];

  		ctx.beginPath();
  		ctx.fillStyle = color;
  		ctx.strokeStyle = color;
  		ctx.lineWidth = 1;

  		ctx.moveTo(r,r);
  		ctx.arc(r,r,r-2,sAngle,eAngle);
  		ctx.fill();
  		ctx.stroke();

  		//文本显示位置
  		var	x = r + Math.sin(0.5 * Math.PI - (sAngle+eAngle)/2 ) * r,
  			y = r + Math.cos(0.5 * Math.PI - (sAngle+eAngle)/2 ) * r;

  		sAngle = eAngle;		//保存结束角度

  		//加入项目文本及百分比
  		var text = $('<div class="text">'),
  			per = $('<div class="per">');
  		text.text(cfg.data[i][0]);
  		per.text(cfg.data[i][1]*100+'%');
  		text.append(per);
  		//显示位置修正
  		if(x>w/2){
  			text.css('left',x/2+5);
  		}else{
  			text.css('right',(w-x)/2);
  		}
  		if(y>h/2){
  			text.css('top',y/2-5);
  		}else{
  			text.css('bottom',(h-y)/2);
  		}
  		//文字颜色
  		if(cfg.data[i][2]){
  			text.css('color',cfg.data[i][2]);
  		}
  		text.css('opacity',0);
  		component.append(text);
  	}

  	//加入一个遮罩层canvas
  	canvas = document.createElement('canvas');
  	ctx = canvas.getContext('2d');
  	canvas.width = cfg.width;
  	canvas.height = cfg.height;
  	$(canvas).css('zIndex',3);
  	component.append(canvas);

  	ctx.fillStyle = "#F0F0F0";
  	ctx.strokeStyle = "#F0F0F0";
  	ctx.lineWidth = 1;
  	ctx.arc(r,r,r,0,2*Math.PI);
  	ctx.fill();
  	ctx.stroke();

  	//绘制遮罩层
  	var drawPie = function(per){
  		//清除画布
  		ctx.clearRect(0,0,w,h);

  		ctx.beginPath();
  		ctx.moveTo(r,r);

  		if(per<=0){
  			ctx.arc(r,r,r,0,2*Math.PI);
  			component.find('.text').css('opacity',0);
  		}else{
  			ctx.arc(r,r,r,1.5*Math.PI,1.5*Math.PI+2*Math.PI*per,true);
  		}
  		ctx.fill();
  		ctx.stroke();

  		if(per >= 1){
  			component.find('.text').css('opacity',1);
  		}
  	};

  	//生长动画
  	component.on('afterLoad',function(){
  		var s = 0;
  		for(i=0;i<50;i++){
  			setTimeout(function(){
  				s+=0.02;
  				drawPie(s);
  			},i*10);
  		}
  	});
  	//退场动画
  	component.on('onLeave',function(){
  		var s = 1;
  		for(i=0;i<50;i++){
  			setTimeout(function(){
  				s-=0.02;
  				drawPie(s);
  			},i*10);
  		}
  	});

  	return component;
  };


  /*******************************************************
  	散点图组件对象
   *******************************************************/
  var Point = function(name , cfg){
  	var component = new Base(name,cfg),
  		//以第一个数据为比例大小的100%
  		base = cfg.data[0][1];
  	//输出每个Point
  	$.each(cfg.data,function(index,item){
  		var point = $('<div class="point point_'+index+'">'),
  			pName = $('<div class="pName">'+item[0]+'</div>'),
  			rate = $('<div class="rate">'+item[1]*100+'%</div>');
  		//添加每个散点的内容
  		pName.append(rate);
  		point.append(pName);

  		//计算各点比例大小
  		var per = (item[1]/base*100) + '%';
  		point.width(per).height(per);
  		//按比例调节字体大小
  		pName.css('fontSize',item[1]/base+'em');

  		//为各点添加颜色
  		if(item[2]){
  			point.css('backgroundColor',item[2]);
  		}
  		//各点位置修改 相对基元的x和y偏移
  		if(item[3] !== undefined &&item[4] !== undefined){
  			point.css('left',item[3]).css('top',item[4]);
  			point.data('left',item[3]).data('top',item[4]);//
  		}
  		//  设置zIndex、重设位置
          point.css('zIndex',100-index);
          point.css('left',0).css('top',0);

          point.css('transition','all 1s '+index*0.5 +'s');

  		component.append(point);
  	});

  	 //  onLoad之后取出暂存的left、top 并且附加到 CSS 中
     	component.on('afterLoad',function(){
        	component.find('.point').each(function(idx,item){
          	$(item).css('left',$(item).data('left')).css('top',$(item).data('top'));
        	});
     	});
     	// onLeave之后，还原初始的位置
     	component.on('onLeave',function(){
        	component.find('.point').each(function(idx,item){
          	$(item).css('left',0).css('top',0);
        	});
     	});

     	component.find('.point').on('click',function(){

          component.find('.point').removeClass('point_focus');
          $(this).addClass('point_focus');

          return false;
     	}).eq(0).addClass('point_focus');
  	return component;
  };


  /*******************************************************
  	水平柱图图表组件
   *******************************************************/
  var Bar = function(name , cfg){
  	var component = new Base(name,cfg);
  	$.each(cfg.data,function(index,item){
  		var line = $('<div class ="line">'),	//单柱图
  			name = $('<div class ="name">'),	//柱名
  			rate = $('<div class ="rate">'),	//柱体
  			per = $('<div class ="per">'),		//比例
  			width = item[1]*65 + '%';			//柱体宽度,防止100%超出

  		var bgc = '';
  		if(item[2]){
  			bgc = 'style="background-color:'+item[2]+'"';
  		}
  		rate.html('<div class="bgc" '+bgc+'></div>');	//控制柱体颜色
  		rate.css('width',width);				//设置柱体宽度
  		name.text(item[0]);						//柱名内容
  		per.text(item[1]*100 + '%');			//比例内容
  		//节点添加
  		line.append(name).append(rate).append(per);
  		component.append(line);
  	});
  	return component;
  };


  /*******************************************************
      垂直柱图组件对象
  *******************************************************/
  var Bar_v =function ( name, cfg ) {
    var component =  new Bar( name ,cfg );

    var width = ( 100 / cfg.data.length ) >> 0 ;
    component.find('.line').width( width + '%');

    $.each( component.find('.rate') ,function(){
      var w = $(this).css('width');
      $(this).height(w).width('');
    });

    $.each( component.find('.per'),function(){
      $(this).appendTo( $(this).prev() ) ;
    });

    return component;
  };


  /*******************************************************
  	雷达图组件对象
   *******************************************************/
  var Rader = function(name,cfg){
  	var component = new Base(name,cfg);

  	//绘制背景网格线canvas画布
  	var w = cfg.width,
  		h = cfg.height,

  		canvas = document.createElement('canvas'),
  		ctx = canvas.getContext('2d');

  	canvas.width = cfg.width;
  	canvas.height = cfg.height;
  	component.append(canvas);

  	//圆半径，边数
  	var r = w/2,
  		step = cfg.data.length;

  	//计算一个圆周上坐标

  	//绘制网络背景格
  	var colorFlag = true,
  		counts = 5,	//网络背景层数
  		rad,
  		x,
  		y;
  	for(var s = counts;s>0;s--){
  		ctx.beginPath();
  		for(var i = 0;i < step;i++){
  			rad = (2 * Math.PI / 360) * (360 / step) * i;
  			x = r + Math.sin(rad) * r * (s/counts);
  			y = r + Math.cos(rad) * r * (s/counts);

  			ctx.lineTo(x,y);
  		}
  		ctx.closePath();
  		ctx.fillStyle = colorFlag ? '#99c0ff' : '#f1f9ff';
  		colorFlag = !colorFlag;
  		ctx.fill();
  	}
  	//绘制伞骨
  	var j;
  	for(j = 0;j<step;j++){
  		rad = (2 * Math.PI / 360) * (360 / step) * j;
  		x = r + Math.sin(rad) * r;
  		y = r + Math.cos(rad) * r;
  		ctx.moveTo(r,r);
  		ctx.lineTo(x,y);

  		//输出项目文字
  		var text = $('<div class="text">');
  		text.text(cfg.data[j][0]);

  		if(x > w/2){
  			text.css('left',x/2+3);
  		}else{
  			text.css('right',(w-x)/2+3);
  		}
  		if(y > h/2){
  			text.css('top',y/2+3);
  		}else{
  			text.css('bottom',(h-y)/2+3);
  		}

  		text.css('opacity',0)
  			.css('-webkit-transition','all 0.5s '+(j*0.2)+'s');

  		component.append(text);
  	}
  	ctx.strokeStyle = '#e0e0e0';
  	ctx.stroke();


  	//数据层
  	//折线图生长
  	canvas = document.createElement('canvas');
  	ctx = canvas.getContext('2d');
  	canvas.width = cfg.width;
  	canvas.height = cfg.height;
  	component.append(canvas);
  	//折线颜色
  	ctx.strokeStyle = "#F00";
  	//绘制函数
  	var drawRander = function(per){
  		//清除画布
  		ctx.clearRect(0,0,w,h);
  		if(per >= 1){
  			component.find('.text').css('opacity',1);
  		}else{
  			component.find('.text').css('opacity',0);
  		}
  		//绘制线
  		for(j = 0;j<step;j++){
  			var rate = cfg.data[j][1] * per;

  			rad = (2 * Math.PI / 360) * (360 / step) * j;
  			x = r + Math.sin(rad) * r * rate;
  			y = r + Math.cos(rad) * r * rate;
  			ctx.lineTo(x,y);
  		}
  		ctx.closePath();
  		ctx.stroke();

  		//绘制点
  		ctx.fillStyle = '#ff7676';
  		for(j = 0;j<step;j++){
  			var rate = cfg.data[j][1] * per;
  			rad = (2 * Math.PI / 360) * (360 / step) * j;
  			x = r + Math.sin(rad) * r * rate;
  			y = r + Math.cos(rad) * r * rate;

  			ctx.beginPath();
  			ctx.arc(x,y,5,0,2*Math.PI);
  			ctx.fill();
  			ctx.closePath();
  		}
  	};

  	//生长动画
  	component.on('afterLoad',function(){
  		var s = 0;
  		for(i=0;i<100;i++){
  			setTimeout(function(){
  				s+=0.01;
  				drawRander(s);
  			},i*10);
  		}
  	});
  	//退场动画
  	component.on('onLeave',function(){
  		var s = 1;
  		for(i=0;i<100;i++){
  			setTimeout(function(){
  				s-=0.01;
  				drawRander(s);
  			},i*10);
  		}
  	});

  	return component;
  };


  return{
    Base : Base,
    Polyline : Polyline,
    Pie : Pie,
    Point : Point,
    Bar : Bar,
    Bar_v : Bar_v,
    Rader : Rader,
  };
}();
