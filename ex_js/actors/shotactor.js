



function ShotActor() {
}
ShotActor.prototype = new Actor;
ShotActor.prototype.identity = function() {
	return ('ShotActor (' +this._dom.id+ ')');
};
ShotActor.prototype.init = function() {
	Actor.prototype.init.call(this);

	this.shotClass = "BASICSHOT";
	this.shotType = 0;

	this.size = {w:8,h:8};
	this.position = {x:0,y:0};

	this.heading = {x:0,y:0};
	this.direction = 0;

	this.steps = [];
	this.stepCooldown = GAMEMODEL.gameClock.elapsedMS();
	this.currStep = null;
	this.stepNum = -1;

	this.started = false;
	this.startedTime = GAMEMODEL.gameClock.elapsedMS();

	this.lifecool = GAMEMODEL.gameClock.elapsedMS();
	this.lifedur = 10000;

	this.deathClock = 1000;
	this.deathRadius = 4;
	this.deathStart = GAMEMODEL.gameClock.elapsedMS();
	this.deathBegin = false;
	
	this.deadLength = 50;

	this.ticksDiff = 0;
	this.radius=4;
	this.unitSpeed = 0.3;
	this.firer=null;
	
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
};
ShotActor.prototype.update = function() {
	Actor.prototype.update.call(this);

	this.checkDeath();
	if(this.deathBegin)		this.updateDeath();
	this.checkEnd();

	var curtime = GAMEMODEL.gameClock.elapsedMS();

	if(!this.started) {
		this.started = true;
		this.startedTime = GAMEMODEL.gameClock.elapsedMS();
		this.stepCooldown = GAMEMODEL.gameClock.elapsedMS();
		this.lifecool = GAMEMODEL.gameClock.elapsedMS();
	}
	else {
		var newPos = {x:this.position.x,y:this.position.y};
			newPos.x += this.heading.x*this.unitSpeed*this.ticksDiff;
			newPos.y += this.heading.y*this.unitSpeed*this.ticksDiff;
		this.updatePosition(newPos);

		this.midStep( (curtime-this.stepCooldown), this.stepNum,this.currStep );
	}

	if( (this.lifecool + this.lifedur) < curtime )		this.alive = false;

	
	if(this.moveModule != null)		this.moveModule.update();
//	if(this.animateModule != null)	this.animateModule.update();
};
ShotActor.prototype.loadStep = function(time, step) {
	this.steps.push({time:time,step:step});
};
ShotActor.prototype.checkStep = function() {
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	for(var i in this.steps) {
		if(curtime > (this.stepCooldown+this.steps[i].time)) {
			this.stepCooldown = GAMEMODEL.gameClock.elapsedMS();
			this.stepNum+=1;

			this.currStep = this.beginStep(this.stepNum,this.currStep);

			this.steps.splice(i,1);
			return;
		}
	}
};
ShotActor.prototype.midStep = function(timeplace,num,step) {
};
ShotActor.prototype.beginStep = function(num,step) {

};
ShotActor.prototype.collide = function(act) {
	if(typeof act === "undefined")		return;
	if(act  instanceof EnemyActor && act.deathBegin)	return;
	if(act  instanceof ShotActor && act.deathBegin)		return;
	if(this.deathBegin)									return;
	Actor.prototype.collide.call(this,act);

};
ShotActor.prototype.collideType = function(act) {
	if(act == this.firer)		return false;
	return false;
};
ShotActor.prototype.collideVs = function(act) {

};
ShotActor.prototype.checkDeath = function() {
	if(this.deathBegin)			return;
};
ShotActor.prototype.checkEnd = function() {
	if(!this.deathBegin)		return;
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	if(curtime > (this.deathStart+this.deathClock))		this.alive = false;
};
ShotActor.prototype.beginDeath = function() {
	if(this.deathBegin)		return;
	this.deathStart = GAMEMODEL.gameClock.elapsedMS();
	this.deathBegin = true;
	this.heading.x = 0;
	this.heading.y = 0;
};
ShotActor.prototype.updateDeath = function() {
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
