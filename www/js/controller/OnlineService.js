var OnlineService=function () {
	
	this.init=function(){
		Page.prototype.init.call(this);

		$("#onlineServiceLink").click(function(){
			window.open('http://v1.live800.com/live800/chatClient/chatbox.jsp?companyID=509538&configID=41875&jid=9615152971');
		});
	}

	this.load=function(){
		Page.prototype.load.call(this);
	}	

	this.unload=function(){
		Page.prototype.unload.call(this);

	}
}