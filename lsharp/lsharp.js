/*
 * LScript.js
 **/
function LScript(scriptLayer,value){
	var self = this;
	LGlobal.script = self;
	self.scriptLayer = scriptLayer;
	self.dataList = new Array();
	var arr=[value];
	self.dataList.unshift(arr);
	self.toList(value);
}
LScript.prototype = {
	toList:function(ltxt){
		var self = this;
		self.lineList = ltxt.split(";");
		self.copyList = self.lineList.slice(0);
		self.analysis();
	},
	saveList:function(){
		var self = this;
		var arr=self.dataList[0];
		if(arr){
			arr[1]=self.lineList;
			arr[2]=self.copyList;
		}
	},
	analysis:function(){
		var self = this;
		var arr;
		if(self.lineList.length == 0){
			self.dataList.shift();
			if(self.dataList.length > 0){
				arr=self.dataList[0];
				self.lineList = arr[1];
				self.copyList = arr[2];
				self.analysis();
			}
			return;
		}
		var lineValue = "";
		while(self.lineList.length > 0 && lineValue.length == 0){
			lineValue = LMath.trim(self.lineList[0]);
			self.lineList.shift();
		}
		if(lineValue.length == 0){
			self.analysis();
			return;
		}
		trace("analysis lineValue = " + lineValue);
		var sarr = lineValue.split(".");
		switch(sarr[0]){
			case "Load":
				ScriptLoad.analysis(lineValue);
				break;
			default:
				self.analysis();
		}
	}
};
/*
 * ScriptLoad.js
 **/
var ScriptLoad = function (){};
ScriptLoad.data = "";
ScriptLoad.urlloader = null;
ScriptLoad.analysis = function (value){
	var start = value.indexOf("(");
	var end = value.indexOf(")");
	ScriptLoad.data = value.substring(start+1,end).split(",");
	switch(LMath.trim(value.substr(0,start))){
		case "Load.script":
			ScriptLoad.loadScript();
			break;
		default:
			LGlobal.script.analysis();
	}
};
ScriptLoad.loadScript = function (){
	ScriptLoad.urlloader = new LURLLoader();
	ScriptLoad.urlloader.addEventListener(LEvent.COMPLETE,ScriptLoad.loadScriptOver);
	ScriptLoad.urlloader.load(ScriptLoad.data[0],"text");
};
ScriptLoad.loadScriptOver = function (event){
	var script = LGlobal.script;
	var data = event.target.data;
	ScriptLoad.urlloader.die();
	ScriptLoad.urlloader = null;
	script.saveList();
	script.dataList.unshift([data]);
	script.toList(data);
};