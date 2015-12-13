


function GameWorld() {
}
GameWorld.prototype = new WorldActor;
GameWorld.prototype.identity = function() {
	return ('GameWorld (' +this._dom.id+ ')');
};

GameWorld.prototype.init = function() {
	WorldActor.prototype.init.call(this);
	
    this.size = {w:800,h:10000};
    this.updatePosition({x:(this.size.w/2),y:(this.size.h/2)});
	
    this.dropper = null;
    this.camField = null;

    this.gameBullets = [];

    this.borderBlock = "NESW";
};

GameWorld.prototype.clear = function() {
    WorldActor.prototype.clear.call(this);
        
    for(var i in this.gameBullets)
    {
        this.gameBullets[i].clear();
        this.gameBullets.splice(i,1);
    }
    this.gameBullets = {};    
};
GameWorld.prototype.load = function() {

    
//	this.gamePlayer = GameChar.alloc();
//	this.gamePlayer.updatePosition( GAMEVIEW.screen.w/2, GAMEVIEW.screen.h/2 );

//    this.gameActors[0] = OctActor.alloc();
//    this.gameActors[0].updatePosition( GAMEVIEW.screen.w/2-30, GAMEVIEW.screen.h/2-60 );


};
GameWorld.prototype.addActor = function(act,type) {
    var c=0;
    if(type === "bullet") {
        this.gameBullets.push(act);
    }
    else        WorldActor.prototype.addActor.call(this,act,type);
};
GameWorld.prototype.update = function() {
    WorldActor.prototype.update.call(this);

    GAMEMODEL.activeObjs = 0;
    for(var i in this.gameActors) {
        if(this.gameActors[i].alive) {
            GAMEMODEL.activeObjs+=1;
        }
    }
    for(var i in this.gameBullets) {
        if(this.gameBullets[i].alive) {
            GAMEMODEL.activeObjs+=1;
        }
    }
};
GameWorld.prototype.draw = function() {

//    WorldActor.prototype.draw.call(this);

    var frame = GAMEANIMATIONS.getAnimationFrame(2, 0, 2);
    var tilesize = {w:16,h:16};
    var tileset = {w:0,h:0};
    tileset.w = Math.ceil(this.size.w / tilesize.w);
    tileset.h = Math.ceil(this.size.h / tilesize.h);
    for(var j=0; j<tileset.h; j++)
    {
        for(var i=0; i<tileset.w; i++)
        {
            var newpos = {x:0,y:0};
            newpos.x = tilesize.w* (0.5+ i) + this.absBox.x;
            newpos.y = tilesize.h* (0.5+ j) + this.absBox.y;
//            GAMEVIEW.drawFromAnimationFrame(frame, newpos, {x:0,y:0}, {x:0,y:0}, 0, null);
        }
    }

    GAMEVIEW.drawBox(this.absBox, "black");     /**/
};


GameWorld.prototype.updateAll = function() {
    this.cleanAll();
    WorldActor.prototype.updateAll.call(this);

    for(var i in this.gameBullets)
    {
        if(this.gameBullets[i] instanceof Actor)  this.gameBullets[i].update();
    }
};

GameWorld.prototype.drawAll = function() {

//    GAMEVIEW.context.fillStyle = "#CCCCCC";
//    GAMEVIEW.context.fillRect( 0, 0, GAMEVIEW.screen.w, GAMEVIEW.screen.h );
    var frame = GAMEANIMATIONS.getAnimationFrame(2, 0, 2);
    var camera = GAMEMODEL.gameCamera;


/*
    var tilesize = {w:16,h:16};
    var tileset = {w:0,h:0};
    tileset.w = Math.ceil(this.size.w / tilesize.w);
    tileset.h = Math.ceil(this.size.h / tilesize.h);
    for(var j=0; j<tileset.h; j++)
    {
        for(var i=0; i<tileset.w; i++)
        {
            var newpos = {x:0,y:0};
            newpos.x = tilesize.w* (0.5+ i);
            newpos.y = tilesize.h* (0.5+ j);
            GAMEVIEW.drawFromAnimationFrame(frame, {x:0,y:0}, newpos, {x:0,y:0}, 0, null);
        }
    }   /**/


    for(var i in this.gameBullets)
    {
            this.gameBullets[i].draw();
    }
    for(var i in this.gameActors)
    {
            this.gameActors[i].draw();
    }
    for(var i in this.gameArtbits)
    {
            this.gameArtbits[i].draw();
    }

    if(this.gamePlayer != null)     this.gamePlayer.draw();
    this.draw();
};



