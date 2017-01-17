var SaveMoney=function () {
	
	var promotionSelect=$("#promotionSelect");
	var currentElementId="bankPay"; //默认银行支付

	this.init=function(){
		Page.prototype.init.call(this);

		$("#saveMomeyBtn").click(function(){
			var data={},
				url;
			if (currentElementId == "bankPay"){  //银行卡存款
				data={
					sessionId:$.cookie('SessionId'),
					BankId:$("#bankInfo").val(),
					BankAcctNo:$("#bankAcctNo").val(),
					BankAcctName:$("#bankAcctName").val(),
					BankName:$("#bankInfo").find("option:selected").text(),
					Amount:$("#saveAmount").val(),
					selPromotionList:$("#promotionSelect").val()
				}
				url = "/webservice/Action/LFTServices.asmx/DepositBankTransfer";
			} else {  //支付宝存款
				data={
					sessionId:$.cookie('SessionId'),
					Amount:$("#saveAmount").val(),
					selPromotionList:$("#promotionSelect").val()
				}
				url = "/webservice/Action/LFTServices.asmx/DepositAli";
			}
			depositBankTransfer(data , url);
		});


		$("#saveMoneyForm table a").click(function(){
			currentElementId=$(this).attr('id');
			$(this).addClass('aSelect');
			if (currentElementId=="bankPay") {
				$('#aliPay').removeClass('aSelect');
				$("#bankPayZoom").show();
			}else{
				$('#bankPay').removeClass('aSelect');
				$("#bankPayZoom").hide();
			}
		});
	}

	this.load=function(){
		Page.prototype.load.call(this);
		getPromotion();
	}

	this.unload=function(){
		Page.prototype.unload.call(this);

		promotionSelect.html("");
	}

	var getPromotion=function(){
		$.ajax({
			url:"/webservice/Action/LFTServices.asmx/QueryPromotion",
			data:{sessionId : $.cookie('SessionId') },
			success:function(data){
				if (data.Code>0) { mm.popup.showMessage(locale.getString("MSG_RES_"+data.Code)); return; };				
				var promotionList=data.PromotionList || [];
				var defaultItem={
					"PromoteTitleCn":"谢谢，不需要",
					"PromoteId":""
				};
				promotionList.push(defaultItem);
				addPromotionItemToSelect(promotionList);
			},
			error:function(e){

			}
		});
	}

	var addPromotionItemToSelect=function(data){
		promotionSelect.html("");
		$.each(data,function(index,item){
			var option;
			if (index==data.length-1) 
				option=$("<option value='" + item.PromoteId+ "' selected='selected'>" + item.PromoteTitleCn +"</option>");
			else 
				option=$("<option value='" + item.PromoteId+ "'>" + item.PromoteTitleCn +"</option>");
			option.appendTo(promotionSelect);
		});
	}

	//支付
	var depositBankTransfer=function(data,url){
		$.ajax({
			url:url,
			data:data,
			success:function(res){
				if (res.Code>0) { mm.popup.showMessage(locale.getString("MSG_RES_"+res.Code)); return; }
				mm.popup.showMessage(locale.getString("MSG_DEPOSIT_SUCCESS"));
				$("#saveMoneyForm")[0].reset();
				if (currentElementId == "aliPay") {
					window.open("http://test.ali.98lft.net/Send.aspx?OrderID="+ res.TxId +"&Money=" + data.Amount,'_self');
				};
			},
			error:function(e){
				//alert(e.responseText);
				mm.popup.showMessage(locale.getString("MSG_DEPOSIT_FAILED"));
			}
		});
	}

}