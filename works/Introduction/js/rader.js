/*
	雷达图组件对象
 */
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