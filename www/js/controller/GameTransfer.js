var GameTransfer=function () {

	var map={
		"-" : ".balance",
		"PT" : "#pt_balance",
		"SG" : "#sg_balance",
		"GP" : "#gp_balance",
		"TT" : "#tt_balance"
	}

	this.init=function(){
		Page.prototype.init.call(this);

		$("#transferAmount").click(function(){
			var fromProvide=$("#fromProvide").val();
			var toProvide=$("#toProvide").val();
			var amount=$("#amount").val();

			if (fromProvide==toProvide) {
				mm.popup.showMessage(locale.getString('MSG_TRANS_VALID'));
				return;
			}
			if (!$.isNumeric(amount)&&amount!="") {
				mm.popup.showMessage(locale.getString('MSG_VALID_AMOUNT'));
				return;
			}

			transferAction(fromProvide,toProvide,amount);
		});


	}

	this.load=function(){
		Page.prototype.load.call(this);
	}

	this.unload=function(){
		Page.prototype.unload.call(this);
	}

	//转账
	var transferAction=function(fromProvide,toProvide,amount){
		$.ajax({
			url:"/webservice/Action/LFTServices.asmx/TransferAction",
			data:{
				SessionId: $.cookie("SessionId"),
				FromProvider: fromProvide,
				ToProvider: toProvide,
				Amount: amount
			},
			success:function(data){
				if(data.Code>0){ mm.popup.showMessage(locale.getString('MSG_RES_' + data.Code)); return; }
				mm.popup.showMessage(locale.getString('MSG_TRANS_SUCCESS'));
				
				//更新账户信息
				mm.getBalance(fromProvide,function(data){
					$(map[fromProvide]).text("¥"+ mm.formatMoney(data.Balance))
				});
				mm.getBalance(toProvide,function(data){
					$(map[toProvide]).text("¥"+ mm.formatMoney(data.Balance))
				});

				$("#amount").val("");

			},
			error:function(e){

			},
			cache:false
		});
		
		$("#fromProvide")[0].options[0].selected=true;
		$("#toProvide")[0].options[0].selected=true;

	}



}