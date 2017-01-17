$.afui.ready(function() {

	$.ajaxSetup({
		beforeSend:function(xhr){
			$.afui.showMask();
			$('<div id="mask" style="opacity:0.3;" class=""></div>').appendTo(document.body);
		},
		complete:function(xhr,status){
			$.afui.hideMask();
			$('#mask').remove();
		}
	});


	$('nav li > a').click(function(){
				
		var className=$(this).attr('class');
		if (className) {
			if ($($.afui.activeDiv).attr('id')=="game") 
				$("[gameType="+ className +"]").trigger('click');
			else
				$("#gameTypeParams").text(className);
		}
		$.afui.drawer.hide();		
	});

	$("#logout").click(function(){
		var sessionId=$.cookie('SessionId');
		if (!sessionId) {return;}
		$.ajax({
			url:"/webservice/Action/LFTServices.asmx/LogOutAction",
			data:{SessionId:sessionId},
			success:function(data){
				//logout  成功时code为1。。。
				//if (data.Code>0) { mm.popup.showMessage(locale.getString("MSG_RES_"+data.Code)); return; };

				$.removeCookie("SessionId");
				$.removeCookie("MemId");
				$.removeCookie("MemName");
				$(".jurisdiction").hide();
				$(".loginItem").show();
				
				$.afui.loadContent("#login");
				$.afui.drawer.hide();
			},
			error:function(e){

			},
			cache:false
		});
	});


	var keyCodeArray2=[48,49,50,51,52,53,54,55,56,57,190,8,96,97,98,99,100,101,102,103,104,105,110];

	//金额验证  只能输入数字和小数点
	$(".moneyInput").keydown(function(e) {
		if ($.inArray(e.keyCode,keyCodeArray2)==-1) return false;
	}).blur(function(e) {
		var value=$(this).val();
		if (value=="") return;
		if (!$.isNumeric(value)&&value!="") {
			mm.popup.showMessage(locale.getString('MSG_VALID_AMOUNT'));
			$(this).focus();
		}else{
			$(this).val(parseFloat(value).toFixed(2));
		}
	});


	mm.getBalance=function(type,callback){
		if (!$.cookie("SessionId")) return;
		$.ajax({
			url:"/webservice/Action/LFTServices.asmx/QueryBalanceAction",
			data:{
				UID: $.cookie("MemId"),
				Merchant: type,
				SessionId: $.cookie("SessionId")
			},
			success:function(data){
				//暂时注释
				if (data.Code>0) { 
					//mm.popup.showMessage(locale.getString("MSG_RES_"+data.Code));
				 	return;
				};
				callback(data);
			},
			error:function(e){				
			},
			cache:false
		});
	}

	mm.getBalance("-",function(data){
		$(".balance").html("¥"+ mm.formatMoney(data.Balance));
	});

	mm.getBalance("PT",function(data){
		$("#pt_balance").text("¥"+ mm.formatMoney(data.Balance));
	});

	mm.getBalance("SG",function(data){
		$("#sg_balance").text("¥"+ mm.formatMoney(data.Balance));
	});

	/*
	mm.getBalance("GP",function(data){
		$("#gp_balance").text("¥"+ mm.formatMoney(data.Balance));
	});
			
	mm.getBalance("TT",function(data){
		$("#tt_balance").text("¥"+ mm.formatMoney(data.Balance));
	});	
	*/

});