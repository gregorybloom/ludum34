



function OctActor() {
}
OctActor.prototype = new Actor;
OctActor.prototype.identity = function() {
	return ('OctActor (' +this._dom.id+ ')');
};
OctActor.prototype.init = function() {
	Actor.prototype.init.call(this);

	this.size = {w:17,h:17};
	this.position = {x:0,y:0};

	this.heading = {x:0,y:0};
	this.lastHeading = {x:0,y:0};
	
	this.direction = 0;
	this.heading = {x:0,y:0};
	this.lastHeading = {x:0,y:0};
	
	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.cooldur = 0;
	this.fired = false;
	
//	this.unitSpeed = 0.04;
	this.unitSpeed = 0.015;
	
	
	this.actionMode = "MODE_STILL";
	
	this.updatePosition();
	
	this.animateModule = AnimationModule.alloc();
	this.animateModule.target = this;
	this.animateModule.drawCollection = 0;
	this.animateModule.changeToAnimation(0, true);
	
	this.moveModule = MovingActorModule.alloc();
	this.moveModule.target = this;	
};

OctActor.prototype.draw = function() {
	Actor.prototype.draw.call(this);
//	GAMEVIEW.drawBox(this.absBox,"#660000");

	var lvl = 0;
	if(this.actionMode == "MODE_MOVING")			lvl=1;
	else if(this.actionMode == "MODE_STILL")		lvl=2;
	else if(this.actionMode == "MODE_FLINCH")		lvl=3;
	else if(this.actionMode == "MODE_ATTACKING")	lvl=4;

//	GAMEVIEW.drawText(this.absPosition, lvl, "18px Arial","#ffffff");

/*	if(GAMEVIEW.BoxIsInCamera(this.absBox)) {
		GAMEVIEW.drawBox(this.absBox);
	} else {
		GAMEVIEW.drawCircle(this.absPosition,100);		
	}	/**/
};
OctActor.prototype.update = function() {
	Actor.prototype.update.call(this);
	
	this.updateCurrentAnimation();
	this.updateMode();
	
	if(this.moveModule != null)		this.moveModule.update();
	if(this.animateModule != null)	this.animateModule.update();
};

OctActor.prototype.collideType = function(act) {
	if(act instanceof CharActor)	return true;
	if(act instanceof OctActor)		return true;
	return false;
};
OctActor.prototype.collideVs = function(act) {
	if(act instanceof CharActor)
	{
		var interBox = GAMEGEOM.BoxIntersection(this.absBox, act.absBox);
		var push = {x:interBox.w,y:interBox.h};
		
		if(  Math.abs(push.x) >= Math.abs(push.y)  )	push.x = 0;
		else											push.y = 0;
		
		var interCenter = {x:0,y:0};
		interCenter.x = interBox.x + interBox.w/2;
		interCenter.y = interBox.y + interBox.h/2;
		
		var actCenter = {x:0,y:0};
		actCenter.x = act.absBox.x + act.absBox.w/2;
		actCenter.y = act.absBox.y + act.absBox.h/2;
		
		if(interCenter.x > actCenter.x)		push.x = -push.x;
		if(interCenter.y > actCenter.y)		push.y = -push.y;
		
		var balance = {x:0.5,y:-0.5};
		
		act.shiftPosition( {x:balance.x*push.x,y:balance.x*push.y} );
		this.shiftPosition( {x:balance.y*push.x,y:balance.y*push.y} );

		if(act.actionMode == "MODE_MOVING") {
			var pushing=false;
			if((act.heading.x < 0) && (act.facing.x < 0) && (balance.y*push.x) < 0)	pushing=true;
			if((act.heading.y < 0) && (act.facing.y < 0) && (balance.y*push.y) < 0)	pushing=true;
			if((act.heading.x > 0) && (act.facing.x > 0) && (balance.y*push.x) > 0)	pushing=true;
			if((act.heading.y > 0) && (act.facing.y > 0) && (balance.y*push.y) > 0)	pushing=true;
			if(pushing && GAMEVIEW.BoxIsInCamera(act.absBox)) {
//				act.playSound(3,0.4,1);
			}
		}
	}
	else if(act instanceof OctActor)
	{
		var interBox = GAMEGEOM.BoxIntersection(this.absBox, act.absBox);
		var push = {x:interBox.w,y:interBox.h};
		
		var interCenter = {x:0,y:0};
		interCenter.x = interBox.x + interBox.w/2;
		interCenter.y = interBox.y + interBox.h/2;

		var thisCenter = {x:0,y:0};
		thisCenter.x = this.absBox.x + this.absBox.w/2;
		thisCenter.y = this.absBox.y + this.absBox.h/2;

		var collisionDir = 0;
		if(  Math.abs(push.x) >= Math.abs(push.y)  )
		{
			if(interCenter.y < thisCenter.y)		collisionDir = 0;
			else									collisionDir = 2;
		}
		else
		{
			if(interCenter.x < thisCenter.x)		collisionDir = 3;
			else									collisionDir = 1;
		}
		
		if((collisionDir%2) == 0)	push.x = 0;
		else						push.y = 0;
		
		
		var actCenter = {x:0,y:0};
		actCenter.x = act.absBox.x + act.absBox.w/2;
		actCenter.y = act.absBox.y + act.absBox.h/2;
		
		if(interCenter.x > actCenter.x)		push.x = -push.x;
		if(interCenter.y > actCenter.y)		push.y = -push.y;
		
		var balance = {x:0.5,y:-0.5};
		
		act.shiftPosition( {x:balance.x*push.x,y:balance.x*push.y} );
		this.shiftPosition( {x:balance.y*push.x,y:balance.y*push.y} );
		

		collisionDir = (collisionDir+2)%4;
		if(this.actionMode === "MODE_STILL" || this.actionMode === "MODE_MOVING")	
		{
			this.decideOnMove(collisionDir);
		}
		collisionDir = (collisionDir+2)%4;
		if(act.actionMode === "MODE_STILL" || act.actionMode === "MODE_MOVING")	
		{
			act.decideOnMove(collisionDir);
		}
	}
};



