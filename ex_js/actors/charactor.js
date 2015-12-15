



function CharActor() {
}
CharActor.prototype = new Actor;
CharActor.prototype.identity = function() {
	return ('CharActor (' +this._dom.id+ ')');
};
CharActor.prototype.init = function() {
	Actor.prototype.init.call(this);
	this.debugMode = 0;

	this.size = {w:24,h:36};
	this.position = {x:0,y:0};

	this.baseOffset = {x:0.5,y:0.35};
	this.actionMode = "MODE_STILL";

	this.maxhealth = 20;
	this.health = this.maxhealth;

	this.drawShift = {x:0,y:0};
	
	this.heading = {x:0,y:0};
	this.unitSpeedX = 0.21;
	this.unitSpeedY = 0.21;
	this.ticksDiff = 0;

	this.focusC = (this.size.w/2)*(this.size.w/2);
	this.focusC = Math.abs(  (this.size.h/2)*(this.size.h/2)  - this.focusC  );
	this.focusC = Math.sqrt(this.focusC);

	this.dirTimeOut = 40;
	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.coolshot = 120;

	this.deathClock = 1200;
	this.deathRadius = (this.size.w/2 + this.size.h/2)/2;
	this.deathStart = GAMEMODEL.gameClock.elapsedMS();
	this.deathBegin = false;

	this.started = false;
	this.startedTime = GAMEMODEL.gameClock.elapsedMS();
	this.startedTicks = 1000;

	this.keyTimeList = [];
	for(var i=0; i<4; i++)	this.keyTimeList[i] = GAMEMODEL.gameClock.elapsedMS();


	this.updatePosition();	
};
CharActor.prototype.draw = function() {

//	Actor.prototype.draw.call(this);

	var c = "#333333";
	if(this.health < 20)	c = "#444444";
	if(this.health < 18)	c = "#555555";
	if(this.health < 16)	c = "#666666";
	if(this.health < 14)	c = "#777777";
	if(this.health < 12)	c = "#888888";
	if(this.health < 10)	c = "#999999";
	if(this.health < 8)		c = "#aaaaaa";
	if(this.health < 6)		c = "#bbbbbb";
	if(this.health < 4)		c = "#cccccc";
	if(this.health < 2)		c = "#dddddd";
	if(!this.deathBegin) {
		GAMEVIEW.drawEllipses(this.absPosition, this.size, {x:0,y:5}, true, 0, c);
	}
	else {
		if(this.deathRadius == 0)	return;
		GAMEVIEW.drawEllipses(this.absPosition, {w:this.deathRadius*5,h:this.deathRadius*2.25}, {x:0,y:0}, true, 0, "#ffff66");
		GAMEVIEW.drawEllipses(this.absPosition, {w:this.deathRadius*3,h:this.deathRadius*2}, {x:0,y:0}, true, 0, "#cccccc");
		GAMEVIEW.drawEllipses(this.absPosition, {w:this.deathRadius*2,h:this.deathRadius*3}, {x:0,y:0}, true, 0, "#dddddd");

		GAMEVIEW.fillCircle(this.absPosition,this.deathRadius*0.6,"#cc0000",1);
		GAMEVIEW.fillCircle(this.absPosition,this.deathRadius*0.45,"#ff6600",1);
		GAMEVIEW.fillCircle(this.absPosition,this.deathRadius*0.3,"#ffcc00",1);

		GAMEVIEW.drawEllipses(this.absPosition, {w:this.deathRadius*2,h:this.deathRadius*3}, {x:0,y:0}, false, 0, "#999999");
		GAMEVIEW.drawEllipses(this.absPosition, {w:this.deathRadius*3,h:this.deathRadius*2}, {x:0,y:0}, false, 0, "#666666");
		GAMEVIEW.drawEllipses(this.absPosition, {w:this.deathRadius*5,h:this.deathRadius*2.25}, {x:0,y:0}, false, 0, "#666666");
		GAMEVIEW.drawCircle(this.absPosition,this.deathRadius,"#666666",1);
		GAMEVIEW.drawCircle(this.absPosition,this.deathRadius*0.6,"#666666",1);
	}
};
CharActor.prototype.update = function() {
	Actor.prototype.update.call(this);
	
	this.checkDeath();
	if(this.deathBegin)		this.updateDeath();
	this.checkEnd();

		var curtime = GAMEMODEL.gameClock.elapsedMS();

	if(!this.started) {
		if( (this.startedTime+this.startedTicks) <= curtime ) {
			this.started = true;
			this.startedTime = GAMEMODEL.gameClock.elapsedMS();
			this.cooldown = this.startedTime;
		}
	}


	this.updateCurrentMode();
	this.updateCurrentAnimation();
	
	var newPos = {x:this.position.x,y:this.position.y};
	if(this.actionMode === "MODE_MOVING")
	{
		newPos.x += this.heading.x*this.unitSpeedX*this.ticksDiff;
		newPos.y += this.heading.y*this.unitSpeedY*this.ticksDiff;
	}
//	newPos.y -= this.speedUpwards*this.ticksDiff;
	this.updatePosition(newPos);


	if(this.started && !this.deathBegin) {
		if(this.cooldown < (curtime+this.coolshot) ) {
			this.cooldown += this.coolshot;
			this.shoot();
		}
	}

	
//	if(this.animateModule != null)	this.animateModule.update();
};
CharActor.prototype.updateCurrentMode = function() {

	var keyids = GAMECONTROL.keyIDs;
	var R = (GAMECONTROL.getKeyState(keyids['KEY_ARROW_RIGHT']) || GAMECONTROL.getKeyState(keyids['KEY_D']));
	var L = (GAMECONTROL.getKeyState(keyids['KEY_ARROW_LEFT']) || GAMECONTROL.getKeyState(keyids['KEY_A']));
	var U = (GAMECONTROL.getKeyState(keyids['KEY_ARROW_UP']) || GAMECONTROL.getKeyState(keyids['KEY_W']));
	var D = (GAMECONTROL.getKeyState(keyids['KEY_ARROW_DOWN']) || GAMECONTROL.getKeyState(keyids['KEY_S']));

	if(this.deathBegin)					return;

	if( !D && !U )					this.heading.y = 0;
	else if ( D && U ) {
		if( this.keyTimeList[0] < this.keyTimeList[2]  )		U = false;
		else if( this.keyTimeList[0] > this.keyTimeList[2]  )	D = false;
	}
	if( !R && !L )						this.heading.x = 0;
	else if ( R && L ) {
		if( this.keyTimeList[1] < this.keyTimeList[3]  )		R = false;
		else if( this.keyTimeList[1] > this.keyTimeList[3]  )	L = false;
	}

	if (D)								this.heading.y = 1;	
	else if (U)							this.heading.y = -1;	
	if (R)							this.heading.x = 1;	
	else if (L)							this.heading.x = -1;	

	if(this.actionMode == "MODE_STILL" || this.actionMode == "MODE_MOVING")
	{
		if(this.heading.x == 0 && this.heading.y == 0)	this.actionMode = "MODE_STILL";
		if(this.heading.x != 0 || this.heading.y != 0)	this.actionMode = "MODE_MOVING";
	}
};
CharActor.prototype.updateCurrentAnimation = function() {
};
CharActor.prototype.shoot = function() {
				if(this.debugMode==1)	return;
	var rock = PlayerShotActor.alloc();
	rock.updatePosition(this.position);
	rock.heading.x=0;
	rock.heading.y=-1;
	rock.shiftPosition({x:rock.heading.x*this.size.w/2,y:rock.heading.y*this.size.h/2});
	rock.firer=this;

    GAMEMODEL.gameSession.gameWorld.addActor(rock,'playerbullet');

	if(GAMEVIEW.BoxIsInCamera(this.absBox)) {
		var r=0.9+ 0.3*Math.random();
		var v=0.55+ 0.1*Math.random();
//		if(Math.random() > 0.6)		this.playSound(4,v,r);
	}
};
CharActor.prototype.checkDeath = function() {
	if(this.debugMode==1)		return;
	if(this.deathBegin)			return;
	if(this.health < 0)			this.beginDeath();
};
CharActor.prototype.checkEnd = function() {
	if(!this.deathBegin)		return;
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	if(curtime > (this.deathStart+this.deathClock))	{
		this.alive = false;
		GAMEMODEL.endGame();
	}
};
CharActor.prototype.beginDeath = function() {
	this.deathStart = GAMEMODEL.gameClock.elapsedMS();
	this.deathBegin = true;
	if(GAMEVIEW.BoxIsInCamera(this.absBox))
	{
		var r =	0.9 + 0.3 * Math.random();
		var v = 1.45 + 0.1 * Math.random();

		this.playSound(2, v, r);
	}

};
CharActor.prototype.updateDeath = function() {
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	var deathDiff = (curtime - this.deathStart)/this.deathClock;

	this.deathRadius = 5 + 50*(deathDiff);
	if( (deathDiff) > 0.5)		this.deathRadius=0;
};

