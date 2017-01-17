var Login=function () {

	this.init=function(){
		Page.prototype.init.call(this);

		//注册
		$(".register").click(function(){
			$.afui.loadContent("#register");
		});

		//登录
		$("#btnLogin").click(function(){
			
			var uid=$("#loginName").val().trim();
			var pwd=$("#password").val();

			if (uid==""|| pwd=="") {
				mm.popup.showMessage(locale.getString("MSG_CANNOTNULL"));
				return;
			};

			$.ajax({
				url:"/webservice/Action/LFTServices.asmx/LoginAction",
				data:{
					UID:uid,
					PSW:pwd
				},
				success:function(data){
					if (data.Code>0) { mm.popup.showMessage(locale.getString("MSG_RES_"+data.Code)); return; };
					$.afui.loadContent("#game");

					$.cookie("SessionId",data.SessionId);
					$.cookie("MemId",data.MemId);
					$.cookie("MemName",data.MemName);
					$(".jurisdiction").show();
					$(".loginItem").hide();

					//获取各种余额信息
					mm.getBalance("-",function(data){
						$(".balance").html("¥"+ mm.formatMoney(data.Balance));
					});
					mm.getBalance("PT",function(data){
						$("#pt_balance").text("¥"+ mm.formatMoney(data.Balance))
					});
					mm.getBalance("SG",function(data){
						$("#sg_balance").text("¥"+ mm.formatMoney(data.Balance))
					});
					
					/*
					mm.getBalance("GP",function(data){
						$("#gp_balance").text("¥"+ mm.formatMoney(data.Balance))
					});							
					mm.getBalance("TT",function(data){
						$("#tt_balance").text("¥"+ mm.formatMoney(data.Balance))
					});
					*/

				},
				error:function(e){
					//just for debug
				},
				cache:false
			});
			
		});
	}

	this.load=function(){
		Page.prototype.load.call(this);
	}

	this.unload=function(){
		Page.prototype.unload.call(this);

		$("#loginName").val("");
		$("#password").val("");
	}

}