function LegionEnemy()
{
}

LegionEnemy.prototype = new SquadEnemy;

LegionEnemy.prototype.identity = function()
{
	return ('LegionEnemy (' + this._dom.id + ')');
};

LegionEnemy.prototype.init = function()
{
	SquadEnemy.prototype.init.call(this);

	this.squadClass = "SLOWDROP";
	this.squadType = 0;
	this.squadLoadout = 0;


	this.radius = 4;
	this.size = {w: (this.radius*2), h: (this.radius*2)};
	this.position = {x: 0, y: 0};

	this.heading.y = 1;
	this.unitSpeed = 0.04;

	this.squadUnitLoadout=1;
	this.legionFilled = false;
	this.legionStagger = 30;
	this.legionSpd = 0.04;
	this.legionSet = {};
	this.legionAngles = {};
	this.moveLegion = false;

	this.legionDeadLength = 200;

	this.actionMode = "MODE_STILL";
	this.updatePosition();
	this.moveModule = MovingActorModule.alloc();
	this.moveModule.target = this;

	this.deadLength=100000;
	this.stepNum=0;
	this.turntime = 1500;
	this.beginStep(0,'');
};

LegionEnemy.prototype.loadingData = function(data)
{
	if(!data.loadout)		this.squadLoadout=0;
	SquadEnemy.prototype.loadingData.call(this,data);
	this.wheelAngle = 0;
	this.heading.y = 1;

	this.squadUnitLoadout=1;

	if(data.loadout == 0) {
		this.unitSpeed = 0.04;
		this.squadCount = 5;
		this.wheelRadius = -100;
		this.angleStagger = 30;
		this.wheelSpd = 0.04;
		this.squadUnitType = 0;
	}
	if(data.loadout == 1) {
		this.unitSpeed = 0.07;
		this.squadCount = 5;
		this.wheelRadius = -120;
		this.angleStagger = 35;
		this.wheelSpd = 0.06;
		this.squadUnitType = 1;
	}
	if(data.loadout == 2) {
		this.unitSpeed = 0.05;
		this.squadCount = 5;
		this.wheelRadius = -200;
		this.angleStagger = 45;
		this.wheelSpd = 0.06;
		this.squadUnitType = 1;
	}
	if(data.loadout == 3) {
		this.unitSpeed = 0.06;
		this.squadCount = 6;
		this.wheelRadius = -60;
		this.angleStagger = 60;
		this.wheelSpd = 0.25;
		this.squadUnitType = 0;
	}
	if(data.loadout == 4) {
		this.unitSpeed = 0.05;
		this.squadCount = 4;
		this.wheelRadius = -30;
		this.angleStagger = 90;
		this.wheelSpd = 0.3;
		this.squadUnitType = 2;
	}
	if(data.anglestagger)	this.angleStagger = data.anglestagger;
	if(data.wheelradius)	this.wheelRadius = -data.wheelradius;

	this.wheelDeadLength = Math.abs(this.wheelRadius)*2;
};
LegionEnemy.prototype.midStep = function(timeplace,stepnum,step) {
	if(this.squadClass == "SLOWDROP" && this.squadType < 10) {
		if(stepnum == 1){
			var CF = GAMEMODEL.gameSession.gameWorld.camField;
			if(GAMEGEOM.BoxContainsPt(CF.absBox, this.position)) {
				this.beginStep(2,'');
				return;
			}
			for(var i in this.wheelSet) {
				if(GAMEGEOM.BoxIntersects(CF.absBox, this.wheelSet[i].absBox)) {
					this.beginStep(2,'');
					break;
				}
			}
		}
	}
};
LegionEnemy.prototype.beginStep = function(stepnum,stepdata) {
	if(this.squadClass == "SLOWDROP" && this.squadType < 10) {
		if(stepnum==0) {
			this.loadStep(1, 0, {});
		}
		if(stepnum==1) {
			var WE = null;
			for(var i=0; i<this.squadCount; i++) {
				WE = CircleEnemy.alloc();
				WE.loadingData( {class:"WHEELMAN",classtype:this.squadUnitType,loadout:this.squadUnitLoadout} );
				WE.updatePosition(this.position);
				WE.deadLength = this.wheelDeadLength;
				this.wheelAngles[i] = (i-Math.floor(this.squadCount/2))*this.angleStagger;
				WE.shiftPosition(GAMEGEOM.rotatePoint({x:0,y:this.wheelRadius}, this.wheelAngles[i]));
				this.wheelSet[i] = WE;
			}
		}
		if(stepnum==2) {
			var WE = null;
			for(var i in this.wheelSet) {
				WE = this.wheelSet[i];
				GAMEMODEL.gameSession.gameWorld.addActor(WE, 'act');
				this.turnWheel = true;
				this.wheelFilled = true;
			}

			this.loadStep(3, 0, {});
		}
	}
	this.stepNum = stepnum;
};

LegionEnemy.prototype.draw = function()
{
//	SquadEnemy.prototype.draw.call(this);
//	GAMEVIEW.drawCircle(this.position, this.radius, "#00FF00", 1);
};

LegionEnemy.prototype.update = function()
{
	SquadEnemy.prototype.update.call(this);
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
	for(var i in this.wheelSet) {
		if(this.wheelSet[i].alive == false)		delete this.wheelSet[i];
		else 									c+=1;
	}
	if(c==0 && this.wheelFilled)		this.alive=false;
};

LegionEnemy.prototype.updateCurrentAnimation = function()
{
};

LegionEnemy.prototype.updateMode = function()
{
	var P1 = null;
	var P2 = null;
	var WE = null;
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	var c= 0;
	var aoff = 0;

	for(var i in this.wheelSet) {
		WE = this.wheelSet[i];
		if(this.squadClass == "SLOWDROP" && this.squadType < 10) {
			aoff = this.wheelAngles[i] + this.wheelAngle;
			WE.updatePosition(this.position);
			P2 = GAMEGEOM.rotatePoint({x:0,y:this.wheelRadius}, aoff);
		}
		else if(this.squadClass == "SLOWDROP" && this.squadType < 20) {
			aoff = this.wheelAngles[i] + this.wheelAngle;
			P1 = GAMEGEOM.rotatePoint({x:0,y:this.wheelRadius}, aoff);
			P2 = GAMEGEOM.rotatePoint({x:0,y:this.wheelRadius}, aoff+this.wheelSpd*this.ticksDiff);
			P2.x -= P1.x;
			P2.y -= P1.y;
		}
		WE.shiftPosition(P2);
		c+=1;
	}
	if(this.turnWheel)		this.wheelAngle += this.wheelSpd*this.ticksDiff;
	this.wheelAngle = this.wheelAngle % 360;
};

LegionEnemy.prototype.collideType = function(act)
{
	if (act instanceof CharActor)
	{
		return true;
	}

	return false;
};

LegionEnemy.prototype.collideVs = function(act)
{
	if (act instanceof CharActor)
	{
		var interBox = GAMEGEOM.BoxIntersection(this.absBox, act.absBox);
		var push = {x: interBox.w, y: interBox.h};
	}
};


LegionEnemy.prototype.checkShoot = function() {
};
LegionEnemy.prototype.beginShoot = function() {
};

LegionEnemy.prototype.collide = function(act) {
	SquadEnemy.prototype.collide.call(this,act);
};
LegionEnemy.prototype.collideType = function(act) {
	return false;
};
LegionEnemy.prototype.collideVs = function(act) {
};


LegionEnemy.alloc = function()
{
	var vc = new LegionEnemy();
	vc.init();
	return vc;
};
