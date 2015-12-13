GAMEVIEW.drawAll = function()
{
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect( 0, 0, this.screen.w, this.screen.h );
    
    if(GAMEMODEL.gameMode !== "GAME_INIT")      GAMEMODEL.drawAll();

    GAMEVIEW.drawCircle({x:200,y:49500},15,"#9900ff",2);
    
    var fps = 1000 / this.avgTick;
    fps = Math.floor( fps );
    
    if(GAMEMODEL.gameMode === "GAME_MUSICPAUSE" || GAMEMODEL.gameMode === "GAME_INIT")
    {
        this.context.fillStyle = "rgba(155,155,255,0.35)";
        this.context.fillRect( 0, 0, this.screen.w, this.screen.h );

        var ScreenPt = {x:10,y:555};
        var str = "MUSIC LOADING...";
        this.context.lineWidth = "3";
        this.context.strokeStyle = "#FFFFFF";
        this.context.strokeText(str,ScreenPt.x,ScreenPt.y);
        this.context.font = "10pt Arial";
        this.context.fillStyle = "#000000";
        this.context.fillText(str,ScreenPt.x,ScreenPt.y);
    }
    else if(GAMEMODEL.gameMode === "GAME_PAUSE")
    {
        this.context.fillStyle = "rgba(255,255,255,0.35)";
        this.context.fillRect( 0, 0, this.screen.w, this.screen.h );

        var ScreenPt = {x:10,y:555};
        var str = "GAME PAUSED";
        this.context.lineWidth = "3";
        this.context.strokeStyle = "#FFFFFF";
        this.context.strokeText(str,ScreenPt.x,ScreenPt.y);
        this.context.font = "10pt Arial";
        this.context.fillStyle = "#000000";
        this.context.fillText(str,ScreenPt.x,ScreenPt.y);
    }
    
    var ScreenPt = {x:10,y:570};
    this.context.lineWidth = "3";
    this.context.strokeStyle = "#FFFFFF";
    this.context.strokeText(fps+" fps",ScreenPt.x,ScreenPt.y);
    this.context.font = "10pt Arial";
    this.context.fillStyle = "#000000";
    this.context.fillText(fps+" fps",ScreenPt.x,ScreenPt.y);

    var ScreenPt = {x:10,y:585};
    var str = GAMEMODEL.activeObjs+" active objs";
    this.context.lineWidth = "3";
    this.context.strokeStyle = "#FFFFFF";
    this.context.strokeText(str,ScreenPt.x,ScreenPt.y);
    this.context.font = "10pt Arial";
    this.context.fillStyle = "#000000";
    this.context.fillText(str,ScreenPt.x,ScreenPt.y);

    var ScreenPt = {x:160,y:585};
    var str = "";
    if(GAMEMODEL.gameSession != null)   str=Math.floor(GAMEMODEL.gameSession.gameWorld.dropper.progress)+" progress";
    this.context.lineWidth = "3";
    this.context.strokeStyle = "#FFFFFF";
    this.context.strokeText(str,ScreenPt.x,ScreenPt.y);
    this.context.font = "10pt Arial";
    this.context.fillStyle = "#000000";
    this.context.fillText(str,ScreenPt.x,ScreenPt.y);

};
GAMEMODEL.update = function() {
    if(this.gameCamera != null && this.gameCamera.target instanceof Actor) {

        this.gameCamera.updatePosition( this.gameCamera.target.position );
    }
};
GAMEMODEL.readInput = function(inputobj)
{
    if(this.gameCamera != null)
    {
        var keyids = GAMECONTROL.keyIDs;    

        if(keyids['KEY_DASH'] == inputobj.keyID)
        {
            keyused = true;
            if(!inputobj.keypress)      this.gameCamera.zoomOut();
        }
        if(keyids['KEY_EQUALS'] == inputobj.keyID)
        {
            keyused = true;
            if(!inputobj.keypress)      this.gameCamera.zoomIn();           
        }

        if(keyids['KEY_O'] == inputobj.keyID)
        {
            keyused = true;
            if(!inputobj.keypress)      GAMEMUSIC.toggleAudio();            
        }
        if(keyids['KEY_N'] == inputobj.keyID)
        {
            keyused = true;
            if(!inputobj.keypress)      GAMEMUSIC.nextAudio();          
        }
        if(keyids['KEY_SQUAREBR_RIGHT'] == inputobj.keyID)
        {
            keyused = true;
            if(!inputobj.keypress)      GAMEMUSIC.volumeUp();           
        }
        if(keyids['KEY_SQUAREBR_LEFT'] == inputobj.keyID)
        {
            keyused = true;
            if(!inputobj.keypress)      GAMEMUSIC.volumeDown();         
        }        
        if(keyids['KEY_M'] == inputobj.keyID)
        {
            keyused = true;
            if(!inputobj.keypress)      
            {
                if(GAMEMUSIC.mute)    GAMEMUSIC.mute=false;
                else {
                    GAMEMUSIC.mute=true;
                    var player = GAMEMODEL.gameSession.gamePlayer;
                    for(var i=0; i<10;i++) {
                        if(typeof player.playingSounds[i] !== "undefined") {
                //          console.log('this '+this.speed+' num '+num+' i '+i +' newsound '+newsound);
                            if(player.playingSounds[i].source)        player.playingSounds[i].source.stop();
                            delete player.playingSounds[i];
                        }
                    }   
                }
            }
        }

        if(keyids['KEY_P'] == inputobj.keyID)
        {
            keyused = true;
            if(!inputobj.keypress)      
            {
                GAMEMODEL.togglePause();

                if(GAMEMUSIC.musicOn)
                {
                    if(this.gameMode === "GAME_PAUSE" && GAMEMUSIC.playing)     GAMEMUSIC.pauseAudio();
                    else if(this.gameMode === "GAME_RUN" && !GAMEMUSIC.playing) GAMEMUSIC.pauseAudio();
                }

            }
        }
    }
};


