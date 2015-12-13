



function CharActor() {
}
CharActor.prototype = new Actor;
CharActor.prototype.identity = function() {
	return ('CharActor (' +this._dom.id+ ')');
};
CharActor.prototype.init = function() {
	Actor.prototype.init.call(this);

	this.size = {w:24,h:36};
	this.position = {x:0,y:0};

	this.baseOffset = {x:0.5,y:0.35};
	this.actionMode = "MODE_STILL";

	this.drawShift = {x:0,y:0};
	
	this.heading = {x:0,y:0};
	this.unitSpeedX = 0.13;
	this.unitSpeedY = 0.13;
	this.ticksDiff = 0;

	this.dirTimeOut = 40;
	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.coolshot = 200;

	this.keyTimeList = [];
	for(var i=0; i<4; i++)	this.keyTimeList[i] = GAMEMODEL.gameClock.elapsedMS();

	this.updatePosition();	
};
CharActor.prototype.draw = function() {

//	Actor.prototype.draw.call(this);

	GAMEVIEW.drawBox(this.absBox,"#0000ff");
	GAMEVIEW.drawEllipses(this.absPosition, this.size, true, 0, "#333333");
};
CharActor.prototype.update = function() {
	Actor.prototype.update.call(this);
	
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

		var curtime = GAMEMODEL.gameClock.elapsedMS();


	if(this.cooldown < (curtime+this.coolshot) ) {
		this.cooldown += this.coolshot;
		this.shoot();
	}

	
	
//	if(this.animateModule != null)	this.animateModule.update();
};
CharActor.prototype.updateCurrentMode = function() {

	var keyids = GAMECONTROL.keyIDs;
	var R = (GAMECONTROL.getKeyState(keyids['KEY_ARROW_RIGHT']) || GAMECONTROL.getKeyState(keyids['KEY_D']));
	var L = (GAMECONTROL.getKeyState(keyids['KEY_ARROW_LEFT']) || GAMECONTROL.getKeyState(keyids['KEY_A']));
	var U = (GAMECONTROL.getKeyState(keyids['KEY_ARROW_UP']) || GAMECONTROL.getKeyState(keyids['KEY_W']));
	var D = (GAMECONTROL.getKeyState(keyids['KEY_ARROW_DOWN']) || GAMECONTROL.getKeyState(keyids['KEY_S']));
//	console.log(R +''+ L +''+ U +''+ D);

	if( ( !D && !U ) || ( D && U ) )	this.heading.y = 0;
	else if (D)							this.heading.y = 1;	
	else if (U)							this.heading.y = -1;	
	if( ( !R && !L ) || ( R && L ) )	this.heading.x = 0;
	else if (R)							this.heading.x = 1;	
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
	var rock = RockActor.alloc();
	rock.updatePosition(this.position);
	rock.heading.x=0;
	rock.heading.y=-1;
	rock.direction=0;
	rock.shiftPosition({x:rock.heading.x*this.size.w/2,y:rock.heading.y*this.size.h/2});
	rock.firer=this;

    GAMEMODEL.gameSession.gameWorld.addActor(rock,'act');

	if(GAMEVIEW.BoxIsInCamera(this.absBox)) {
		var r=0.9+ 0.3*Math.random();
		var v=0.55+ 0.1*Math.random();
//		if(Math.random() > 0.6)		this.playSound(4,v,r);
	}
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
	if(keyids['KEY_ARROW_UP'] == inputobj.keyID || keyids['KEY_W'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == false)
		{
//			this.heading.y = 0;
			this.keyTimeList[0] = GAMEMODEL.gameClock.elapsedMS();
		}
		if(inputobj.keypress == true)
		{
//			this.heading.y = -1;
		}
	}
	if(keyids['KEY_ARROW_DOWN'] == inputobj.keyID || keyids['KEY_S'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == false)
		{
//			this.heading.y = 0;
			this.keyTimeList[2] = GAMEMODEL.gameClock.elapsedMS();
		}
		if(inputobj.keypress == true)
		{
//			this.heading.y = 1;
		}
	}
	if(keyids['KEY_ARROW_RIGHT'] == inputobj.keyID || keyids['KEY_D'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == false)
		{
//			this.heading.x = 0;
			this.keyTimeList[1] = GAMEMODEL.gameClock.elapsedMS();
		}
		if(inputobj.keypress == true)
		{
//			this.heading.x = 1;
		}
	}
	if(keyids['KEY_ARROW_LEFT'] == inputobj.keyID || keyids['KEY_A'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == false)
		{
//			this.heading.x = 0;
			this.keyTimeList[3] = GAMEMODEL.gameClock.elapsedMS();
		}
		if(inputobj.keypress == true)
		{
//			this.heading.x = -1;
		}
	}
	return keyused;
};

CharActor.alloc = function() {
	var vc = new CharActor();
	vc.init();
	return vc;
};

