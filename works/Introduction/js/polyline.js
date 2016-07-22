/*
	折线图组件对象
 */
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
		//写数据
	/*	for(i in cfg.data){
			item = cfg.data[i];
			x = (w/(cfg.data.length-1)) * i + 10;
			y = h*(1 - item[1])+10;
			ctx.moveTo(x,y);
			ctx.fillText((item[1]*100>>0)+'%',x+10,y+10);
		}*/
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