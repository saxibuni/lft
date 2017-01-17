var AccountBalance=function () {

	this.init=function(){
		Page.prototype.init.call(this);
		$("#logoName").text($.cookie("MemId"));
	}

	this.load=function(){
		Page.prototype.load.call(this);		
	}	

	this.unload=function(){
		Page.prototype.unload.call(this);
	}



}