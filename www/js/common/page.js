var mm = mm || {};

mm.initPages=function(){
	$("div.pages div.panel[data-include]").each(function(){
		var item=$(this),id=item.attr("id");
		var className=mm.toUpperFirstLetter(id);
		try{
			var classInstance=eval(className);
		}catch(e){
			mm.error("class "+ className + "not found.");
			return true;
		}

		if (!mm.isFunction(classInstance)) return false;

		var obj=new classInstance();
		item.bind('panelload ',obj.load.bind(obj));   //改变执行上下文 变为obj
		item.bind('panelunload', obj.unload.bind(obj));

		item.data("instance",obj);
	});
}


/*  Page对象貌似可以不需要   该对象操作内容不太多  可以放到子类中实现 */
var Page=function(){
	this.isInit=false;
}

//dom加载完后 事件注册一般放在这里   
Page.prototype.init=function(){
	this.isInit=true;
}

//dom加载完后  初始化执行放在这里
Page.prototype.load=function(){
	if(!this.isInit) this.init();

	//动态切换footer和header
	var currentPage=$($.afui.activeDiv);
	var headerId=currentPage.attr("data-header") || "none";
	var footerId=currentPage.attr("data-footer") || "none";
	$(".view > header").not("#"+headerId).hide();
	$(".view").find("#"+headerId).show();
	$(".view > footer").not("#"+footerId).hide();
	$(".view").find("#"+footerId).show();

	var titleArray=['saveMoney','withDrawals','gameTransfer','apply'];
	var pageId=currentPage.attr('id');
	if ($.inArray(pageId,titleArray)!=-1) {
		$('footer').find('a').removeClass('selected');
		$('footer').find('a').filter("[href=#" + pageId +"]").addClass('selected');
	}else{
		$('footer').find('a').removeClass('selected');
	}
}

//子页面跳转后 执行这里  一般清空页面load完后的数据
Page.prototype.unload=function(){

}



