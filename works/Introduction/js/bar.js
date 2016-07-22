/*
	柱图图表组件
 */
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