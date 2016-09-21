init(50,"mylegend",400,100,main);  
function main(){  
    LGlobal.setDebug(true);  
    var sc = "aaa;Load.script(script/Main.ls);bbb;";  
    var sp = new LSprite();  
    addChild(sp);  
    var script = new LScript(sp,sc);  
} 