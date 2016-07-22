/*
	雷达图组件对象
 */
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