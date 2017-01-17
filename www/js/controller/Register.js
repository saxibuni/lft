var Register=function () {
	this.init=function(){
		Page.prototype.init.call(this);

		$("#confirmRegister").click(function(){
			var req={
				MemId: $("#MemId").val(),
				MemPwd: $("#MemPwd").val(),
				Re_memPwd: $("#Re_memPwd").val(),
				MemName: $("#MemName").val(),
				MemEmail: $("#MemEmail").val(),
				Gender: $("#Gender").val(),
				ContactNumber: $("#ContactNumber").val(),
				QqNumber: $("#QqNumber").val(),
				ReferralId: $("#ReferralId").val()
			};

			if (validate(req)) {
				delete req.Re_memPwd;
				$.ajax({
					url:"/webservice/Action/LFTServices.asmx/RegisterUser",
					data:req,
					success:function(data){
						if (data.Code>0) {mm.popup.showMessage(locale.getString("MSG_RES_"+data.Code)); return;};
						mm.popup.showMessage(locale.getString("MSG_RES_0"),"",function (argument) {
							$("#registerForm")[0].reset();					
							$.afui.loadContent("#game");
						});
					},
					error:function(e){
					},
					cache:false
				});
			}
		});
	}

	this.load=function(){
		Page.prototype.load.call(this);
		$(".register").hide();
	}

	this.unload=function(){
		Page.prototype.unload.call(this);
	}


	var validate=function(item){
		if(item.MemId.length<3||item.MemId.length>8){
			mm.popup.showMessage(locale.getString("MSG_VALID_NAME"));
			return false;
		}
		if (!isUserNameFormat(item.MemId)) {
			mm.popup.showMessage("用户名中不能含有特殊字符");
			return false;
		}
		if (item.MemPwd.length<6||item.MemPwd.length>10) {
			mm.popup.showMessage(locale.getString("MSG_VALID_PWD"));
			return false;
		}
		if (item.MemPwd!=item.Re_memPwd) {
			mm.popup.showMessage(locale.getString("MSG_VALID_REPWD"));
			return false;
		}
		if (item.MemName.length==0) {
			mm.popup.showMessage(locale.getString("MSG_VALID_REALNAME_NULL"));
			return false;
		}
		if (!isChinese(item.MemName)) {
			mm.popup.showMessage(locale.getString("MSG_VALID_REALNAME_CN"));
			return false;
		}
		if (!isTel(item.ContactNumber)) {
			mm.popup.showMessage(locale.getString("MSG_VALID_TEL"));
			return false;
		}
		if (item.QqNumber.length<5||item.QqNumber.length>10) {
			mm.popup.showMessage(locale.getString("MSG_VALID_QQ"));
			return false;
		}
		if (!isEmail(item.MemEmail)) {
			mm.popup.showMessage(locale.getString("MSG_VALID_EMAIL"));
			return false;
		}
		if (!$("#check1")[0].checked) {
			mm.popup.showMessage(locale.getString("MSG_CHECK1"));
			return false;
		}
		if (!$("#check2")[0].checked) {
			mm.popup.showMessage(locale.getString("MSG_CHECK2"));
			return false;
		}		
		return true;
	}


	function isChinese(s){
	    var ret=true;
	    for(var i=0;i<s.length;i++)
	    ret=ret && (s.charCodeAt(i)>=10000);
	    return ret;
	}

	function isTel(s){
		var reg= /^1\d{10}$/;
		return reg.test(s);
	}

	function isEmail(s){
		var reg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		return reg.test(s);
	}

	function isUserNameFormat (s) {
		var reg=/^\w+$/;
		return reg.test(s);
	}
}