var mm = mm || {};
mm.Locale = function(){
	var that = this;
	var curLocale;
	var dic;
	var pathMap = {};
	pathMap[mm.Locale.CHINESE] = "locale/zh_CN.json";

	mm.Locale.it = this;
	this.setLocale = function(lan, cb){
		if(lan === curLocale){
			if(mm.isFunction(cb)) cb();
			return ;
		} 
	
		switch(lan){
			case mm.Locale.CHINESE:
				curLocale = mm.Locale.CHINESE;
				break;				
			default:
				curLocale = mm.Locale.CHINESE;
		}
		
		$.getJSON(pathMap[curLocale],{}, function(data){
			dic = data;
			that.initUi();
			if(mm.isFunction(cb)) cb();
		});
	};
	
	this.getLocale = function(lan){
		return curLocale || mm.Locale.CHINESE;
	};
	
	this.initUi = function(target){
		var target = target || $(document);
		target = $.is$(target) ? target : $(target);
		
		target.filter("[key]").add(target.find("[key]")).each(function(){
			var key = $(this).attr("key");
			var params = $(this).attr("params");
			var value = dic[key] || "";
			if(typeof params === "string"){
				params = params.split(",");
				for(var i = 0; i < params.length; i++){
					value = value.replace(new RegExp("({)" + i + "(})", "g"), that.getString(params[i]));
				}
			}
			
			$(this).html(value);
		});
	};
	
	this.init = function(cb){
		this.setLocale(mm.Locale.CHINESE, cb);
	};
	
	this.getString = function(key){
		if(!dic) return "";
	
		var value = dic[key] || key;
		
		if(arguments.length > 1){
			for(var i = 1; i < arguments.length; i++){
				value = value.replace(new RegExp("({)" + (i - 1) + "(})", "g"), this.getString(arguments[i]));
			}
		}
		return value;
	};
};

mm.Locale.CHINESE = "chinese";

//extend
$.fn.initLocale = function(){
	if( 0 === this.length) return this;
	for(var i = 0; i < this.length; i++){
		mm.Locale.it.initUi(this);
	}
	return this;
};