/*
	散点图组件对象
 */
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
		//  任务二：设置zIndex、重设位置
        point.css('zIndex',100-index);
        point.css('left',0).css('top',0);

        point.css('transition','all 1s '+index*0.5 +'s');

		component.append(point);
	});

	 //  任务三：onLoad之后取出暂存的left、top 并且附加到 CSS 中
   	component.on('afterLoad',function(){
      	component.find('.point').each(function(idx,item){
        	$(item).css('left',$(item).data('left')).css('top',$(item).data('top'));
      	});
   	});
   	// 任务 四：onLeave之后，还原初始的位置
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