
function TextActor() {
}
TextActor.prototype = new Actor;
TextActor.prototype.identity = function() {
	return ('TextActor ()');
};

TextActor.prototype.init = function() {
	Actor.prototype.init.call(this);
	
	this.size={w:1,h:1};	
	this.text = "";
			
	this.fontSize = 24;
	this.fontCenter = false;
	
	this.startTime = 0;
	this.lifeTime = 3000;
};

TextActor.prototype.setFloatText = function(_txt,_pos,life,fsize) {
	this.text = _txt;

	this.updatePosition(_pos);
	
	this.lifeTime = life;
	this.fontSize = fsize;

};
TextActor.prototype.update = function() {
	Actor.prototype.update.call(this);
	this.updatePosition();
	
	if(this.startTime == 0)		this.startTime = GAMEMODEL.gameClock.elapsedMS();		
};

TextActor.prototype.draw = function() {

	GAMEVIEW.clearDrawMods();
	
    
        GAMEVIEW.context.globalAlpha=1.0;
        GAMEVIEW.drawModifiers.color = "#0099FF";

        var font = this.fontSize + "pt Arial";
		GAMEVIEW.drawText(this.absPosition, this.text, font,"#000000");

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
}