OctActor.prototype.updateCurrentAnimation = function() {
	if(this.animateModule == null)	return;
	if(this.lastHeading.x == 0 && this.lastHeading.y == 0)	return;
	
	var dir = -1;
	if(Math.abs(this.lastHeading.x)>=Math.abs(this.lastHeading.y) && this.lastHeading.x>0.0)	dir = 1;
	if(Math.abs(this.lastHeading.x)>=Math.abs(this.lastHeading.y) && this.lastHeading.x<0.0)	dir = 3;
	if(Math.abs(this.lastHeading.x)<Math.abs(this.lastHeading.y) && this.lastHeading.y>0.0)		dir = 2;
	if(Math.abs(this.lastHeading.x)<Math.abs(this.lastHeading.y) && this.lastHeading.y<0.0)		dir = 0;
	if(dir < 0)		return;
	
	if(this.actionMode == "MODE_MOVING")
	{
		this.animateModule.changeToAnimation(dir+4,true);
	}
	else if(this.actionMode == "MODE_STILL")
	{
		this.animateModule.changeToAnimation(dir);
	}
	else if(this.actionMode == "MODE_FLINCH")
	{
		this.animateModule.changeToAnimation(dir);
	}
	else if(this.actionMode == "MODE_ATTACKING")
	{
		this.animateModule.changeToAnimation(dir+8);
	}	
};
OctActor.prototype.updateMode = function() {
	var timeLeft = this.cooldown + this.cooldur - GAMEMODEL.gameClock.elapsedMS();
	if(timeLeft <= 200 && this.actionMode == "MODE_ATTACKING")		this.shoot();
	
	if(timeLeft <= 0)		this.decideAction();
};
OctActor.prototype.decideAction = function() {
	if(this.moveModule != null)		this.moveModule.eraseMovingScripts();
	
	var randSeed = Math.random();
	var randDir = Math.random()*4;

	randDir = Math.floor(randDir);
	if(randDir >= 4)	randDir = 3;
	
//	this.decideOnWait(randDir);
	
	if(this.actionMode == "MODE_STILL")
	{
		if(randSeed < 0.05)			this.decideOnWait(randDir);
		else if(randSeed < 0.25)	this.decideOnAttack(randDir);
		else						this.decideOnMove(randDir);
	}
	else if(this.actionMode == "MODE_MOVING")
	{
		if(randSeed < 0.45)			this.decideOnWait(randDir);
		else if(randSeed < 0.65)	this.decideOnAttack(randDir);
		else						this.decideOnMove(randDir);
	}	/**/	
	else if(this.actionMode == "MODE_ATTACKING")
	{
		if(randSeed < 0.25)			this.decideOnWait(randDir);
		else if(randSeed < 0.35)	this.decideOnAttack(randDir);
		else						this.decideOnMove(randDir);
	}
	
//		console.log(this.actionMode + " " +this.direction);
};

