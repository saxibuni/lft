var Game=function () {

	var urlMap={
		PT : "/98lft/Json/ptgamelist-cn.json",
		SG : "/98lft/Json/egamelist-mobile-cn.json",
		GP : "/98lft/Json/gpgamelist-cn.json",
		TT : "/98lft/Json/Ttggamelist-cn.json",
		PTcache : [],
		SGcache : [],
		GPcache : [],
		TTcache : []
	};
	var gameUl=$("#gameUl");
	var pageSize=8;
	var pageIndex=0;
	var gameType="";

	this.init=function(){
		Page.prototype.init.call(this);

		//游戏类型切换
		$(".gameType a").click(function(e){

			$(".gameType a").not(e.target).each(function(index, el) {
				gameTypeUnSelectedCss(el);
			});

			gameTypeSelectedCss(this);

			var type=$(this).attr('gameType');
			gameType=type;
			var url= urlMap[type];
			pageIndex=0;
			$("#moreGame").show();
			$("#gameName").val("");
			getGamebyType(url,type);
		});

		//根据名字搜索游戏
		$("#gameSearch").click(function(){
			var gameName=$("#gameName").val();
			var data=gameUl.data('data');
			pageIndex=0;
			gameUl.html("");
			$("#moreGame").show();
			loadGameByPageIndex(data,gameName,gameType);
		});

		//回车查询
		$("#gameName").keydown(function(event) {
			if (event.keyCode==13) 
				$("#gameSearch").trigger('click');
		});

		//更多游戏
		$("#moreGame").click(function(){
			var data=gameUl.data('data');
			var gameName=$("#gameName").val();
			$("#moreGame").show();
			loadGameByPageIndex(data,gameName,gameType);
		});

		//
		gameUl.on('click', 'a', function(event) {
			$('.upper').removeClass('transformUpper');
		    $('.lower').removeClass('transformLower');

		    var className = $(event.target || event.srcElement).attr('class');
		    if (className=='downloadGame') { window.open('http://m.mp176588.com/download.html'); return; }
			
			if(!$.cookie("SessionId")){
				mm.popup.showConfirm(locale.getString("MSG_LINK_GAME"),"",function(){
					$.afui.loadContent("#login");
				});
				return;
			}

			var url=$(event.target || event.srcElement).attr('url');
			if (className=="startGame") {
				locationGameHref(url,true);
			}else if(className=="testGame"){
				locationGameHref(url,false);
			}
		});

	}

	this.load=function(){
		Page.prototype.load.call(this);
		var type=$("#gameTypeParams").text();

		$("[gameType="+ type +"]").trigger('click');

		//$(".gameType a:eq(0)").trigger('click');
	}

	this.unload=function(){
		Page.prototype.load.call(this);

		urlMap={
			PT : "/98lft/Json/ptgamelist-cn.json",
			SG : "/98lft/Json/egamelist-mobile-cn.json",
			GP : "/98lft/Json/gpgamelist-cn.json",
			TT : "/98lft/Json/Ttggamelist-cn.json",
			PTcache : [],
			SGcache : [],
			GPcache : [],
			TTcache : []
		};
		gameUl.html("");
		pageIndex=0;

	}

	var gameTypeSelectedCss=function(o){
		var img=$(o).find('img');
		$(o).css('color','#721315').addClass('background');
		img.attr('src',img.attr('src').replace('_out','_on'));
	}

	var gameTypeUnSelectedCss=function(o){
		var img=$(o).find('img');		
		$(o).css('color','#000').removeClass('background');
		img.attr('src',img.attr('src').replace('_on','_out'));
	}

	var getGamebyType=function(url,type){
		if (urlMap[type+"cache"].length>0){
			var data=urlMap[type+"cache"];
			gameUl.html("");
			loadGameByPageIndex(data,"",type);
			return;			
		}

		$.getJSON(url,{},function(data){
			gameUl.html("").data('data',data);
			loadGameByPageIndex(data,"",type);
		});
	}

	var loadGame=function(data,type){
		$.each(data,function(index,item){
			var html = "<div class='upper'>";
			html += "<img src='" + "/98lft" + item.img + "'/>";
			html += "<div title='"+ item.name +"'>" + item.name + "</div>";
			html += "</div>";

			html += "<div class='lower'>";
			if (type=="SG") {
				html += "<a class='startGame' url='"+ item.url + "'>开始游戏</a>";
				html += "<a class='testGame' url='"+ item.url + "'>试玩游戏</a>";
			}else if(type=="PT"){
				html += "<a class='downloadGame'>下载客户端</a>";
			}

			html += "</div>";
			$("<li />").html(html).appendTo(gameUl).find('div.upper').click(function(){

				$('.upper').removeClass('transformUpper');
		        $('.lower').removeClass('transformLower');

				var $this = $(this);
				$this.addClass('transformUpper');
		        $this.next().addClass('transformLower');
		        
		        setTimeout(function (argument) {
		            $this.removeClass('transformUpper');
		            $this.next().removeClass('transformLower');
		        }, 3000);

			}); 

		});
	}

	var locationGameHref=function(url,realMoney){
		var obj=getGameParams(url);
		var gameCode=obj["GameCode"];
		var provider=obj["Provider"];

		$.ajax({
			url:"/webservice/Action/LFTServices.asmx/QueryGameURL",
			data:{
				sessionId:$.cookie("SessionId"),
				provider:provider,
				gameCode:gameCode,
				realMoney:realMoney,
				language:"zh_CN",
				gameType:"",
				gameName:""
			},
			success:function(data){
				if (data.Code>0) { mm.popup.showMessage(locale.getString("MSG_RES_"+data.Code)); return; };
				var url=data.Url[0];
				
				//window.location.href=url;
				
				window.open(url,"_self");

				/*
				var a = $("<a href='"+ url +"' target='_blank' >test</a>").get(0);
				var e = document.createEvent('MouseEvents');
				e.initEvent('click', true, true);
				a.dispatchEvent(e);*/
				

				/*
				document.getElementById("msgText").innerHTML="<form id='hiddenlink' action='"+url+"' target='_blank'></form>";
				var s=document.getElementById("hiddenlink");
				s.submit();*/
				
			},
			error:function(e){

			}
		});
	}

	var getGameParams=function(url,params){
		var name,value;
		var str=url.substr(url.indexOf("?")+1);
		var arr=str.split("&");
		var obj={};
		for(var i=0;i<arr.length;i++){
			var num = arr[i].indexOf('=');
			if (num>0) {
				name=arr[i].substring(0,num);
    			value=arr[i].substr(num+1);
    			obj[name]=value;
			}
		}

		//return obj[params] || "";
		return obj;
	}


	var loadGameByPageIndex=function(data,pageName,type){
		var filterData=[];
		if (pageName) {
			data=data.filter(function(item,index,array){
				return (item.name.indexOf(pageName)>-1);
			});
		};

		filterData=data.filter(function(item,index,array){
			return (index>=pageIndex*pageSize && index<(pageIndex+1)*pageSize);
		});
		if(filterData.length==0) { $("#moreGame").hide(); return; }

		loadGame(filterData,type);
		pageIndex++;
	}



}