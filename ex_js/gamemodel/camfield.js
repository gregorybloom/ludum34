
//	NOT IN USE

function CamField() {
}
CamField.prototype = new Actor;
CamField.prototype.identity = function() {
	return ('CamField (' +this._dom.id+ ')');
};
CamField.prototype.init = function() {
	Actor.prototype.init.call(this);

    this.size = {w:800,h:600};
    this.border = 75;
    this.updatePosition({x:0,y:0});

    this.borderBlock = "NESW";

    this.speedUp = 0.03;
    this.player = null;
};

CamField.prototype.update = function() {
	Actor.prototype.update.call(this);
	this.position.y -= this.speedUp*this.ticksDiff;
	this.updatePosition();

	var player = GAMEMODEL.gameSession.gamePlayer;

	player.shiftPosition({x:0,y:-(this.speedUp*this.ticksDiff)});

	GAMEMODEL.gameCamera.updatePosition(this.position);
	if(GAMEMODEL.gameSession.gameCamera instanceof Actor) {
		GAMEMODEL.gameSession.gameCamera.updatePosition(this.position);
	}
};
CamField.prototype.draw = function() {
//    GAMEVIEW.drawBox(this.absBox, "black");
};

CamField.prototype.collide = function(act) {
    if(typeof act === "undefined")      return;
    if( !this.alive || !act.alive )             return;
    if(  this.collideType(act) != true  )                           return;
    if(  GAMEGEOM.BoxContains(this.absBox, act.absBox)==false  )   
    {
        this.collideVs(act);
    }
};

CamField.prototype.collideType = function(act) {
	if(act instanceof CharActor)	return true;
	if(act instanceof ShotActor)	return true;
	if(act instanceof BulletActor)	return true;
	if(act instanceof PlayerShotActor)	return true;
	return false;
};
CamField.prototype.collideVs = function( actor ) {
    if(actor instanceof PlayerShotActor) {
		if( actor.absBox.y < this.absBox.y && this.borderBlock.indexOf("N") !== -1)
		{
			actor.alive = false;
		}
	}
    if(actor instanceof BulletActor) {
		if( this.borderBlock.indexOf("S") !== -1 )
		{
			var ptD = this.absBox.y + this.absBox.h;
			var ptactD = actor.absBox.y + actor.absBox.h;
			if(actor.deadLength)		ptactD -= actor.deadLength;
			if(ptactD > ptD)			actor.alive = false;
		}
	}
    if(actor instanceof CharActor && (GAMEGEOM.BoxContains(this.absBox, actor.absBox)==false)) {
    	if(actor.deathBegin)			return;
		var shiftpos = {x:0,y:0};
		if( actor.absBox.y < this.absBox.y && this.borderBlock.indexOf("N") !== -1)
		{
			var ptA = this.absBox.y;
			var ptactA = actor.absBox.y;
			if(ptactA < ptA)				shiftpos.y = ptA - ptactA;	
		}
		if( this.borderBlock.indexOf("E") !== -1 )
		{
			var ptC = this.absBox.x + this.absBox.w;
			var ptactC = actor.absBox.x + actor.absBox.w;
			if(ptactC > ptC)				shiftpos.x = ptC - ptactC;
		}
		if( this.borderBlock.indexOf("S") !== -1 )
		{
			var ptD = this.absBox.y + this.absBox.h;
			var ptactD = actor.absBox.y + actor.absBox.h;
			if(ptactD > ptD)				shiftpos.y = ptD - ptactD;
		}
		if( actor.absBox.x < this.absBox.x && this.borderBlock.indexOf("W") !== -1 )
		{
			shiftpos.x = this.absBox.x - actor.absBox.x;
		}

		if(shiftpos.x != 0 || shiftpos.y != 0)
		{	
			actor.shiftPosition(shiftpos);
		}
	}
};




CamField.alloc = function() {
	var vc = new CamField();
	vc.init();
	return vc;
};

