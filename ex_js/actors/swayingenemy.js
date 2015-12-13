

function SwayEnemy() {
}
SwayEnemy.prototype = new EnemyActor;
SwayEnemy.prototype.identity = function() {
	return ('SwayEnemy (' +this._dom.id+ ')');
};
SwayEnemy.prototype.init = function() {
	EnemyActor.prototype.init.call(this);

	this.size = {w:17,h:17};
	this.position = {x:0,y:0};

	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.cooldur = 0;
	this.fired = false;
	
	this.unitSpeed = 0.04;
	
	this.actionMode = "MODE_STILL";
	
	this.updatePosition();

	this.moveModule = MovingActorModule.alloc();
	this.moveModule.target = this;	

	this.setPath(1);
};
SwayEnemy.prototype.loadingData = function(data) {

};
SwayEnemy.prototype.draw = function() {
//	EnemyActor.prototype.draw.call(this);
	GAMEVIEW.drawBox(this.absBox,"#660000");

	GAMEVIEW.drawEqTri(37,this.position, true, 45, "#000000", 1 );
};
SwayEnemy.prototype.update = function() {
	EnemyActor.prototype.update.call(this);
	
	this.updateMode();
	
	if(this.moveModule != null)		this.moveModule.update();
	if(this.animateModule != null)	this.animateModule.update();
};

SwayEnemy.prototype.collideType = function(act) {
	if(act instanceof CharActor)	return true;
	return false;
};
SwayEnemy.prototype.collideVs = function(act) {
	if(act instanceof CharActor)
	{
		var interBox = GAMEGEOM.BoxIntersection(this.absBox, act.absBox);
		var push = {x:interBox.w,y:interBox.h};	
	}
};

SwayEnemy.prototype.setPath = function(type) {
	this.actionMode = "MODE_MOVING";

	var inc = IncrementBySpeed.alloc();	inc.spdPerTick = this.unitSpeed;
	var head = HeadingByVector.alloc();	head.setHeadingByVector({x:0,y:1}, 500000*this.unitSpeed);
	var durt = DurationByTime.alloc();	durt.duration = 500000;
	var lprog = LinearProgress.alloc();
	var lpath = LinearPath.alloc();

	var move = MoveActor.alloc();
	move.movingActor = this;
	move.increment = inc;
	move.heading = head;
	move.duration = durt;
	move.progress = lprog;
	move.path = lpath;
	
	this.moveModule.moveScriptSet[0] = move;
/*
	var inc2 = IncrementBySpeed.alloc();	inc2.spdPerTick = this.unitSpeed;
	var head2 = HeadingByVector.alloc();	head2.setHeadingByVector({x:1,y:0}, 5000*this.unitSpeed);
	var durt2 = DurationByTime.alloc();	durt2.duration = 500000;
	var lprog2 = LinearProgress.alloc();
	var lpath2 = LinearPath.alloc();

	var move2 = MoveActor.alloc();
	move2.movingActor = this;
	move2.increment = inc2;
	move2.heading = head2;
	move2.duration = durt2;
	move2.progress = lprog2;
	move2.path = lpath2;
	
	this.moveModule.moveScriptSet[1] = move2;
/**/
};

SwayEnemy.prototype.updateCurrentAnimation = function() {
};
SwayEnemy.prototype.updateMode = function() {
//	var timeLeft = this.cooldown + this.cooldur - GAMEMODEL.gameClock.elapsedMS();
//	this.shoot();
	
//	if(timeLeft <= 0)		this.decideAction();
};

SwayEnemy.prototype.shoot = function() {
	if(this.fired)		return;
	this.fired = true;

	var rock = RockActor.alloc();
	rock.updatePosition(this.position);
	rock.heading.x=this.lastHeading.x;
	rock.heading.y=this.lastHeading.y;
	rock.direction=this.direction;
	rock.shiftPosition({x:rock.heading.x*this.size.w/2,y:rock.heading.y*this.size.h/2});
	rock.firer=this;

    GAMEMODEL.gameSession.gameWorld.addActor(rock,'act');

	if(GAMEVIEW.BoxIsInCamera(this.absBox)) {
		var r=0.9+ 0.3*Math.random();
		var v=0.55+ 0.1*Math.random();
		if(Math.random() > 0.6)		this.playSound(4,v,r);
	}
};
SwayEnemy.alloc = function() {
	var vc = new SwayEnemy();
	vc.init();
	return vc;
};
