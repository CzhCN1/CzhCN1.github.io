/*
	基本图文组件对象
 */
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