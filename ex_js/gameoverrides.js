GAMEVIEW.drawAll = function()
{
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect( 0, 0, this.screen.w, this.screen.h );
    
    if(GAMEMODEL.gameMode !== "GAME_INIT")      GAMEMODEL.drawAll();

//    GAMEVIEW.drawCircle({x:200,y:49500},15,"#9900ff",2);
    
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
        this.context.font = "10pt Arial";
        this.context.strokeText(str,ScreenPt.x,ScreenPt.y);
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
        this.context.font = "10pt Arial";
        this.context.strokeText(str,ScreenPt.x,ScreenPt.y);
        this.context.fillStyle = "#000000";
        this.context.fillText(str,ScreenPt.x,ScreenPt.y);
    }
    
    var ScreenPt = {x:710,y:585};
    this.context.lineWidth = "3";
    this.context.strokeStyle = "#FFFFFF";
    this.context.font = "10pt Arial";
    this.context.strokeText(fps+" fps",ScreenPt.x,ScreenPt.y);
    this.context.fillStyle = "#000000";
    this.context.fillText(fps+" fps",ScreenPt.x,ScreenPt.y);

    var ScreenPt = {x:10,y:585};
    var str = GAMEMODEL.playerScore+" pts";
    this.context.lineWidth = "3";
    this.context.strokeStyle = "#FFFFFF";
    this.context.font = "10pt Arial";
    this.context.strokeText(str,ScreenPt.x,ScreenPt.y);
    this.context.fillStyle = "#000000";
    this.context.fillText(str,ScreenPt.x,ScreenPt.y);

    var ScreenPt = {x:110,y:585};
    var str = "";
    if(GAMEMODEL.gameSession != null && GAMEMODEL.gameSession.gameWorld != null)
    {
        str=Math.floor(GAMEMODEL.gameSession.gameWorld.dropper.progress/2)+" progress";
    }
    this.context.lineWidth = "3";
    this.context.strokeStyle = "#FFFFFF";
    this.context.font = "10pt Arial";
    this.context.strokeText(str,ScreenPt.x,ScreenPt.y);
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
//            if(!inputobj.keypress)      this.gameCamera.zoomOut();
        }
        if(keyids['KEY_EQUALS'] == inputobj.keyID)
        {
            keyused = true;
//            if(!inputobj.keypress)      this.gameCamera.zoomIn();           
        }

        if(keyids['KEY_O'] == inputobj.keyID)
        {
            keyused = true;
//            if(!inputobj.keypress)      GAMEMUSIC.toggleAudio();            
        }
        if(keyids['KEY_N'] == inputobj.keyID)
        {
            keyused = true;
//            if(!inputobj.keypress)      GAMEMUSIC.nextAudio();          
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

    console.log('loaded game');


    GAMEMUSIC.currSong=0;
    GAMEMUSIC.playAudio();
    GAMEMODEL.fillDropper(D);
};

GAMEMODEL.fillDropper = function(dropper)
{
    dropper.addLoad(0,0,0,50,850,{type:"TEXT",data:{loadout:0,text:"CIRCLES IN THE CLOUDS",fsize:44}});
    dropper.addLoad(0,0,200,50,850,{type:"TEXT",data:{loadout:0,text:"(unfinished version)",fsize:34}});

    dropper.addLoad(0,0,1900,50,850,{type:"TEXT",data:{loadout:0,text:"That's all the new stuff for now :(",fsize:24}});
    dropper.addLoad(0,0,2500,50,850,{type:"TEXT",data:{loadout:0,text:"Ok honestly this time...",fsize:24}});
    dropper.addLoad(0,0,2550,50,850,{type:"TEXT",data:{loadout:0,text:"That's the end for now. X_X",fsize:24}});
    dropper.addLoad(0,0,2650,50,850,{type:"TEXT",data:{loadout:0,text:"CREDITS:",fsize:24}});
    dropper.addLoad(0,0,2700,50,850,{type:"TEXT",data:{loadout:0,text:"GREGORY BLOOM",fsize:24}});
    dropper.addLoad(0,0,2750,50,850,{type:"TEXT",data:{loadout:0,text:"JEREMY OUILLETTE",fsize:24}});
    dropper.addLoad(0,0,2800,50,850,{type:"TEXT",data:{loadout:0,text:"ETHAN BLOOM",fsize:24}});

    dropper.addLoad(0,0,0,400,750,{type:"CIRCLE",data:{loadout:0}});
    dropper.addLoad(0,0,100,400,750,{type:"CIRCLE",data:{classtype:1}});
    dropper.addLoad(0,0,100,450,750,{type:"CIRCLE",data:{classtype:0}});
    dropper.addLoad(0,0,100,350,750,{type:"CIRCLE",data:{classtype:0}});

    dropper.addLoad(0,0,300,300,700,{type:"CIRCLE",data:''});
    dropper.addLoad(0,0,300,350,700,{type:"CIRCLE",data:''});
    dropper.addLoad(0,0,300,400,700,{type:"CIRCLE",data:''});
    dropper.addLoad(0,0,300,450,700,{type:"CIRCLE",data:''});

//    dropper.addLoad(0,0,380,450,800,{type:"WHEEL",data:{loadout:1,wheelcount:4}});
    dropper.addLoad(0,0,400,400,800,{type:"WHEEL",data:{loadout:0,wheelcount:16}});
    dropper.addLoad(0,0,600,450,800,{type:"WHEEL",data:{loadout:2,wheelcount:6}});
    dropper.addLoad(0,0,1300,250,800,{type:"WHEEL",data:{loadout:3,health:4}});
    dropper.addLoad(0,0,1300,550,800,{type:"WHEEL",data:{loadout:3,health:4}});
    dropper.addLoad(0,0,1550,450,800,{type:"WHEEL",data:{loadout:4}});
    dropper.addLoad(0,0,2175,450,800,{type:"WHEEL",data:{loadout:2,wheelcount:8,health:2}});
    dropper.addLoad(0,0,2175,450,800,{type:"WHEEL",data:{loadout:4}});

    for(var i=0; i<15; i++) {
        var r1=Math.random()*0.75;
        var x1=Math.ceil(Math.random()*10)*50;
        var x2=(Math.random()*20)+45;
        var m=Math.ceil(Math.random()*4)+3;
        for(var k=0; k<m; k++) {
            dropper.addLoad(0,0,400+(i+r1)*130, x1+k*x2-20,850, {type:"CIRCLE",data:''});
        }
    }

    for(var i=0; i<20; i++) {
        dropper.addLoad(0,0,200+i*100,Math.random()*600,800, {type:"CIRCLE",data:{classtype:2}});
    }

    dropper.sortLoads();
};

