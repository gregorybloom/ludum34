



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
MovingActorModule.prototype.clear = function() {
	for(var i in this.moveScriptSet)
	{
		if(this.moveScriptSet[i])		this.moveScriptSet[i].clear();
		this.moveScriptSet[i] = null;
	}
	this.moveScriptSet = null;
};

MovingActorModule.prototype.eraseMovingScripts = function() {
	this.moveScriptSet = {};
};

MovingActorModule.prototype.update = function() {
	for(var i in this.moveScriptSet)
	{
		if(this.moveScriptSet[i].alive)		this.moveScriptSet[i].update();
		else								delete this.moveScriptSet[i];
	}
};

MovingActorModule.alloc = function() {
	var vc = new MovingActorModule();
	vc.init();
	return vc;
};


