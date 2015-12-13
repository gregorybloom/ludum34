



function ShotActor() {
}
ShotActor.prototype = new Actor;
ShotActor.prototype.identity = function() {
	return ('ShotActor (' +this._dom.id+ ')');
};
ShotActor.prototype.init = function() {
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

ShotActor.prototype.draw = function() {
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
ShotActor.prototype.update = function() {
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

ShotActor.prototype.collideType = function(act) {
	if(act == this.firer)		return false;
	return false;
};
ShotActor.prototype.collideVs = function(act) {

};



ShotActor.prototype.updateCurrentAnimation = function() {
//	if(this.animateModule == null)	return;
	if(this.lastHeading.x == 0 && this.lastHeading.y == 0)	return;
	

};
ShotActor.prototype.updateMode = function() {
};


ShotActor.alloc = function() {
	var vc = new ShotActor();
	vc.init();
	return vc;
};
