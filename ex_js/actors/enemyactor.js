
function EnemyActor() {
}
EnemyActor.prototype = new Actor;
EnemyActor.prototype.identity = function() {
	return ('EnemyActor (' +this._dom.id+ ')');
};
EnemyActor.prototype.init = function() {
	Actor.prototype.init.call(this);

	this.enemyClass = "BASICENEMY";
	this.enemyType = 0;

	this.scoreValue = 0;

	this.deadLength = 100;
	this.shotCooldown = GAMEMODEL.gameClock.elapsedMS();
	this.coolShot = 2000;

	this.ticksDiff = 0;
	this.heading = {x:0,y:0};
	this.unitSpeed = 0.04;
	this.health = 0;

	this.steps = [];
	this.stepCooldown = GAMEMODEL.gameClock.elapsedMS();
	this.currStep = null;
	this.stepNum = -1;

	this.deathClock = 1000;
	this.deathRadius = 4;
	this.deathStart = GAMEMODEL.gameClock.elapsedMS();
	this.deathBegin = false;

	this.target = null;

	this.started = false;
	this.startedTime = GAMEMODEL.gameClock.elapsedMS();
};
EnemyActor.prototype.clear = function() {
	Actor.prototype.clear.call(this);
	this.steps = null;
};

EnemyActor.prototype.loadingData = function(data)
{
	if(data.class)		this.enemyClass = data.class;
	if(data.classtype)	this.enemyType = data.classtype;
};

EnemyActor.prototype.draw = function() {
	Actor.prototype.draw.call(this);
//	GAMEVIEW.drawBox(this.absBox,"#660000");
};
EnemyActor.prototype.update = function() {
	Actor.prototype.update.call(this);
	this.checkDeath();
	if(this.deathBegin)		this.updateDeath();
	this.checkEnd();
	var curtime = GAMEMODEL.gameClock.elapsedMS();

	if(!this.started) {
		this.started = true;
		this.startedTime = GAMEMODEL.gameClock.elapsedMS();
		this.stepCooldown = GAMEMODEL.gameClock.elapsedMS();
	}
	else {
		var newPos = {x:this.position.x,y:this.position.y};
			newPos.x += this.heading.x*this.unitSpeed*this.ticksDiff;
			newPos.y += this.heading.y*this.unitSpeed*this.ticksDiff;
		this.updatePosition(newPos);

		if(!this.deathBegin) {
			this.checkStep();
			this.midStep( (curtime-this.stepCooldown), this.stepNum,this.currStep );
			this.checkShoot();
		}
	}
};
EnemyActor.prototype.loadStep = function(num, time, step) {
	this.steps.push({num:num,time:time,step:step});
};
EnemyActor.prototype.checkStep = function() {
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	for(var i in this.steps) {
		if(curtime > (this.stepCooldown+this.steps[i].time)) {
			this.stepCooldown = GAMEMODEL.gameClock.elapsedMS();
			this.stepNum+=1;

			this.beginStep(this.stepNum,'');

			this.steps.splice(i,1);
			return;
		}
	}
};
EnemyActor.prototype.midStep = function(timeplace,stepnum,step) {
};
EnemyActor.prototype.beginStep = function(stepnum,stepdata) {

};
EnemyActor.prototype.checkShoot = function() {
	var timeLeft = this.shotCooldown + this.coolShot - GAMEMODEL.gameClock.elapsedMS();
	if(timeLeft <= 0)		this.beginShoot();
	if(timeLeft <= 0)		this.shotCooldown = GAMEMODEL.gameClock.elapsedMS();
};
EnemyActor.prototype.beginShoot = function() {

};
EnemyActor.prototype.checkDeath = function() {
	if(this.deathBegin)			return;
};
EnemyActor.prototype.checkEnd = function() {
	if(!this.deathBegin)		return;
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	if(curtime > (this.deathStart+this.deathClock))		this.alive = false;
};
EnemyActor.prototype.beginDeath = function() {
	this.deathStart = GAMEMODEL.gameClock.elapsedMS();
	this.deathBegin = true;
};
EnemyActor.prototype.updateDeath = function() {
};

EnemyActor.prototype.getHeadingAt = function(pt) {
	var P = {x:0,y:0};
	P.x = pt.x - this.absPosition.x;
	P.y = pt.y - this.absPosition.y;
	var d = Math.sqrt(P.x*P.x + P.y*P.y);
	P.x /= d;
	P.y /= d;
	return P;
};
EnemyActor.prototype.collide = function(act) {
	if(typeof act === "undefined")		return;
	if(act  instanceof EnemyActor && act.deathBegin)	return;
	if(act  instanceof ShotActor && act.deathBegin)		return;
	if(this.deathBegin)									return;
	Actor.prototype.collide.call(this,act);
};

EnemyActor.alloc = function() {
	var vc = new EnemyActor();
	vc.init();
	return vc;
};
