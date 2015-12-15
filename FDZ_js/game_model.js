
GAMEMODEL={
    version: '0.0.2',

    gamePlayer: null,
    gameSession: null,
    gameScreens: null,

    modelMode: "GAME_INIT",  
	
    modelCamera: null,
    modelClock: null,

    playerScore: 0,

	gameAreas: {},
	gamePlayers: {},
	gameCamera: null,

	gameMode: "GAME_INIT",
	gameClock: null,
	
	activeObjs: 0,
	
	drawcount: 0	
};

GAMEMODEL.init = function()
{
	this.gameClock = GameClock.alloc();

	this.gameCamera = GameCamera.alloc();
    this.gameCamera.displaySize = {w:800,h:600};
    this.gameCamera.baseSize = {w:800,h:600};

    this.gameScreens = ScreenManager.alloc();

	this.modelClock = GameClock.alloc();

	this.modelCamera = GameCamera.alloc();
    this.modelCamera.displaySize = {w:800,h:600};
    this.modelCamera.baseSize = {w:800,h:600};

	return true;
};
GAMEMODEL.clear = function()
{
        if(this.gamePlayer instanceof Actor)              
        {
            this.gamePlayer.clear();
            delete this.gamePlayer;
        }
        if(this.gameSession instanceof Actor)              
        {
            this.gameSession.clear();
            delete this.gameSession;
        }
        if(this.gameScreens instanceof Actor)
        {
            this.gameScreens.clear();
            delete this.gameScreens;
        }
        if(this.modelCamera instanceof Actor)
        {
            this.modelCamera.clear();
            delete this.modelCamera;
        }
        if(this.modelClock != null && typeof this.modelClock === "object")    delete this.modelClock;

        this.gamePlayer = null;
        this.modelCamera = null;
        this.gameSession = null;
        this.gameScreens = null;
        this.modelClock = null;
};

GAMEMODEL.loadGame = function() {

};
GAMEMODEL.readInput = function(inputobj)
{
	var keyused = false;

	return keyused;
};

GAMEMODEL.startGame = function()
{
			console.log("* startgame *");
	this.gameClock.restart();
	this.gameMode = "GAME_RUN";
    this.playerScore = 0;

    if(this.gameSession instanceof SessionActor)   
    {
        this.gameSession.clear();
        delete this.gameSession;
    }

    this.gameSession = SessionActor.alloc();
	this.gameSession.start();

	this.loadGame();
};
GAMEMODEL.endGame = function()
{
			console.log("* endgame *");
	this.gameSession.end();
};

GAMEMODEL.togglePause = function()
{
	if(this.gameMode === "GAME_PAUSE")
	{
		this.gameClock.start();
		if(this.gameSession && this.gameSession.gameClock)
		{
			this.gameSession.gameClock.start();
		}
		this.gameMode = "GAME_RUN";
	}
	else if(this.gameMode === "GAME_RUN")
	{
		this.gameClock.stop();
		if(this.gameSession && this.gameSession.gameClock)
		{
			this.gameSession.gameClock.stop();
		}
		this.gameMode = "GAME_PAUSE";
	}
};


GAMEMODEL.update = function() {
};
GAMEMODEL.distributeInput = function(inobj)
{
	var keyused = false;
	keyused = keyused || this.readInput(inobj)
	if(this.gameMode === "GAME_RUN")
	{
		for(var i in this.gamePlayers)
		{
			keyused = keyused || this.gamePlayers[i].readInput(inobj);
		}
 	    keyused = keyused || this.gameSession.distributeInput(inobj);
	}
	return keyused;
};
GAMEMODEL.updateAll = function()
{


//        console.log(this.gameMode + " "+ this.gameClock.isActive);
	if(this.gameMode === "GAME_RUN")
	{
		this.activeObjs = 0;
		
        if(this.gameSession instanceof SessionActor)
        {
            this.gameSession.updateAll();
        }
        else
        {
            GAMEMODEL.endGame();
        }
		for(var i in this.gameAreas)
		{
			this.gameAreas[i].update();
	
			this.activeObjs += this.gameAreas[i].activeActors.length;
		}
		if(this.gameCamera != null)	
		{
			this.gameCamera.update();
		}
	}
    else if(this.modelMode == "GAME_SCREENS")
    {               
        if(this.gameScreens instanceof Actor)           
        {
            this.gameScreens.updateAll();
        }
    }
	else if(this.gameClock.isActive == true)
	{
		console.log( this.gameMode );
		if(this.gameMode === "GAME_PAUSE")	        this.gameClock.stop();
		if(this.gameMode === "GAME_MUSICPAUSE")	        this.gameClock.stop();
	}
	this.update();
};
GAMEMODEL.collideAll = function()
{
	if(this.gameMode === "GAME_RUN")
	{
		for(var i in this.gameAreas)
		{
			this.gameAreas[i].collide();
		}
        if(this.gameSession instanceof SessionActor)
        {
            this.gameSession.collideAll();
        }
	}
};
GAMEMODEL.cleanAll = function()
{	
        if(this.gameSession instanceof SessionActor)        this.gameSession.cleanAll();
        if(this.gameScreens instanceof ScreenManager)       this.gameScreens.cleanAll();
};



GAMEMODEL.drawAll = function()
{
	if(this.gameMode === "GAME_RUN" || this.gameMode === "GAME_PAUSE")
	{
		for(var i in this.gameAreas)
		{
			this.gameAreas[i].draw();
		}
        if(this.gameSession instanceof SessionActor)
        {
            this.gameSession.drawAll();
        }
	}
    if(this.gameScreens instanceof Actor)           this.gameScreens.drawAll();
};
GAMEMODEL.getTime = function()
{
    if(this.modelClock == null)		return 0;
    if(this.modelMode == "GAME_RUN" && this.gameSession instanceof SessionActor)
    {
        if(this.gameSession.gameClock instanceof GameClock)
        {
            return this.gameSession.gameClock.elapsedMS();
        }
    }
    return GAMEMODEL.modelClock.elapsedMS();
};
