var WithDrawals=function () {
	
	var bankListSelect=$("#bankListSelect");

	this.init=function(){
		Page.prototype.init.call(this);
		$("#memberName").text($.cookie("MemId"));

		$("#withDrawalsBtn").click(function(){
			var data={
				sessionId:$.cookie("SessionId"),
				BankId:$("#bankListSelect").val(),
				BankAcctNo:$("#widthDrawalAcctNo").val(),
				BankAcctName:$.cookie("MemName"),
				Amount:$("#withDrawalAmount").val(),
				Province:$("#province").val(),
				City:$("#city").val(),
				BankBranch:$("#bankBranch").val()
			};

			withDrawals(data);
		});

	}

	this.load=function(){
		Page.prototype.load.call(this);

		getBankList();
	}

	this.unload=function(){
		Page.prototype.unload.call(this);
	}

	var getBankList=function(){
		$.ajax({
			url:"/webservice/Action/LFTServices.asmx/QueryWithdrawalBankList",
			data:{sessionId:$.cookie("SessionId")},
			success:function(data){
				if (data.Code>0) { mm.popup.showMessage(locale.getString("MSG_RES_"+data.Code)); return; }
				var bankList=data.BankList || [];
				addBankListItemToSelect(bankList);
			},
			error:function(e){

			}
		});
	}

	var addBankListItemToSelect=function(data){
		bankListSelect.html("");
		$.each(data,function(index,item){
			var option=$("<option value='" + item.BankId+ "'>" + item.BankName +"</option>");
			option.appendTo(bankListSelect);
		});
	}

	var withDrawals=function(data){
		$.ajax({
			url:"/webservice/Action/LFTServices.asmx/Withdrawal",
			data:data,
			success:function(res){
				if (res.Code>0) { mm.popup.showMessage(locale.getString("MSG_RES_"+res.Code)); return; }
				mm.popup.showMessage(locale.getString("MSG_WITHDRAWAL_SUCCESS"));
			},
			error:function(e){
				//alert(e.responseText);
				mm.popup.showMessage(locale.getString("MSG_WITHDRAWAL_FAILED"));
			}
		});
	}
}