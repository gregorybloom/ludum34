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

	this.enemyClass = null;
	this.enemyType = null;

	this.heading.y = 1;

	this.radius = 20;
	this.size = {w: (this.radius*2), h: (this.radius*2)};
	this.position = {x: 0, y: 0};

	this.coolShot = 2000;
	this.deadLength = 50;

	this.unitSpeed = 0.04;
	this.unitSpeedH = 0.1;

	this.deathClock = 250;

	this.actionMode = "MODE_STILL";
	this.updatePosition();
	this.moveModule = MovingActorModule.alloc();
	this.moveModule.target = this;

	this.turntime = 1500;
};

CircleEnemy.prototype.loadingData = function(data)
{
	EnemyActor.prototype.loadingData.call(this,data);	
	this.scoreValue = 100;

	if(data.loadout == 0 || !data.loadout) {
		if(this.enemyClass==null)	this.enemyClass = "LEGGIONAIRRE";
		if(this.enemyType==null)	this.enemyType=0;
		if(this.enemyType==0)		this.scoreValue = 50;
		if(this.enemyType>=1)		this.target = GAMEMODEL.gameSession.gamePlayer;
		if(this.enemyType==2)		this.unitSpeed = 0.08;
		if(this.enemyType==2)		this.coolShot = 1500;

		this.stepNum=0;
		this.beginStep(this.stepNum,'');
	}
	if(data.loadout == 1) {
		if(this.enemyClass==null)	this.enemyClass = "WHEELMAN";
		if(this.enemyType==null)	this.enemyType=0;
		if(this.enemyType==1)		this.health=4;
		if(this.enemyType==3)		this.health=4;
		if(this.enemyType==2)		this.health=8;
		if(this.enemyType==2)		this.target = GAMEMODEL.gameSession.gamePlayer;
		if(this.enemyType==3)		this.target = GAMEMODEL.gameSession.gamePlayer;
		this.scoreValue += this.health*50;
		this.stepNum=0;
	}

};

