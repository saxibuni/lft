var mm = mm || {};
mm.Storage = {
	setItem: function(name, data){
		data = typeof data === "object" ? JSON.stringify(data) : data.toString();
		try{
			window.localStorage.setItem(name, data);
		}catch(e){}
	},
	
	getItem: function(name, isObj){
		try{
			var data = window.localStorage.getItem(name);
		}catch(e){
			return ;
		}
		if(!data) return null;
		if(!isObj) return data;
		try{
			return JSON.parse(data);
		}catch(e){
			return null;
		}
	},
	
	removeItem: function(name){
		try{
			window.localStorage.removeItem(name);
		}catch(e){}
	}
};