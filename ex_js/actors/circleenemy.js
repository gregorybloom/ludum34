function CircleEnemy()
{
}

CircleEnemy.prototype = new EnemyActor;

CircleEnemy.prototype.identity = function()
{
	return ('CircleEnemy (' + this._dom.id + ')');
};

CircleEnemy.prototype.init = function()
{
	EnemyActor.prototype.init.call(this);
	this.radius = 20;
	this.size = {w: (this.radius*2), h: (this.radius*2)};
	this.position = {x: 0, y: 0};
	this.cooldown = GAMEMODEL.gameClock.elapsedMS();
	this.cooldur = 2000;
	this.fired = false;

	this.unitSpeed = 0.04;
	this.unitSpeedH = 0.1;

	this.turnclock = GAMEMODEL.gameClock.elapsedMS();
	this.turntime = 1500;
	this.turnheading = {x:0,y:0};

	this.actionMode = "MODE_STILL";
	this.updatePosition();
	this.moveModule = MovingActorModule.alloc();
	this.moveModule.target = this;
	this.setPath(1);
};

CircleEnemy.prototype.loadingData = function(data)
{
};

CircleEnemy.prototype.draw = function()
{
	//	EnemyActor.prototype.draw.call(this);
//	GAMEVIEW.drawBox(this.absBox, "#660000");
	GAMEVIEW.drawCircle(this.position, this.radius, "#FF0000", 1);
};

CircleEnemy.prototype.update = function()
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
};

CircleEnemy.prototype.collideType = function(act)
{
	if (act instanceof CharActor)
	{
		return true;
	}

	return false;
};

CircleEnemy.prototype.collideVs = function(act)
{
	if (act instanceof CharActor)
	{
		var interBox = GAMEGEOM.BoxIntersection(this.absBox, act.absBox);
		var push = {x: interBox.w, y: interBox.h};
	}
};

CircleEnemy.prototype.setPath = function(type)
{
	this.actionMode = "MODE_MOVING";
	var inc = IncrementBySpeed.alloc();
	inc.spdPerTick = this.unitSpeed;
	var head = HeadingByVector.alloc();
	head.setHeadingByVector({x: 0, y: 1}, 500000 * this.unitSpeed);
	var durt = DurationByTime.alloc();
	durt.duration = 500000;
	var lprog = LinearProgress.alloc();
	var lpath = LinearPath.alloc();
	var move = MoveActor.alloc();
	move.movingActor = this;
	move.increment = inc;
	move.heading = head;
	move.duration = durt;
	move.progress = lprog;
	move.path = lpath;
	this.moveModule.moveScriptSet[0] = move;

	this.makeTurn(this.unitSpeedH, {x:1,y:0} );
};

CircleEnemy.prototype.makeTurn = function(speed,heading) {
	
		if(this.moveModule.moveScriptSet[1] instanceof MoveActor)
		{
			delete this.moveModule.moveScriptSet[1];
		}

		this.turnheading = heading;

		var inc2 = IncrementBySpeed.alloc();	inc2.spdPerTick = speed;
		var head2 = HeadingByVector.alloc();	head2.setHeadingByVector(heading, 500000*speed);
		var durt2 = DurationByTime.alloc();	durt2.duration = this.turntime;
		var lprog2 = LinearProgress.alloc();
		var lpath2 = LinearPath.alloc();

		var move2 = MoveActor.alloc();
		move2.movingActor = this;
		move2.increment = inc2;
		move2.heading = head2;
		move2.duration = durt2;
		move2.progress = lprog2;
		move2.path = lpath2;

		this.moveModule.moveScriptSet[1] = move2;
}

CircleEnemy.prototype.updateCurrentAnimation = function()
{
};

CircleEnemy.prototype.updateMode = function()
{
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	if((this.turnclock+this.turntime) <= curtime) 
	{
		if(this.turnheading.x < 0)	this.turnheading.x = 1;
		else 						this.turnheading.x = -1;

		this.turnclock = GAMEMODEL.gameClock.elapsedMS();
		this.makeTurn(this.unitSpeedH, this.turnheading );
	}
		var timeLeft = this.cooldown + this.cooldur - GAMEMODEL.gameClock.elapsedMS();
		if(timeLeft <= 0)		this.shoot();
		if(timeLeft <= 0)		this.cooldown = GAMEMODEL.gameClock.elapsedMS();
};

CircleEnemy.prototype.collide = function(act) {
	Actor.prototype.collide.call(this,act);
};
CircleEnemy.prototype.collideType = function(act) {
	if(act instanceof ShotActor)		return true;
	return false;
};
CircleEnemy.prototype.collideVs = function(act) {
	if(act instanceof ShotActor)
	{
		var d1 = (act.position.x - this.position.x);
		var d2 = (act.position.y - this.position.y);
		var d = d1*d1 + d2*d2;

		var r = (act.radius+this.radius);
		r=r*r;

		if(d <= r) {
			act.alive = false;
			this.alive = false;
		}
	}
};


CircleEnemy.prototype.shoot = function()
{
	if (this.fired)
	{
//		return;
	}

	this.fired = true;
	var rock = BulletActor.alloc();
	rock.updatePosition(this.position);
	rock.heading.x = 0;
	rock.heading.y = 1;
	rock.direction = 2;
	rock.shiftPosition({x: rock.heading.x* this.size.w / 2, y: rock.heading.y* this.size.h / 2});
	rock.firer = this;
	GAMEMODEL.gameSession.gameWorld.addActor(rock, 'bullet');

	if (GAMEVIEW.BoxIsInCamera(this.absBox))
	{
		var r = 0.9 + 0.3 * Math.random();
		var v = 0.55 + 0.1 * Math.random();

		if (Math.random() > 0.6)
		{
//			this.playSound(4, v, r);
		}
	}
};

CircleEnemy.alloc = function()
{
	var vc = new CircleEnemy();
	vc.init();
	return vc;
};
