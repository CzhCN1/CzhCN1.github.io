/*
	内容管理对象
 */
var H5 = function(){
	this.id = ('h5_'+Math.random()).replace('.','_');
	this.ele = $('<div class="h5" id="'+this.id+'">').hide();
	$('body').append(this.ele);

	/**
	 * 新增一个H5页面
	 * @param {string} name 页面名
	 * @return {this} 返回该h5对象
	 */
	this.addPage = function(name){
		var page =$('<div class="h5_page section">');
		if(name !== undefined){
			page.addClass('h5_page_'+name);
		}
		this.ele.append(page);

		//记录当前页的对象
		this.page = page;
		return this;
	};

	/**
	 * 为H5页面新增一个组件
	 * @param {string} name   组件名
	 * @param {object} config 配置参数对象
	 * @return {this} 返回H5对象
	 */
	this.addComponent = function(name,config){
		var cfg = config || {};
		//extend 如果参数重复，后面覆盖之前
		cfg = $.extend({type:'base'},cfg);

		var component,			//保存组件元素
			page = this.page;	//获取当前页对象
		switch(cfg.type){
			case 'base':
				component = new H5_Component.Base(name,cfg);
				break;
			case 'polyline':
				component = new H5_Component.Polyline(name,cfg);
				break;
			case 'pie':
				component = new H5_Component.Pie(name,cfg);
				break;
			case 'point':
				component = new H5_Component.Point(name,cfg);
				break;
			case 'bar':
				component = new H5_Component.Bar(name,cfg);
				break;
			case 'bar_v':
				component = new H5_Component.Bar_v(name,cfg);
				break;
			case 'rader':
				component = new H5_Component.Rader(name,cfg);
				break;
			default:
		}
		page.append(component);
		return this;
	};

	/**
	 * H5对象显示
	 * 出入参数firstPage: 从第几页开始显示
	 */
	this.loader = function(firstPage){
		//fullpage样式
		this.ele.fullpage({
			onLeave : function(index,nextIndex,direction){
				//上一页离开事件
				$(this).find('.component').trigger('onLeave');
			},
			afterLoad : function(anchorLink,index){
				//当前页载入事件
				$(this).find('.component').trigger('afterLoad');
			}
		});
		this.ele.show();		//页面显示

		if(firstPage){
			$.fn.fullpage.moveTo(firstPage);
		}
	};
	//是否是第一次调用该函数
	//如果是第一次，执行H5_loading函数
	this.loader = (typeof H5_loading == 'function') ? H5_loading : this.loader;
	return this;
};


/**
 * [H5_loading description]
 * @param {[type]} images    [description]
 * @param {[type]} firstPage [description]
 */
var H5_loading = function(images,firstPage){
	//读取图片资源
	var id = this.id;
	if(this._images === undefined){	//第一次进入
		this._images = (images || []).length;	//需要加载图片数
		this._loaded = 0;						//已加载图片数

		window[id] = this;

		for(var i = 0;i<images.length;i++){
			var img = new Image();
			img.onload = function(){
				window[id].loader();
			};
			img.src = images[i];
		}
		$('.loadingRate').text('0%');
		return this;
	}else{
		this._loaded++;
		$('.loadingRate').text( ( (this._loaded / this._images * 100) >> 0) + '%');
		if(this._loaded < this._images){
			return this;
		}
	}
	window[id] = null;

	//fullpage样式
	this.ele.fullpage({
		onLeave : function(index,nextIndex,direction){
			//上一页离开事件
			$(this).find('.component').trigger('onLeave');
		},
		afterLoad : function(anchorLink,index){
			//当前页载入事件
			$(this).find('.component').trigger('afterLoad');
		}
	});
	this.ele.show();		//页面显示

	if(firstPage){
		$.fn.fullpage.moveTo(firstPage);
	}
};
