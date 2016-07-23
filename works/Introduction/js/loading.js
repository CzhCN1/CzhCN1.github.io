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