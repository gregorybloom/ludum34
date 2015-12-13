



function RockActor() {
}
RockActor.prototype = new Actor;
RockActor.prototype.identity = function() {
	return ('RockActor (' +this._dom.id+ ')');
};
RockActor.prototype.init = function() {
	Actor.prototype.init.call(this);

	this.size = {w:8,h:8};
	this.position = {x:0,y:0};

	this.heading = {x:0,y:0};
	this.lastHeading = {x:0,y:0};
	this.direction = 0;

	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.cooldur = 10000;
	
	this.radius=4;
	this.unitSpeed = 0.15;
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

RockActor.prototype.draw = function() {
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
RockActor.prototype.update = function() {
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

RockActor.prototype.collideType = function(act) {
	if(act == this.firer)		return false;
	if(act instanceof CharActor)	return true;
	if(act instanceof OctActor)		return true;
	return false;
};
RockActor.prototype.collideVs = function(act) {
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
				
		var balance = {x:3.5,y:0};
		
		act.shiftPosition( {x:balance.x*push.x,y:balance.x*push.y} );
		this.alive=false;

		if(GAMEVIEW.BoxIsInCamera(act.absBox)) {
			var r=0.9+ 0.3*Math.random();
			var v=0.55+ 0.1*Math.random();
			act.playSound(6,v,r);
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
		
		var balance = {x:6,y:0};
		
		act.shiftPosition( {x:balance.x*push.x,y:balance.x*push.y} );
		this.alive=false;

		if(GAMEVIEW.BoxIsInCamera(act.absBox)) {
			var r=0.9+ 0.3*Math.random();
			var v=0.55+ 0.1*Math.random();
			act.playSound(5,v,r);
		}
	}
};



RockActor.prototype.updateCurrentAnimation = function() {
//	if(this.animateModule == null)	return;
	if(this.lastHeading.x == 0 && this.lastHeading.y == 0)	return;
	

};
RockActor.prototype.updateMode = function() {
};


RockActor.alloc = function() {
	var vc = new RockActor();
	vc.init();
	return vc;
};
