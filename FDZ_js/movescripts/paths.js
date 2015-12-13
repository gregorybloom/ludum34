



function LinearPath() {
}
LinearPath.prototype = new MoveActorBasicPath;
LinearPath.prototype.identity = function() {
	return ('LinearPath (' +this._dom.id+ ')');
};
LinearPath.prototype.getPosition = function(t, start, end) {
	if(t < 0 || t > 1)		return this.getPositionWithLoopPath(t, start, end);
	var pos = {x:0,y:0};
	pos.x = (end.x-start.x)*t + start.x;
	pos.y = (end.y-start.y)*t + start.y;
	return pos;
};
LinearPath.prototype.getPathLength = function(start, end, t0, t1) {
	var dt = t1-t0;
	
	var thisDiff = {x:0,y:0};
	thisDiff.x = dt *(end.x - start.x);
	thisDiff.y = dt *(end.y - start.y);
	
	var dD = Math.sqrt( thisDiff.x*thisDiff.x + thisDiff.y*thisDiff.y );
	return dD;
};
LinearPath.alloc = function() {
	var vc = new LinearPath();
	vc.init();
	return vc;
};


