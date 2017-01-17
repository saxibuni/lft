var mm = mm || {};
mm.Service = function(){
    var _url = null;
    var _socket = null;
    var _queue = [];
    var _register = [];
    var _session = [];
	var that = this;
	
	mm.Service.it = this;

    var _connect = function(){
		_url = mm.config["service"];
        console.log("connect:" + _url);
        _socket = new WebSocket(_url);
        _socket.onopen = _onOpen;
        _socket.onclose = _onClose;
        _socket.onerror = _onError;
        _socket.onmessage = _onMessage;
    };
    
	var _send = function(command, dat, callback, sender, isMask){
		isMask = isMask == undefined ? true : isMask;
		if(isMask) {$.afui.showMask(); $('<div id="mask" style="opacity:0.3;" class=""></div>').appendTo(document.body);}
		
        if(_socket && _socket.readyState == 1){
            var serialNo = mm.getSerialNo();
            _register[serialNo] = {callback: callback, sender: sender, isMask : isMask};

			dat = dat || {};
            dat.serialNo = serialNo;
            if(command != mm.Commands.LOGIN){
                dat.sessionId = $.cookie("sid");//_session.sessionId;
                dat.token = $.cookie("token"); //_session.token;
            }

            var jsData = command + "." + JSON.stringify(dat);
            _socket.send(jsData);
            return console.log("Send:::::" + jsData);
        }

        _queue.push({
            command: command,
            dat : dat,
            callback: callback,
            sender: sender
        });
        if(!_socket || _socket.readyState == _socket.CLOSED) _connect();
    };
	
    /******* event ********/
    var _onOpen = function(){
        console.log("socket open");
        while(_queue.length > 0 ){
			$.afui.hideMask();$('#mask').remove();
            var data = _queue.shift();
            _send(data.command, data.dat, data.callback, data.sender);
        }
    };
    var _onClose = function(){
        console.log("socket closed");
		that.onClose();
    };
    var _onError = function(){
        console.log("socket err");
		that.onError();
    };
    var _onMessage = function(e){
       	console.log("Receive:::::" + e.data);
        var service = mm.Service.it;
        var obj = _getObject(e.data);
        if(!obj) return ;

        var command = obj.command, dat = obj.dat;
        if(command == mm.Commands.LOGIN){
            $.cookie("sid", dat.sessionId);
            $.cookie("token", dat.token);

            _session["sessionId"] = dat.sessionId;
            _session["token"] = dat.token;
        }

        if(command > 0){
            var serialNo = dat.serialNo, fns = _register[serialNo];
            if(!fns) return ;
            delete _register[serialNo];
            that.deal(dat, fns);

        }else{
            // push message
            var fns = _register[command];
            if(fns && fns.callback && mm.isFunction(fns.callback)) fns.callback.call(fns.sender, dat);
        }
    };

    this.bindPushEvent = function(command, callback, sender){
        _register[command] = {callback: callback, sender: sender};
    };
	
    this.unBindPushEvent = function(command, callback, sender){
        delete _register[command];
    };	
	
    /***** util *****/
    var _getObject = function(str){
        try{
            var i = str.indexOf("{");
            return {command: parseInt(str.substr(0, i)), dat:JSON.parse(str.substr(i))};
        }catch (e){
            console.log("parse json err");
            return null;
        }
    };

    /*********** api ************/
	//1
	this.login = function(req, callback, sender){
		_send(mm.Commands.LOGIN, req, callback, sender);
	};
	//2
	this.logout = function(req, callback, sender){
		_send(mm.Commands.LOGOUT, req, callback, sender);
	};
	//3
	this.queryAccount = function(req, callback, sender){
		_send(mm.Commands.ACCOUNT, req, callback, sender);
	};

	this.changePwd=function(req, callback, sender){
		_send(mm.Commands.CHANGEPWD, req, callback, sender);
	}

	this.queryBetReport=function(req, callback, sender){
		_send(mm.Commands.BETREPORT, req, callback, sender);
	}

	this.statement=function(req, callback, sender){
		_send(mm.Commands.STATEMENT, req, callback, sender);
	}

    this.queryDrawDate=function(req, callback, sender){
        _send(mm.Commands.DRAWDATELIST, req, callback, sender);
    }

    this.queryResult=function(req, callback, sender){
        _send(mm.Commands.DRAWRESULT, req, callback, sender);
    }

    this.queryBetRule=function(req, callback, sender){
        _send(mm.Commands.BETRULES, req, callback, sender);
    }

    this.bet=function(req, callback, sender){
        _send(mm.Commands.BET, req, callback, sender);
    }

    this.queryTicketDetail=function(req, callback, sender){
        _send(mm.Commands.TICKETDETAIL, req, callback, sender);
    }

	//17
	this.queryCurrentCountry = function(req, callback, sender,isMask){
		_send(mm.Commands.CURRENTCONUTRY, req, callback, sender,false);
	};
	
};

mm.Service.prototype.deal = function(dat, fns){
	delete dat.sessionId;
	delete dat.token;
	delete dat.serialNo;
	var callback = fns.callback, sender = fns.sender;
	if(mm.isFunction(callback)) callback.call(sender, dat);
	if(fns.isMask) {$.afui.hideMask(); $('#mask').remove();}
};

mm.Service.prototype.onClose = function(){};
mm.Service.prototype.onError = function(){};

mm.Service.create = function(){
	mm.Service.it = mm.Service.it || new mm.Service();
	return mm.Service.it;
};

var service=mm.Service.create();
