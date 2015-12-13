
//	NOT IN USE

function GameArea() {
}
GameArea.prototype = new AreaActor;
GameArea.prototype.identity = function() {
	return ('GameArea (' +this._dom.id+ ')');
};
GameArea.prototype.init = function() {
	AreaActor.prototype.init.call(this);
													console.log('x');
    this.size = {w:1000,h:1000};
    this.updatePosition();
};

GameArea.prototype.update = function() {
	AreaActor.prototype.update.call(this);
};
GameArea.prototype.draw = function() {
	var frame = GAMEANIMATIONS.getAnimationFrame(2, 0, 2);
	var tilesize = {w:16,h:16};
	var tileset = {w:0,h:0};
	tileset.w = Math.ceil(this.size.w / tilesize.w);
	tileset.h = Math.ceil(this.size.h / tilesize.h);
/*	for(var j=0; j<tileset.h; j++)
	{
		for(var i=0; i<tileset.w; i++)
		{
			var newpos = {x:0,y:0};
			newpos.x = tilesize.w* (0.5+ i);
			newpos.y = tilesize.h* (0.5+ j);
			GAMEVIEW.drawFromAnimationFrame(frame, {x:0,y:0}, newpos, {x:0,y:0}, 0, null);
		}
	}
	GAMEVIEW.drawBox(this.absBox, "black");	
	/**/

//	AreaActor.prototype.draw.call(this);
};

GameArea.prototype.collide = function() {
	for(var i in this.activeActors)
	{
		this.collideVs( this.activeActors[i] );
	}


	AreaActor.prototype.collide.call(this);

};


GameArea.prototype.collideVs = function( actor ) {
	var shiftpos = {x:0,y:0};
	if( actor.absBox.y < this.absBox.y && this.borderBlock.indexOf("N") !== -1)
	{
		shiftpos.y = this.absBox.y - actor.absBox.y;
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
		shiftpos.x = shiftpos.x + actor.position.x;
		shiftpos.y = shiftpos.y + actor.position.y;
	
		actor.updatePosition(shiftpos);
		if(actor instanceof RockActor)		actor.alive=false;
	}
};




GameArea.alloc = function() {
	var vc = new GameArea();
	vc.init();
	return vc;
};

