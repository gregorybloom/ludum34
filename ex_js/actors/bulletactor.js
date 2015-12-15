



function BulletActor() {
}
BulletActor.prototype = new ShotActor;
BulletActor.prototype.identity = function() {
	return ('BulletActor (' +this._dom.id+ ')');
};
BulletActor.prototype.init = function() {
	ShotActor.prototype.init.call(this);

	this.size = {w:8,h:8};

	this.shotClass = "BULLETSHOT";
	this.shotType = 0;

	this.radius=4;
	this.unitSpeed = 0.3;
	this.firer=null;
	
	this.damage = 1;
	this.deathClock = 200;
	this.deathRadius = this.radius;

	this.actionMode = "MODE_STILL";
	
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

BulletActor.prototype.draw = function() {
	ShotActor.prototype.draw.call(this);
	if(!this.deathBegin) {
		GAMEVIEW.fillCircle(this.absPosition,this.radius,"#000000");
	} else {
		GAMEVIEW.drawCircle(this.absPosition,this.deathRadius,"#990000",1);
	}	
};
BulletActor.prototype.update = function() {
	ShotActor.prototype.update.call(this);
};
BulletActor.prototype.updateDeath = function() {
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	var deathDiff = (curtime - this.deathStart)/this.deathClock;

	this.deathRadius = this.radius + 2*(deathDiff);
};
BulletActor.prototype.collideType = function(act) {
	if(act == this.firer)		return false;
	if(act instanceof CharActor)	return true;
	return false;
};
BulletActor.prototype.collideVs = function(act) {
	if(act instanceof CharActor)
	{
/*		var interBox = GAMEGEOM.BoxIntersection(this.absBox, act.absBox);

		var P = {x:0,y:0};
		P.x = interBox.x + interBox.w/2;
		P.y = interBox.y + interBox.h/2;
		var E = {x:this.position.x,y:this.position.y,w:this.size.w,h:this.size.h};

		var I = GAMEGEOM.EllipsePoint(E,P);		/**/

		act.health -= this.damage;
		this.beginDeath();

		if(GAMEVIEW.BoxIsInCamera(act.absBox)) {
			var r=0.3+ 0.3*Math.random();
			var v=1.55+ 0.1*Math.random();
			this.playSound(1,v,r);
		}
	}
};



BulletActor.prototype.updateCurrentAnimation = function() {
//	if(this.animateModule == null)	return;
	if(this.lastHeading.x == 0 && this.lastHeading.y == 0)	return;
	

};
BulletActor.prototype.updateMode = function() {
};
BulletActor.prototype.midStep = function(timeplace,num,step) {
};
BulletActor.prototype.beginStep = function(num,step) {

};


BulletActor.alloc = function() {
	var vc = new BulletActor();
	vc.init();
	return vc;
};