GameWorld.prototype.readInput = function(kInput) {
    var used = false;
    return used;
};


GameWorld.prototype.cleanAll = function() {

        for(var i in this.gameBullets)
        {
                if(this.gameBullets[i] instanceof Actor && this.gameBullets[i].alive == false)
                {
//                        this.gameActors[i].clear();
                        this.gameBullets.splice(i,1);
                }
        }   
        for(var i in this.gameActors)
        {
                if(this.gameActors[i] instanceof Actor && this.gameActors[i].alive == false)
                {
//                        this.gameActors[i].clear();
                        this.gameActors.splice(i,1);
                }
        }	
        for(var i in this.gameArtbits)
        {
                if(this.gameArtbits[i] instanceof Actor && this.gameArtbits[i].alive == false)
                {
//                        this.gameArtbits[i].clear();
                        this.gameArtbits[i];
                }
        }	

};
GameWorld.prototype.collideWorld = function() {
};
GameWorld.prototype.collideAll = function() {
    WorldActor.prototype.collideAll.call(this);

    for(var i in this.gameBullets)
    {
        if(this.gameBullets[i] instanceof Actor && this.gameBullets[i].alive)
        {
            this.gamePlayer.collide( this.gameBullets[i] );
            this.gameBullets[i].collide( this.gamePlayer );
        }
    
        for(var j in this.gameActors)
        {
            if(this.gameActors[j] instanceof Actor && this.gameBullets[i] != this.gameActors[j])
            {
                this.gameActors[j].collide( this.gameBullets[i] );
                this.gameBullets[i].collide( this.gameActors[j] );
            }
        }  
    }
};
GameWorld.prototype.collide = function(act) {
    if(typeof act === "undefined")      return;
    if( !this.alive || !act.alive )             return;
    if(  this.collideType(act) != true  )                           return;
    if(  GAMEGEOM.BoxContains(this.absBox, act.absBox)==false  )   
    {
        this.collideVs(act);
    }
};
GameWorld.prototype.collideType = function(act) {
//    if(act instanceof CharActor)     return true;
    return false;
};

GameWorld.prototype.collideVs = function( actor ) {
    if(actor instanceof CamField)   return;
    if(actor instanceof RockActor) {
        actor.alive = false;
        return;
    }

    var shiftpos = {x:0,y:0};
    if( actor.absBox.y < this.absBox.y && this.borderBlock.indexOf("N") !== -1)
    {
        shiftpos.y = this.absBox.y - actor.absBox.y;
    }
    if( this.borderBlock.indexOf("E") !== -1 )
    {
        var ptC = this.absBox.x + this.absBox.w;
        var ptactC = actor.absBox.x + actor.absBox.w;
        if(ptactC > ptC)                shiftpos.x = ptC - ptactC;
    }
    if( this.borderBlock.indexOf("S") !== -1 )
    {
        var ptD = this.absBox.y + this.absBox.h;
        var ptactD = actor.absBox.y + actor.absBox.h;
        if(ptactD > ptD)                shiftpos.y = ptD - ptactD;
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
        if(actor instanceof RockActor)      actor.alive=false;
    }
};



GameWorld.alloc = function() {
	var vc = new GameWorld();
	vc.init();
	return vc;
}