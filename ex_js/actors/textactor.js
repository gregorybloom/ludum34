
function TextActor() {
}
TextActor.prototype = new EnemyActor;
TextActor.prototype.identity = function() {
	return ('TextActor ()');
};

TextActor.prototype.init = function() {
	EnemyActor.prototype.init.call(this);

	this.deadLength = 50;
	
	this.entered = false;
	this.enterTime = 0;
	this.intoTime = 3000;
	this.fadeTime = 3000;

	this.heading = {x:0,y:1};
	this.unitSpeed = 0.03;

	this.size={w:1,h:1};	
	this.text = "";
	
	this.fontSize = 24;
	this.fontCenter = false;
	
	this.startTime = 0;
	this.lifeTime = 3000;
};
TextActor.prototype.loadingData = function(data)
{
	EnemyActor.prototype.loadingData.call(this,data);	

		this.enemyClass = "TEXTACTOR";
		this.enemyType=0;

		this.setFloatText(data.text,this.position,10000,data.fsize);

		this.stepNum=0;
};

TextActor.prototype.setFloatText = function(_txt,_pos,life,fsize) {
	this.text = _txt;

	this.updatePosition(_pos);
	
	this.lifeTime = life;
	this.fontSize = fsize;

};
TextActor.prototype.update = function() {
	EnemyActor.prototype.update.call(this);
	this.updatePosition();
	
	if(this.startTime == 0)		this.startTime = GAMEMODEL.gameClock.elapsedMS();		

	if(!this.entered) {
		var CF = GAMEMODEL.gameSession.gameWorld.camField;
		if(GAMEGEOM.BoxContainsPt(CF.absBox, this.position)) {
			this.entered = true;
			this.enterTime = GAMEMODEL.gameClock.elapsedMS();
		}
	}

};

TextActor.prototype.draw = function() {

	GAMEVIEW.clearDrawMods();
	
    
        GAMEVIEW.context.globalAlpha=1.0;
        GAMEVIEW.drawModifiers.color = "#0099FF";

		var curtime = GAMEMODEL.gameClock.elapsedMS();		
       	var ediff = (curtime-this.enterTime);
        if(this.entered && ediff > this.intoTime) {
        	ediff = (ediff-this.intoTime) / this.fadeTime;
	        GAMEVIEW.context.globalAlpha=Math.max(1.0-ediff,0);
        }

        var font = this.fontSize + "pt Arial";
		GAMEVIEW.fillText(this.absPosition, this.text, font,"#999999");

	GAMEVIEW.context.globalAlpha=1.0;
	GAMEVIEW.clearDrawMods();
};



TextActor.prototype.collideType = function(act) {
	return false;
};
TextActor.prototype.collideVs = function(act) {
};



TextActor.alloc = function() {
	var vc = new TextActor();
	vc.init();
	return vc;
};