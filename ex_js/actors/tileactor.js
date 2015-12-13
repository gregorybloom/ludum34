



function TileActor() {
}
TileActor.prototype = new Actor;
TileActor.prototype.identity = function() {
	return ('TileActor ()');
};
TileActor.prototype.init = function() {
	Actor.prototype.init.call(this);

	this.size = {w:120,h:35};
	this.position = {x:0,y:0};

	this.actionMode = "MODE_STILL";

	this.tilegroup = 20;
	this.tilesize = {w:25,h:25};
	this.tileset = {};


	this.drawShift = {x:0,y:0};

	this.updatePosition();

	this.animateModule = AnimationModule.alloc();
	this.animateModule.target = this;
	
	this.moveModule = MovingActorModule.alloc();
	this.moveModule.target = this;	
};
TileActor.prototype.setTileGroup = function(num) {
	this.tilegroup = num;
	if(this.tilegroup == 20)		this.tilesize = {w:25,h:25};
};

TileActor.prototype.draw = function() {
//	Actor.prototype.draw.call(this);
//	return;

	var camera = GAMEMODEL.gameCamera;
	if(  GAMEGEOM.BoxIntersects(this.absBox, camera.absBox)==false  )		return;

	var tpos = {x:0,y:0};
	var tsize = this.size;

    var trelstart = {x:0,y:0};
    var trelend = {x:0,y:0};

    var tiledrstart = {i:0,j:0};
    var tiledrend = {i:0,j:0};
    var tdrawpos = {x:0,y:0};

	var camshift = camera.getCameraShift();
	var csize = {w:camera.absBox.w,h:camera.absBox.h};

    var tilesize = this.tilesize;

    tsize.w = Math.ceil(tsize.w / tilesize.w);
    tsize.h = Math.ceil(tsize.h / tilesize.h);
	tpos.x = this.absPosition.x + this.drawShift.x;
	tpos.y = this.absPosition.y + this.drawShift.y;

	trelstart.x = Math.max(0, camshift.x - tpos.x);
	trelstart.y = Math.max(0, camshift.y - tpos.y);
	trelend.x = Math.min(trelstart.x + csize.w, tsize.w);
	trelend.y = Math.min(trelstart.y + csize.h, tsize.h);

	tiledrstart.i = Math.floor(trelstart.x/tilesize.w);
	tiledrstart.j = Math.floor(trelstart.y/tilesize.h);
	tiledrend.i = Math.ceil(trelend.x/tilesize.w);
	tiledrend.j = Math.ceil(trelend.y/tilesize.h);

	tdrawpos.x = tpos.x + 0.5*tilesize.w;
	tdrawpos.y = tpos.y + 0.5*tilesize.h;

	GAMEVIEW.drawFromAnimationFrameTiles(tdrawpos, this.tileset, this.tilegroup, 0, tilesize, tiledrstart, tiledrend);

/*    for(var j=0; j<=tileset.h; j++)
    {
        for(var i=0; i<=tileset.w; i++)
        {
        	if( (imgTx+i)>=Math.floor(this.imgsize.w/this.tilesize.w) ) {
       			n= (imgTx+i) + (imgTy+j-1)*Math.floor(this.imgsize.w/this.tilesize.w);
        	}
        	else       		n= (imgTx+i) + (imgTy+j)*Math.floor(this.imgsize.w/this.tilesize.w);

			frame = GAMEANIMATIONS.getAnimationFrame(this.tilegroup, 0, n);
            newpos.x = Math.ceil	(tilesize.w* (i) + base.x);
            newpos.y = Math.ceil(tilesize.h* (j) + base.y);
//			console.log('x'+JSON.stringify(newpos) );
            GAMEVIEW.drawFromAnimationFrame(frame, {x:0,y:0}, newpos, {x:0,y:0}, 0, null);
//			GAMEVIEW.drawText(newpos,n, "10px Arial","#000000");
        }
    }   /**/
};
TileActor.prototype.update = function() {
	Actor.prototype.update.call(this);
		
};

TileActor.alloc = function() {
	var vc = new TileActor();
	vc.init();
	return vc;
};
