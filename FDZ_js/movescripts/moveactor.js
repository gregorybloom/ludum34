



function MoveActor() {
}
MoveActor.prototype.identity = function() {
	return ('MoveActor (?)');
};
MoveActor.prototype.init = function() {
	this.alive = true;

	this.startPt = {x:0,y:0};
	this.currEndPt = {x:0,y:0};
	this.lastEndPt = {x:0,y:0};
	
	this.startTime = 0;
	this.lastTime = 0;
	this.currTime = 0;
	
	this.dt = 0;
	this.lastBaseT = 0;
	
	this.sumDist = 0;
	this.sumTime = 0;
	
	this.currPt = {x:0,y:0};
	this.lastPt = {x:0,y:0};
	this.lastStep = {x:0,y:0};
	this.currStep = {x:0,y:0};
	
	this.movingActor = null;
	
	this.increment = null;
	this.heading = null;
	this.duration = null;
	
	this.progress = null;
	this.path = null;
	
	this.started = false;
};
MoveActor.prototype.start = function() {
	if(this.heading == null)								return;
	if(this.movingActor == null)							return;
	if(typeof this.movingActor.position === "undefined")	return;
	
	this.started = true;
	
	if(this.increment != null)	this.increment.parentMoveActor = this;
	if(this.heading != null)	this.heading.parentMoveActor = this;
	if(this.duration != null)	this.duration.parentMoveActor = this;
	if(this.progress != null)	this.progress.parentMoveActor = this;
	if(this.path != null)		this.path.parentMoveActor = this;

	
	this.startTime = GAMEMODEL.gameClock.elapsedMS();
	this.lastTime = this.startTime;
	
	this.startPt.x = this.movingActor.position.x;
	this.startPt.y = this.movingActor.position.y;
	
	this.lastEndPt = this.heading.calculateNewEndpt();
	if(this.heading.absolutePt == true)		
	{
		var ptshift = this.movingActor.getAbsoluteShift();
		this.lastEndPt.x = this.lastEndPt.x - ptshift.x;
		this.lastEndPt.y = this.lastEndPt.y - ptshift.y;
	}
	
	this.increment.start();
	this.heading.start();
	this.duration.start();
	this.progress.start();
	this.path.start();
};

MoveActor.prototype.update = function() {
	if(this.movingActor == null)		return;
	if(this.heading == null || this.duration == null || this.increment == null)		return;
	if(this.progress == null || this.path == null)		return;
	
	if(this.started != true)		this.start();

	this.currTime = GAMEMODEL.gameClock.elapsedMS();
	if(this.duration != null)	this.duration.trimToLimit();
	this.dt = this.currTime - this.lastTime;
	
	if(this.heading != null && this.movingActor != null)
	{
		this.currEndPt = this.heading.calculateNewEndpt();
		if(this.heading.absolutePt == true)	
		{
			var ptshift = this.movingActor.getAbsoluteShift();
			this.currEndPt.x = this.currEndPt.x - ptshift.x;
			this.currEndPt.y = this.currEndPt.y - ptshift.y;
		}
	}
	
	var total = 1.0;
	var top = 1.0;
	var newBaseT = 1.0;
	var newPrT = 1.0;
	
	if(this.increment != null)
	{
		total = this.increment.getTotal();
		top = this.increment.calculateNewTop(this.dt);
	}
	if(total != 0)	newBaseT = top/total;
	
	var prg = this.progress.getProgress(this.lastBaseT);
	this.lastPt = this.path.getPosition( prg, this.startPt, this.lastEndPt );
	
	newBaseT = this.heading.clipBaseT( newBaseT );
	newPrT = this.progress.getProgress( newBaseT );
	newPrT = this.heading.clipProgress( newPrT );
	this.currPt = this.path.getPosition( newPrT, this.startPt, this.currEndPt );
	
	this.currStep = {x:0,y:0};
	this.currStep.x = this.currPt.x - this.lastPt.x;
	this.currStep.y = this.currPt.y - this.lastPt.y;
	
	if(this.duration != null)	this.duration.trimToLimit();
	
	this.sumTime += this.dt;
	this.lastEndPt.x = this.currEndPt.x;
	this.lastEndPt.y = this.currEndPt.y;
	this.lastTime = this.currTime;
	this.lastBaseT = newBaseT;
	this.sumDist += Math.sqrt( this.currStep.x*this.currStep.x + this.currStep.y*this.currStep.y );
	this.lastStep.x = this.currStep.x;
	this.lastStep.y = this.currStep.y;
	this.currStep = {x:0,y:0};
	
	var newPt = {x:0,y:0};
	newPt.x = this.movingActor.position.x + this.lastStep.x;
	newPt.y = this.movingActor.position.y + this.lastStep.y;
	if(this.movingActor != null)	this.movingActor.updatePosition( newPt );
	if(this.heading != null)
	{
		if(this.heading.reachedHeading( newBaseT, this.newPrT )==true)	this.clear();
	}
	if(this.duration != null)
	{
		if(this.duration.durationReached()==true)	this.clear();
	}
	
	
	
};
MoveActor.prototype.kill = function() {
	this.clear();
};
MoveActor.prototype.clear = function() {
/*	if(this.increment != null)	delete this.increment.parentMoveActor;
	if(this.heading != null)	delete this.heading.parentMoveActor;
	if(this.duration != null)	delete this.duration.parentMoveActor;
	if(this.progress != null)	delete this.progress.parentMoveActor;
	if(this.path != null)		delete this.path.parentMoveActor;		/**/

	this.increment = null;
	this.heading = null;
	this.duration = null;	
	this.progress = null;
	this.path = null;

	this.alive=false;
};

MoveActor.alloc = function() {
	var vc = new MoveActor();
	vc.init();
	return vc;
};

