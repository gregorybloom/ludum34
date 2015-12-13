



function BulletActor() {
}
BulletActor.prototype = new Actor;
BulletActor.prototype.identity = function() {
	return ('BulletActor (' +this._dom.id+ ')');
};
BulletActor.prototype.init = function() {
	Actor.prototype.init.call(this);

	this.size = {w:8,h:8};
	this.position = {x:0,y:0};

	this.heading = {x:0,y:0};
	this.lastHeading = {x:0,y:0};
	this.direction = 0;

	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.cooldur = 10000;
	
	this.radius=4;
	this.unitSpeed = 0.3;
	this.firer=null;
	
	this.damage = 1;

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
	Actor.prototype.draw.call(this);
	GAMEVIEW.fillCircle(this.absBox,this.radius,"#000000");
//	GAMEVIEW.drawEllipses(this.absPosition, this.size, true, 0, "#000000");

	var lvl = 0;

	if(GAMEVIEW.BoxIsInCamera(this.absBox)) {
//		GAMEVIEW.drawBox(this.absBox);
	} else {
//		GAMEVIEW.drawCircle(this.absPosition,100);		
	}	/**/
};
BulletActor.prototype.update = function() {
	Actor.prototype.update.call(this);

	if(this.direction == 0)			this.heading = {x:0, y:-1};
	else if(this.direction == 1)	this.heading = {x:1, y:0};
	else if(this.direction == 2)	this.heading = {x:0, y:1};
	else if(this.direction == 3)	this.heading = {x:-1, y:0};
	this.lastHeading.x = this.heading.x;
	this.lastHeading.y = this.heading.y;

	var newPos = {x:0,y:0};
	newPos.x = this.position.x + this.heading.x*this.unitSpeed*this.ticksDiff;
	newPos.y = this.position.y + this.heading.y*this.unitSpeed*this.ticksDiff;
	this.updatePosition(newPos);
	
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	if( (this.cooldown + this.cooldur) < curtime )		this.alive = false;

	
	if(this.moveModule != null)		this.moveModule.update();
//	if(this.animateModule != null)	this.animateModule.update();
};

BulletActor.prototype.collideType = function(act) {
	if(act == this.firer)		return false;
	if(act instanceof CharActor)	return true;
	if(act instanceof OctActor)		return true;
	return false;
};
BulletActor.prototype.collideVs = function(act) {
	if(act instanceof CharActor)
	{
		var interBox = GAMEGEOM.BoxIntersection(this.absBox, act.absBox);

		var P = {x:0,y:0};
		P.x = interBox.x + interBox.w/2;
		P.y = interBox.y + interBox.h/2;
		var E = {x:this.position.x,y:this.position.y,w:this.size.w,h:this.size.h};

		var I = GAMEGEOM.EllipsePoint(E,P);

		if(I) {
			this.alive = false;
			act.health -= this.damage;

			if(GAMEVIEW.BoxIsInCamera(act.absBox)) {
				var r=0.9+ 0.3*Math.random();
				var v=0.55+ 0.1*Math.random();
//				act.playSound(6,v,r);
			}
		}
	}
};



BulletActor.prototype.updateCurrentAnimation = function() {
//	if(this.animateModule == null)	return;
	if(this.lastHeading.x == 0 && this.lastHeading.y == 0)	return;
	

};
BulletActor.prototype.updateMode = function() {
};


BulletActor.alloc = function() {
	var vc = new BulletActor();
	vc.init();
	return vc;
};
