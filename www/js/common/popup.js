var mm = mm || {};
mm.popup = {
	showMessage: function(message, title, onDone){
		if($(".afPopup").size() > 0) return ;
	
		//title = title || locale.getString("MSG_PROMPT");
		$.afui.popup({
				title: " ",
				message: message,
				cancelText: locale.getString("MSG_OK"),
				cancelOnly: true,
				cancelCallback: function(){
					if (message=="用户信息过期，请重新登录") {
						$.removeCookie("SessionId");
						$.removeCookie("MemId");
						$.removeCookie("MemName");
						$(".jurisdiction").hide();
						$(".loginItem").show();
						
						$.afui.loadContent("#login");
					}else{
						if (onDone) onDone();
					}
				}
			});	
		//this.resize();
	},
	
	showConfirm: function(message, title, onDone, onCancel){
		//title = title || locale.getString("MSG_PROMPT");
		var self = this;
		var fn = function(){
			$.afui.popup({
				title: " ",
				message: message,
				cancelText: locale.getString("MSG_CANCEL"),
				doneText: locale.getString("MSG_OK"),
				doneCallback: onDone,
				cancelCallback : onCancel || function(){},
				cancelOnly: false
			});
			//self.resize();
		};
		
		setTimeout(fn, 50);
	},
	
	resize: function(){
		if(browser.iphone && browser.safari && !browser.qqbrowser){
			var h = $(window).height();
			var _h = $("#mask").height();
			$("#mask").height(h).css("top", (_h - h) + "px");
		}
	}
};