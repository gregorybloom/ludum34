




function Actor() {
}
/*	Actor.prototype = new Module;
/**/
Actor.prototype.identity = function() {
	return ('Actor (?)');
};



Actor.prototype.init = function() {
/*	Module.prototype.init.call(this);
/**/	
	this.alive = true;
	this.size = {w:0,h:0};

	this.parent = null;

	this.baseOffset = {x:0.5,y:0.5};
	this.anchorOffset = {x:0.5,y:0.5};

	this.position = {x:0,y:0};
	this.absPosition = {x:0,y:0};

	this.box = {x:0,y:0,w:0,h:0};
	this.absBox = {x:0,y:0,w:0,h:0};
	
	this.actionMode = null;
	this.playingSounds = {};

	this.lastUpdateTicks = GAMEMODEL.gameClock.elapsedMS();
	this.thisUpdateTicks = GAMEMODEL.gameClock.elapsedMS();
	this.ticksDiff = 0;
	
	this.moveModule = null;
	this.animateModule = null;
	this.ranID = Math.floor(Math.random()*10000);
};


Actor.prototype.update = function() {
	if(!this.alive)		return;
	if(this.animateModule != null)	this.animateModule.update();
	
	this.lastUpdateTicks = this.thisUpdateTicks;
	this.thisUpdateTicks = GAMEMODEL.gameClock.elapsedMS();
	this.ticksDiff = this.thisUpdateTicks - this.lastUpdateTicks;
	
	this.updatePosition();
};
Actor.prototype.draw = function() {
	if(!this.alive)		return;
//	GAMEVIEW.drawBox(this.absBox);

	if(this.animateModule != null)	this.animateModule.draw();
};
Actor.prototype.clear = function() {
	if(this.animateModule)			this.animateModule.clear();
	if(this.moveModule)				this.moveModule.clear();
	this.animateModule = null;
	this.moveModule = null;
};
Actor.prototype.collide = function(act) {
	if(typeof act === "undefined")		return;
	if( !this.alive || !act.alive )				return;
	if(  this.collideType(act) != true  )							return;
	if(  GAMEGEOM.BoxIntersects(this.absBox, act.absBox)==true  )	
	{
		this.collideVs(act);
	}
};
Actor.prototype.collideType = function(act) {
	
};
Actor.prototype.collideVs = function(act) {
	
};
Actor.prototype.playSound = function(type,vol,rate) {

	if(this.playingSounds[type] == null || typeof this.playingSounds[type] === "undefined") {

		this.playingSounds[type]={};

		var source = GAMESOUNDS.makeSource(type,vol);
		if(source == null)		delete this.playingSounds[type];
		if(source == null)		return;
		source.playbackRate.value = rate;
		this.playingSounds[type].source = source;
		this.playingSounds[type].time = GAMEMODEL.gameClock.elapsedMS();
		var ctx = this;
		source.onended = function() {
			delete ctx.playingSounds[type];
		};
		source.start(0);
	}
};





Actor.prototype.getAbsoluteShift = function() {
	var absShift = null;
	if(this.parent instanceof Actor)	absShift = this.parent.getAbsoluteShift();
	else 								absShift = {x:0,y:0};

	absShift.x += (this.anchorOffset.x-this.baseOffset.x) * this.size.w;
	absShift.y += (this.anchorOffset.y-this.baseOffset.y) * this.size.h;
	absShift.x += this.position.x;
	absShift.y += this.position.y;

	return absShift;
};
Actor.prototype.shiftPosition = function(shiftPos) {
	var P = {x:0,y:0};
	P.x = this.position.x+shiftPos.x;
	P.y = this.position.y+shiftPos.y;
	this.updatePosition(P);
};
Actor.prototype.updatePosition = function(newPos) {
	if(typeof newPos === "undefined")	newPos = this.position;
	var posShift = {};
	posShift.x = newPos.x + this.position.x;
	posShift.y = newPos.y + this.position.y;
	
	var offset = {};
	offset.x = this.baseOffset.x * this.size.w;
	offset.y = this.baseOffset.y * this.size.h;
	this.box.x = newPos.x - offset.x;
	this.box.y = newPos.y - offset.y;
	this.box.w = this.size.w;
	this.box.h = this.size.h;
	
	if(this.parent instanceof Actor) {
		var absShift = this.parent.getAbsoluteShift();
		this.absPosition.x = newPos.x + absShift.x;
		this.absPosition.y = newPos.y + absShift.y;
	} else {
		this.absPosition.x = newPos.x;
		this.absPosition.y = newPos.y;		
	}

	this.absBox.x = this.absPosition.x - offset.x;
	this.absBox.y = this.absPosition.y - offset.y;
	this.absBox.w = this.size.w;
	this.absBox.h = this.size.h;
	
	this.position.x = newPos.x;
	this.position.y = newPos.y;
};

Actor.alloc = function() {
	var vc = new Actor();
	vc.init();
	return vc;
};


