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
				component = new Base(name,cfg);
				break;
			case 'polyline':
				component = new Polyline(name,cfg);
				break;
			case 'pie':
				component = new Pie(name,cfg);
				break;
			case 'point':
				component = new Point(name,cfg);
				break;
			case 'bar':
				component = new bar(name,cfg);
				break;
			case 'bar_v':
				component = new Bar_v(name,cfg);
				break;
			case 'rader':
				component = new Rader(name,cfg);
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

	return this;
};