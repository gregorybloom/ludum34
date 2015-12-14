



function PlayerShotActor() {
}
PlayerShotActor.prototype = new ShotActor;
PlayerShotActor.prototype.identity = function() {
	return ('PlayerShotActor (' +this._dom.id+ ')');
};
PlayerShotActor.prototype.init = function() {
	ShotActor.prototype.init.call(this);

	this.size = {w:8,h:8};

	this.heading = {x:0,y:0};

	this.shotClass = "PLAYERSHOT";
	this.shotType = 0;

	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.cooldur = 10000;
	
	this.radius=4;
	this.unitSpeed = 0.3;
	this.firer=null;

	this.damage = 2;
	
	this.deathClock = 100;
	this.deathRadius = this.radius;

	this.updatePosition();
/*	
	this.animateModule = AnimationModule.alloc();
	this.animateModule.target = this;
	this.animateModule.drawCollection = 0;
	this.animateModule.changeToAnimation(13, true);
/**/	
	this.moveModule = MovingActorModule.alloc();
	this.moveModule.target = this;	
};

PlayerShotActor.prototype.draw = function() {
	ShotActor.prototype.draw.call(this);
//	GAMEVIEW.drawEllipses(this.absPosition, this.size, true, 0, "#000000");

	var lvl = 0;

	if(!this.deathBegin) {
		GAMEVIEW.fillCircle(this.absPosition,this.radius,"#000000");
	} else {
		GAMEVIEW.drawCircle(this.absPosition,this.deathRadius,"#000000",1);
	}	
};
PlayerShotActor.prototype.update = function() {
	ShotActor.prototype.update.call(this);
};

PlayerShotActor.prototype.midStep = function(timeplace,num,step) {
};
PlayerShotActor.prototype.beginStep = function(num,step) {

};

PlayerShotActor.prototype.collideType = function(act) {
	if(act == this.firer)		return false;
	return false;
};
PlayerShotActor.prototype.collideVs = function(act) {

};

PlayerShotActor.prototype.updateDeath = function() {
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	var deathDiff = (curtime - this.deathStart)/this.deathClock;

	this.deathRadius = this.radius + 2*(deathDiff);
};


PlayerShotActor.prototype.updateCurrentAnimation = function() {
//	if(this.animateModule == null)	return;
	if(this.lastHeading.x == 0 && this.lastHeading.y == 0)	return;
	

};
PlayerShotActor.prototype.updateMode = function() {
};


PlayerShotActor.alloc = function() {
	var vc = new PlayerShotActor();
	vc.init();
	return vc;
};