GAMEMODEL.loadGame = function()
{
    GAMEMODEL.activeObjs = 0;


    this.gameSession.gameWorld = GameWorld.alloc();
    var GW = this.gameSession.gameWorld;
    this.gameSession.gameWorld.load();
    this.gameSession.gameWorld.size = {w:800,h:50000};
    this.gameSession.gameWorld.updatePosition({x:(GW.size.w/2),y:(GW.size.h/2)});

/*
    var Tx0 = TextActor.alloc();
    Tx0.fontSize = 28;
    Tx0.text = "YOU ARE THE TRUCK";
    Tx0.updatePosition({x:550,y:50});
    this.gameSession.gameWorld.addActor(Tx0,'act');
/**/
    
    var C = CharActor.alloc();
    C.updatePosition({x:400,y:49850});
    this.gameSession.gameWorld.gamePlayer = C;


    var CF = CamField.alloc();
    CF.player = C;
    CF.updatePosition({x:C.position.x,y:(C.position.y-150)});
    this.gameSession.gameWorld.addActor(CF,'act');
    this.gameSession.gameWorld.camField = CF;

    this.gameCamera.updatePosition(CF.position);
    this.gameSession.gameWorld.addActor(C,'act');

    var D = DropperActor.alloc();
    D.target = CF;
    D.updatePosition({x:CF.position.x,y:CF.position.y});
    this.gameSession.gameWorld.addActor(D,'act');
    this.gameSession.gameWorld.dropper = D;


    this.gameSession.gamePlayer = this.gameSession.gameWorld.gamePlayer;

    var actlist = this.gameSession.gameWorld.gameActors;

    var O = null;
/*    O = OctActor.alloc();
    O.updatePosition({x:400,y:49700});
    this.gameSession.gameWorld.addActor(O,'act');
    O.decideOnMove(0);

    O = OctActor.alloc();
    O.updatePosition({x:300,y:49600});
    this.gameSession.gameWorld.addActor(O,'act');
    O.decideOnMove(2);

    O = OctActor.alloc();
    O.updatePosition({x:500,y:49500});
    this.gameSession.gameWorld.addActor(O,'act');
    O.decideOnMove(3);

    for(var i=0; i<20; i++)
    {
        O = OctActor.alloc();
        
            var randX = Math.random()*(this.gameSession.gameWorld.size.w-200) +100;
            var randY = Math.random()*(this.gameSession.gameWorld.size.h-200) +100;

        O.updatePosition({x:randX,y:randY});
        this.gameSession.gameWorld.addActor(O,'act');
    }   /**/

    console.log('loaded game');

//    GAMEMUSIC.playAudio();

    GAMEMODEL.fillDropper(D);
};

GAMEMODEL.fillDropper = function(dropper)
{
    dropper.addLoad(0,0,0,400,250,{type:"SWAYING",data:''});
    dropper.addLoad(0,0,100,400,500,{type:"SWAYING",data:''});
    dropper.addLoad(0,0,100,450,600,{type:"SWAYING",data:''});
    dropper.addLoad(0,0,100,350,700,{type:"SWAYING",data:''});

    for(var i=0; i<50; i++) {
        dropper.addLoad(0,0,200+i*50,100 + Math.random()*600,500+(i+Math.random())*50,{type:"SWAYING",data:''});
    }
/**/

};