OctActor.prototype.decideOnWait = function(dir) {
	if(GAMEVIEW.BoxIsInCamera(this.absBox)) {
//		var r=0.9+ 0.3*Math.random();
//		var v=0.55+ 0.1*Math.random();
//		if(Math.random() > 0.9)		this.playSound(4,v,r);
	}

	var period = 120*Math.random()+60;
	period = period*10*3;
	
	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.cooldur = period+1;
	
	this.actionMode = "MODE_STILL";
	
	this.direction = dir;
	if(this.direction == 0)			this.heading = {x:0, y:-1};
	else if(this.direction == 1)	this.heading = {x:1, y:0};
	else if(this.direction == 2)	this.heading = {x:0, y:1};
	else if(this.direction == 3)	this.heading = {x:-1, y:0};
	this.lastHeading.x = this.heading.x;
	this.lastHeading.y = this.heading.y;
	this.heading = {x:0,y:0};

/*	if(GAMEVIEW.BoxIsInCamera(this.absBox)) {
		this.playingSounds[]
					    var source = GAMESOUNDS.makeSource(type,vol);
			    source.playbackRate.value = 1 + Math.random() * random2;
			    source.start(time + i * interval + Math.random() * random);

	}	/**/
};
OctActor.prototype.decideOnMove = function(dir) {

	if(GAMEVIEW.BoxIsInCamera(this.absBox)) {
		var r=0.9+ 0.35*Math.random();
		var v=0.25+ 0.05*Math.random();
		if(Math.random() > 0.8)		this.playSound(2,v,r);
	}

	var period = 60*Math.random()+60;
	period = period*10*3;
	
	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.cooldur = period+1;
	
	this.actionMode = "MODE_MOVING";
	
	this.direction = dir;
	if(dir == 0)		this.heading = {x:0, y:-1};
	else if(dir == 1)	this.heading = {x:1, y:0};
	else if(dir == 2)	this.heading = {x:0, y:1};
	else if(dir == 3)	this.heading = {x:-1, y:0};
	this.lastHeading.x = this.heading.x;
	this.lastHeading.y = this.heading.y;
	
	
	var inc = IncrementBySpeed.alloc();	inc.spdPerTick = this.unitSpeed;
	var head = HeadingByVector.alloc();	head.setHeadingByVector(this.heading, period*this.unitSpeed);
	var durt = DurationByTime.alloc();	durt.duration = this.cooldur;
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
};
OctActor.prototype.decideOnAttack = function(dir) {

	var period = 240;
	period = period*3;
	
	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.cooldur = period+1;
	
	this.actionMode = "MODE_ATTACKING";
	
	this.fired=false;
	this.direction = dir;
	if(this.direction == 0)			this.heading = {x:0, y:-1};
	else if(this.direction == 1)	this.heading = {x:1, y:0};
	else if(this.direction == 2)	this.heading = {x:0, y:1};
	else if(this.direction == 3)	this.heading = {x:-1, y:0};
	this.lastHeading.x = this.heading.x;
	this.lastHeading.y = this.heading.y;
	this.heading = {x:0,y:0};

/*	if(GAMEVIEW.BoxIsInCamera(this.absBox)) {
		this.playingSounds[]
					    var source = GAMESOUNDS.makeSource(type,vol);
			    source.playbackRate.value = 1 + Math.random() * random2;
			    source.start(time + i * interval + Math.random() * random);

	}	/**/
};
OctActor.prototype.shoot = function() {
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
//		if(Math.random() > 0.6)		this.playSound(4,v,r);
	}
};
OctActor.alloc = function() {
	var vc = new OctActor();
	vc.init();
	return vc;
};
