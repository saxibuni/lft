var	locale = new mm.Locale();

mm.ready=function(){
	locale.setLocale("chinese",function(){
		var ob = $($.afui.activeDiv).getInstance();
		if(ob) ob.load();
	});

	(function(){
		var hash=location.hash;

		if (hash != "#login" && hash != "" && hash != "#game" && hash != "#promotions" && hash != "#onlineService") {
			if(!$.cookie("SessionId")){
				var i=location.href.indexOf("#");
				location.href=location.href.substr(0,i);
			}else{
			}
		}
		if (!$.cookie("SessionId")) { $(".jurisdiction").hide(); $(".loginItem").show();}
		else { $(".jurisdiction").show(); $(".loginItem").hide(); }

	})();


}



