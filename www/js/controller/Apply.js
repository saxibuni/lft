var Apply=function () {

	this.init=function(){
		Page.prototype.init.call(this);

		$("#applyPromotion").click(function(){
			$.ajax({
				url:"/webservice/Action/LFTServices.asmx/PromotionApply",
				data:{sessionId:$.cookie('SessionId')},
				success:function(data){
					if (data.Code==0)  mm.popup.showMessage(locale.getString("MSG_APPLYPROMOTION__SUCCESS"));
					else mm.popup.showMessage(locale.getString("MSG_RES_"+data.Code));	
				},
				error:function(e){

				}
			});
		});
	}

	this.load=function(){
		Page.prototype.load.call(this);
	}	

	this.unload=function(){
		Page.prototype.unload.call(this);

	}
}