function SquadEnemy()
{
}

SquadEnemy.prototype = new EnemyActor;

SquadEnemy.prototype.identity = function()
{
	return ('SquadEnemy (' + this._dom.id + ')');
};

SquadEnemy.prototype.init = function()
{
	EnemyActor.prototype.init.call(this);

	this.squadClass = "BASICSQUAD";
	this.squadType = 0;
	this.squadLoadout = 0;

	this.radius = 4;
	this.size = {w: (this.radius*2), h: (this.radius*2)};
	this.position = {x: 0, y: 0};

	this.heading.y = 1;
	this.unitSpeed = 0.04;

	this.squadFilled = false;

	this.squadUnitLoadout = 0;
	this.squadUnitType = 0;
	this.squadCount = 5;
	this.squadAngle = 0;
	this.squadSet = {};
	this.squadPositions = {};
	this.moveSquad = false;

	this.squadDeadLength = 200;
	this.deadLength=100000;

	this.actionMode = "MODE_STILL";
	this.updatePosition();

	this.moveModule = MovingActorModule.alloc();
	this.moveModule.target = this;

};

SquadEnemy.prototype.loadingData = function(data)
{
	EnemyActor.prototype.loadingData.call(this,data);
	if(data.loadout)		this.squadLoadout = data.loadout;
	if(data.squadcount)		this.squadCount = data.squadcount;
};
SquadEnemy.prototype.isSquadNear = function()
{
	var CF = GAMEMODEL.gameSession.gameWorld.camField;
	if(GAMEGEOM.BoxContainsPt(CF.absBox, this.position)) 				return true;
	for(var i in this.squadSet) {
		if(GAMEGEOM.BoxIntersects(CF.absBox, this.squadSet[i].absBox))	return true;
	}
	return false;
};
SquadEnemy.prototype.midStep = function(timeplace,stepnum,step) {	
};
SquadEnemy.prototype.beginStep = function(stepnum,stepdata) {
};

SquadEnemy.prototype.draw = function()
{
	GAMEVIEW.drawCircle(this.position, this.radius, "#00FF00", 1);
};

SquadEnemy.prototype.update = function()
{
	EnemyActor.prototype.update.call(this);
	this.updateMode();

	if (this.moveModule != null)
	{
		this.moveModule.update();
	}

	if (this.animateModule != null)
	{
		this.animateModule.update();
	}

	var c=0;
	for(var i in this.squadSet) {
		if(this.squadSet[i].alive == false)		delete this.squadSet[i];
		else 									c+=1;
	}
	if(c==0 && this.squadFilled)		this.alive=false;
};

SquadEnemy.prototype.updateCurrentAnimation = function()
{
};

SquadEnemy.prototype.updateMode = function()
{
};


SquadEnemy.prototype.checkShoot = function() {
};
SquadEnemy.prototype.beginShoot = function() {
};


SquadEnemy.prototype.collide = function(act) {
};
SquadEnemy.prototype.collideType = function(act) {
	return false;
};
SquadEnemy.prototype.collideVs = function(act) {
};


SquadEnemy.alloc = function()
{
	var vc = new SquadEnemy();
	vc.init();
	return vc;
};
