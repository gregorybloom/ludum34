



function MovingActorModule() {
}
MovingActorModule.prototype.identity = function() {
	return ('MovingActorModule (?)');
};
MovingActorModule.prototype.init = function() {
	this.minimumScripts = 2;
	
	this.moveScriptSet = {};
	
	this.target = null;
	this.filter = null;
};
MovingActorModule.prototype.eraseMovingScripts = function() {
	this.moveScriptSet = {};
};

MovingActorModule.prototype.update = function() {
	for(var i in this.moveScriptSet)
	{
		this.moveScriptSet[i].update();
	}
};

MovingActorModule.alloc = function() {
	var vc = new MovingActorModule();
	vc.init();
	return vc;
};


