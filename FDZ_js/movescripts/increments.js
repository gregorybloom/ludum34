


function MoveActorIncrement() {
}
MoveActorIncrement.prototype = new MoveActorComponent;
MoveActorIncrement.prototype.identity = function() {
	return ('MoveActorIncrement (' +this._dom.id+ ')');
};
MoveActorIncrement.prototype.init = function() {
};
MoveActorIncrement.prototype.start = function() {
};
MoveActorIncrement.prototype.update = function() {
};

MoveActorIncrement.prototype.getTotal = function() {
};
MoveActorIncrement.prototype.calculateNewTop = function(dt) {
	if(this.parentMoveActor == null)		return 0;
	var t = this.getCurrentTop() + this.getStep(dt);
	return t;
};
MoveActorIncrement.prototype.getCurrentTop = function() {
};
MoveActorIncrement.prototype.getStep = function(dt) {
};
MoveActorIncrement.alloc = function() {
	var vc = new MoveActorIncrement();
	vc.init();
	return vc;
};




function IncrementBySpeed() {
}
IncrementBySpeed.prototype = new MoveActorIncrement;
IncrementBySpeed.prototype.identity = function() {
	return ('IncrementBySpeed (' +this._dom.id+ ')');
};
IncrementBySpeed.prototype.init = function() {
	MoveActorIncrement.prototype.update.call(this);
	
	this.totalDist = 0;
	this.spdPerTick = 0;
};
IncrementBySpeed.prototype.start = function() {
};
IncrementBySpeed.prototype.update = function() {
};

IncrementBySpeed.prototype.getTotal = function() {
	if(this.parentMoveActor == null)		return 1.0;
	if(this.parentMoveActor.path == null)	return 1.0;
	
	var startPt = this.parentMoveActor.startPt;
	var currEndPt = this.parentMoveActor.currEndPt;
	this.totalDist = this.parentMoveActor.progress.getPathLength( startPt, currEndPt );
	
	if(this.totalDist == 0.0)	this.totalDist = 1.0;
	return this.totalDist;
};

IncrementBySpeed.prototype.getCurrentTop = function() {
	return (this.parentMoveActor.sumDist);
};
IncrementBySpeed.prototype.getStep = function(dt) {
	return this.spdPerTick*(dt);
};
IncrementBySpeed.alloc = function() {
	var vc = new IncrementBySpeed();
	vc.init();
	return vc;
};