CircleEnemy.prototype.draw = function()
{
	//	EnemyActor.prototype.draw.call(this);
//	GAMEVIEW.drawBox(this.absBox, "#660000");
	if(this.enemyClass == "LEGGIONAIRRE" && this.enemyType < 10) {
		if(!this.deathBegin) {
			var CF = GAMEMODEL.gameSession.gameWorld.camField;
//			if(  GAMEGEOM.BoxIntersects(this.absBox, CF.absBox)==false  )
//				GAMEVIEW.fillCircle(this.absPosition,this.radius,"#009900");
//			else
				if(this.enemyType==0)	GAMEVIEW.fillCircle(this.absPosition,this.radius,"#990000");
				if(this.enemyType>=1)	GAMEVIEW.fillCircle(this.absPosition,this.radius,"#000066");
		} else {
			GAMEVIEW.drawCircle(this.absPosition,this.deathRadius,"#666666",1);
		}	
	}
	else if(this.enemyClass == "WHEELMAN" && this.enemyType < 10) {
		if(!this.deathBegin) {
			if(this.enemyType==0)	GAMEVIEW.drawCircle(this.absPosition, this.radius, "#FF6600", 6);		
			if(this.enemyType==1)	GAMEVIEW.drawCircle(this.absPosition, this.radius, "#CC3300", 6);		
			if(this.enemyType==3)	GAMEVIEW.drawCircle(this.absPosition, this.radius, "#CC3300", 6);		
			if(this.enemyType==2)	GAMEVIEW.drawCircle(this.absPosition, this.radius, "#330000", 6);		
		} else {
			GAMEVIEW.drawCircle(this.absPosition, this.deathRadius, "#666666", 1);		
		}	
	}
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
CircleEnemy.prototype.beginDeath = function() {
	if(!this.deathBegin && GAMEVIEW.BoxIsInCamera(this.absBox))
	{
		GAMEMODEL.playerScore += this.scoreValue;
		var r = 0.9 + 0.3 * Math.random();
		var v = 0.55 + 0.1 * Math.random();

		this.playSound(0, v, r);
	}
	EnemyActor.prototype.beginDeath.call(this);
};
CircleEnemy.prototype.updateDeath = function() {
	var curtime = GAMEMODEL.gameClock.elapsedMS();
	var deathDiff = (curtime - this.deathStart)/this.deathClock;

	this.deathRadius = this.radius*0.9 + 8*(deathDiff);
};



CircleEnemy.prototype.midStep = function(timeplace,stepnum,step) {
};
CircleEnemy.prototype.beginStep = function(stepnum,stepdata) {
	if(this.enemyClass == "LEGGIONAIRRE" && this.enemyType < 10) {
			if(this.moveModule.moveScriptSet[0] instanceof MoveActor)
			{
				delete this.moveModule.moveScriptSet[0];
			}
			if(this.enemyType == 2)		return;

			var speed = this.unitSpeedH;

			var inc2 = IncrementBySpeed.alloc();	inc2.spdPerTick = speed;
			var head2 = HeadingByVector.alloc();	
			if(stepnum%2==0)	head2.setHeadingByVector({x:1,y:0}, 500000*speed);
			if(stepnum%2==1)	head2.setHeadingByVector({x:-1,y:0}, 500000*speed);
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

			this.moveModule.moveScriptSet[0] = move2;

			this.loadStep(stepnum+1, this.turntime, {});
	}
	if(this.enemyClass == "WHEELMAN" && this.enemyType < 10) {
	}
};
CircleEnemy.prototype.checkShoot = function() {
	if(this.enemyClass == "LEGGIONAIRRE" && this.enemyType < 10) {
		var CF = GAMEMODEL.gameSession.gameWorld.camField;
		if(  GAMEGEOM.BoxIntersects(this.absBox, CF.absBox)==false  )	return;	

		var timeLeft = this.shotCooldown + this.coolShot - GAMEMODEL.gameClock.elapsedMS();
		if(timeLeft <= 0)		this.beginShoot();
		if(timeLeft <= 0)		this.shotCooldown = GAMEMODEL.gameClock.elapsedMS();
	}
	else if(this.enemyClass == "WHEELMAN" && this.enemyType < 10) {
		var timeLeft = this.shotCooldown + this.coolShot - GAMEMODEL.gameClock.elapsedMS();
		if(timeLeft <= 0)		this.beginShoot();
		if(timeLeft <= 0)		this.shotCooldown = GAMEMODEL.gameClock.elapsedMS();
	}
};
CircleEnemy.prototype.beginShoot = function() {
	if(this.enemyClass == "LEGGIONAIRRE" && this.enemyType < 10) {
		var rock = BulletActor.alloc();
		rock.updatePosition(this.position);

		rock.heading.x = 0;
		rock.heading.y = 1;
		if(this.target && this.enemyType >= 1)	rock.heading=this.getHeadingAt(this.target.absPosition);

		rock.shiftPosition({x: rock.heading.x* this.size.w / 2, y: rock.heading.y* this.size.h / 2});
		rock.firer = this;
		GAMEMODEL.gameSession.gameWorld.addActor(rock, 'bullet');
	}
	else if(this.enemyClass == "WHEELMAN" && this.enemyType < 10) {
		var rock = BulletActor.alloc();
		rock.updatePosition(this.position);
		rock.heading.x = 0;
		rock.heading.y = 1;
		if(this.target)						rock.heading=this.getHeadingAt(this.target.absPosition);

		rock.shiftPosition({x: rock.heading.x* this.size.w / 2, y: rock.heading.y* this.size.h / 2});
		rock.firer = this;
		GAMEMODEL.gameSession.gameWorld.addActor(rock, 'bullet');
	}
};


CircleEnemy.prototype.updateCurrentAnimation = function()
{
};

CircleEnemy.prototype.updateMode = function()
{
	var curtime = GAMEMODEL.gameClock.elapsedMS();
};

CircleEnemy.prototype.collide = function(act) {
	EnemyActor.prototype.collide.call(this,act);
};
CircleEnemy.prototype.collideType = function(act) {
	if(act instanceof PlayerShotActor)		return true;
	return false;
};
CircleEnemy.prototype.collideVs = function(act) {
	if(act instanceof PlayerShotActor)
	{
		var d1 = (act.position.x - this.position.x);
		var d2 = (act.position.y - this.position.y);
		var d = d1*d1 + d2*d2;

		var r = (act.radius+this.radius);
		r=r*r;

		if(d <= r) {
			act.beginDeath();
			this.health -= act.damage;
			if(this.health < 0) {
				this.beginDeath();
			}
			else if(GAMEVIEW.BoxIsInCamera(this.absBox))
			{
				var r =	1.7 + 0.3 * Math.random();
				var v = 0.45 + 0.1 * Math.random();

				act.playSound(1, v, r);
			}
		}
	}
};


CircleEnemy.alloc = function()
{
	var vc = new CircleEnemy();
	vc.init();
	return vc;
};
