
function EnemyActor() {
}
EnemyActor.prototype = new Actor;
EnemyActor.prototype.identity = function() {
	return ('EnemyActor (' +this._dom.id+ ')');
};
EnemyActor.prototype.init = function() {
	Actor.prototype.init.call(this);
};

EnemyActor.prototype.draw = function() {
	Actor.prototype.draw.call(this);
//	GAMEVIEW.drawBox(this.absBox,"#660000");
};
EnemyActor.prototype.update = function() {
	Actor.prototype.update.call(this);
};


EnemyActor.alloc = function() {
	var vc = new EnemyActor();
	vc.init();
	return vc;
};
