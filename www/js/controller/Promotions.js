var Promotions=function () {

	var promotionUl=$("#promotionsContent ul");

	this.init=function(){
		Page.prototype.init.call(this);

		promotionUl.on('click', 'a.onlineServerLink', function(event) {
			window.open('http://v1.live800.com/live800/chatClient/chatbox.jsp?companyID=509538&configID=41875&jid=9615152971');
		});
	}

	this.load=function(){
		Page.prototype.load.call(this);
		getPromotions();
	}

	this.unload=function(){
		Page.prototype.load.call(this);
	}

	var getPromotions=function(){
		$.ajax({
			url:"/98lft/Controllers/QueryPromotionContent.ashx",
			success:function(data){
				if (data.Code>0) { mm.popup.showMessage(locale.getString("MSG_RES_"+data.Code)); return; };			
				var promotionList=data.PromotionContentList || [];
				promotionUl.html("");
				createPromotionElement(promotionList);
			},
			error:function(e){

			}
		});
	}

	var createPromotionElement=function(data){
		$.each(data,function(index,item){
			var imgSrc="/98lft/Public/Images/cache/"+item.PromoteImgCn;
			var html="<div class='item'>";
			html+="<img src='" + imgSrc + "' />";
			html+="<div>"+item.PromoteTitleCn+"</div>";
			html+="<div>"+item.PromoteContentCn.replace("width:500px","width:100%").replace("<p>&nbsp; 最小存款</p>","最小存款")+"</div>";
			html+="<div><a href='javascript:void(0);' class='onlineServerLink'>我要申请</a></div>";
			$('<li />').html(html).appendTo(promotionUl);
		});
	}
}