


function MoveActorHeading() {
}
MoveActorHeading.prototype = new MoveActorComponent;
MoveActorHeading.prototype.identity = function() {
	return ('MoveActorDuration (' +this._dom.id+ ')');
};
MoveActorHeading.prototype.init = function() {
	this.absolutePt = false;
};
MoveActorHeading.prototype.start = function() {
};
MoveActorHeading.prototype.update = function() {
};

MoveActorHeading.prototype.clipBaseT = function(baseT) {
	if(baseT > 1.0)		return 1.0;
	else				return baseT;
};
MoveActorHeading.prototype.clipProgress = function(progressT) {
	return progressT;
};
MoveActorHeading.prototype.reachedHeading = function(baseT, progressT) {
	if(baseT >= 1.0)		return true;
	return false;
};
MoveActorHeading.prototype.calculateNewEndpt = function() {
	if(this.parentMoveActor != null)
	{
		this.parentMoveActor.kill();
	}
	return {x:0,y:0};
};
MoveActorHeading.alloc = function() {
	var vc = new MoveActorHeading();
	vc.init();
	return vc;
};




function HeadingByVector() {
}
HeadingByVector.prototype = new MoveActorHeading;
HeadingByVector.prototype.identity = function() {
	return ('MoveActorHeading (' +this._dom.id+ ')');
};
HeadingByVector.prototype.init = function() {
	MoveActorHeading.prototype.update.call(this);
	
	this.startPt = {x:0,y:0};
	this.endPt = {x:0,y:0};
	this.vect = {x:0,y:0};

	this.baseT = 0;
	this.extraT = 0;
	this.dist = 0;
	this.absolutePt = false;
};
HeadingByVector.prototype.setHeadingByVector = function(v, dist) {
	this.dist = dist;
	
	var magn = Math.sqrt( v.x*v.x + v.y*v.y );
	this.vect.x = v.x / magn;
	this.vect.y = v.y / magn;
	
	this.endPt.x = this.vect.x * dist;
	this.endPt.y = this.vect.y * dist;
};
HeadingByVector.prototype.start = function() {
	if(this.parentMoveActor != null)
	{
		this.startPt.x = this.parentMoveActor.startPt.x;
		this.startPt.y = this.parentMoveActor.startPt.y;
	}
	this.endPt.x = this.endPt.x + this.startPt.x;
	this.endPt.y = this.endPt.y + this.startPt.y;
};
HeadingByVector.prototype.update = function() {
};

HeadingByVector.prototype.clipBaseT = function(baseT) {
	this.baseT = baseT;
	
	var repeat = 0;
	while(baseT < 0.0)
	{
		baseT = baseT +1.0;
		repeat = repeat -1;
	}
	while(baseT > 1.0)
	{
		baseT = baseT -1.0;
		repeat = repeat +1;
	}
	this.extraT = repeat;
	return baseT;
};
HeadingByVector.prototype.clipProgress = function(progressT) {
	var pT = progressT + this.extraT;
	this.extraT = 0;
	return pT;
};
HeadingByVector.prototype.reachedHeading = function(baseT, progressT) {
	if(this.parentMoveActor != null)
	{
		this.parentMoveActor.lastBaseT = baseT;
	}
	return false;
};
HeadingByVector.prototype.calculateNewEndpt = function() {
	return {x:this.endPt.x,y:this.endPt.y};
};


HeadingByVector.alloc = function() {
	var vc = new HeadingByVector();
	vc.init();
	return vc;
};