CharActor.prototype.collide = function(act) {
	Actor.prototype.collide.call(this,act);
};
CharActor.prototype.collideType = function(act) {
//	if(act instanceof BlockActor)		return true;
	return false;
};
CharActor.prototype.collideVs = function(act) {
/*	if(act instanceof BlockActor)
	{
		var interBox = GAMEGEOM.BoxIntersection(this.absBox, act.absBox);
		var interCenter = {x:0,y:0};
		interCenter.x = interBox.x + interBox.w/2;
		interCenter.y = interBox.y + interBox.h/2;
		
		var actCenter = {x:0,y:0};
		actCenter.x = act.absBox.x + act.absBox.w/2;
		actCenter.y = act.absBox.y + act.absBox.h/2;
	}	/**/
};


CharActor.prototype.readInput = function(inputobj)
{
	var keyused = false;
	var keyids = GAMECONTROL.keyIDs;
	if(keyids['KEY_1'] == inputobj.keyID) {
//		if(inputobj.keypress == false)		this.debugMode = 0;
	}
	if(keyids['KEY_2'] == inputobj.keyID) {
//		if(inputobj.keypress == false)		this.debugMode = 1;
	}
	if(keyids['KEY_3'] == inputobj.keyID) {
//		if(inputobj.keypress == false)		this.debugMode = 2;
	}
	if(keyids['KEY_ARROW_UP'] == inputobj.keyID || keyids['KEY_W'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == true)
		{
			this.keyTimeList[0] = GAMEMODEL.gameClock.elapsedMS();
		}
	}
	if(keyids['KEY_ARROW_DOWN'] == inputobj.keyID || keyids['KEY_S'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == true)
		{
			this.keyTimeList[2] = GAMEMODEL.gameClock.elapsedMS();
		}
	}
	if(keyids['KEY_ARROW_RIGHT'] == inputobj.keyID || keyids['KEY_D'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == true)
		{
			this.keyTimeList[1] = GAMEMODEL.gameClock.elapsedMS();
		}
	}
	if(keyids['KEY_ARROW_LEFT'] == inputobj.keyID || keyids['KEY_A'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == true)
		{
			this.keyTimeList[3] = GAMEMODEL.gameClock.elapsedMS();
		}
	}
	return keyused;
};

CharActor.alloc = function() {
	var vc = new CharActor();
	vc.init();
	return vc;
};

