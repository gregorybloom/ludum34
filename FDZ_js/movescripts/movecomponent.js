



function MoveActorComponent() {
}
MoveActorComponent.prototype.identity = function() {
	return ('MoveActorComponent (?)');
};
MoveActorComponent.prototype.init = function() {
	this.parentMoveActor = null;
};
MoveActorComponent.prototype.start = function() {
};
MoveActorComponent.prototype.update = function() {
};
MoveActorComponent.alloc = function() {
	var vc = new MoveActorComponent();
	vc.init();
	return vc;
};

