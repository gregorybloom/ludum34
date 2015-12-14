


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
    this.playerBullets = [];

    this.borderBlock = "NESW";
};

GameWorld.prototype.clear = function() {
    WorldActor.prototype.clear.call(this);
        
    for(var i in this.gameBullets)
    {
        this.gameBullets[i].clear();
        this.gameBullets.splice(i,1);
    }
    for(var i in this.playerBullets)
    {
        this.playerBullets[i].clear();
        this.playerBullets.splice(i,1);
    }
    this.gameBullets = {};    
    this.playerBullets = {};    
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
    else if(type === "playerbullet") {
        this.playerBullets.push(act);
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
    for(var i in this.playerBullets) {
        if(this.playerBullets[i].alive) {
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
    for(var i in this.playerBullets)
    {
        if(this.playerBullets[i] instanceof Actor)  this.playerBullets[i].update();
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
    for(var i in this.playerBullets)
    {
            this.playerBullets[i].draw();
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
                        this.gameBullets.splice(i,1);
                }
        }   
        for(var i in this.playerBullets)
        {
                if(this.playerBullets[i] instanceof Actor && this.playerBullets[i].alive == false)
                {
                        this.playerBullets.splice(i,1);
                }
        }   
        for(var i in this.gameActors)
        {
                if(this.gameActors[i] instanceof Actor && this.gameActors[i].alive == false)
                {
                        this.gameActors.splice(i,1);
                }
        }	
        for(var i in this.gameArtbits)
        {
                if(this.gameArtbits[i] instanceof Actor && this.gameArtbits[i].alive == false)
                {
                        this.gameArtbits.splice(i,1);
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

            this.camField.collide( this.gameBullets[i] );
            this.gameBullets[i].collide( this.camField );
        }
    }  
    for(var i in this.playerBullets)
    {
        for(var j in this.gameActors)
        {
            if(this.gameActors[j] instanceof Actor && this.playerBullets[i] != this.gameActors[j])
            {
                this.gameActors[j].collide( this.playerBullets[i] );
                this.playerBullets[i].collide( this.gameActors[j] );
            }
        }  
    }
};

GameWorld.alloc = function() {
	var vc = new GameWorld();
	vc.init();
	return vc;
}