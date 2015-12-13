

function LinearProgress() {
}
LinearProgress.prototype = new MoveActorBasicProgress;
LinearProgress.prototype.identity = function() {
	return ('LinearProgress (' +this._dom.id+ ')');
};
LinearProgress.prototype.calculateProgress = function(t) {
	return t;
};
LinearProgress.prototype.calculatePathLength = function(start, end) {
	return this.getPathInRange(start, end, 0, 1);
};
LinearProgress.alloc = function() {
	var vc = new LinearProgress();
	vc.init();
	return vc;
};


