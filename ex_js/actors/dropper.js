function DropperActor()
{
}

DropperActor.prototype = new Actor;

DropperActor.prototype.identity = function()
{
	return ('DropperActor ()');
};

DropperActor.prototype.init = function()
{
	Actor.prototype.init.call(this);
	this.position = {x: 0, y: 0};
	this.radius = 20;
	this.size = {w: 5, h: 5};
	this.target = null;
	this.actionMode = "MODE_STILL";
	this.started = false;
	this.lastY = 0;
	this.progress = 0;
	this.stage = 0;
	this.subStep = 0;
	this.loadedItems = [];
	this.updatePosition();
};

DropperActor.prototype.draw = function()
{
	//		GAMEVIEW.drawCircle(this.absPosition,this.radius);
};

DropperActor.prototype.update = function()
{
	Actor.prototype.update.call(this);

	if (this.target instanceof Actor)
	{
		this.updatePosition({x: this.position.x, y: this.target.position.y});
	}

	if (!this.started)
	{
		this.started = true;
		this.lastY = this.absPosition.y;
	}
	else
	{
		if (this.lastY > this.absPosition.y)
		{
			this.progress += (this.lastY - this.absPosition.y);
		}

		this.lastY = this.absPosition.y;
	}

	this.tryDrop();
	this.tryCleaning();
};

DropperActor.prototype.snapBack = function(distsnap)
{
	this.lastY -= distsnap;
};

DropperActor.prototype.addLoad = function(_stage, _sub, _dropY, _X, _Y, _payload)
{
	var item = {stage: _stage, subStep: _sub, dropAtY: _dropY, payload: null, target: null};
	item.target = {position: {x: _X, y: _Y}};
	item.payload = _payload;
	this.loadedItems.push(item);
};

DropperActor.prototype.tryDrop = function()
{
	for (var i in this.loadedItems)
	{
		// item.stage, item.subStep, item.dropAtY, item.payload.type, item.payload.data,
		//		item.target.position
		if (this.loadedItems[i].stage == this.stage)
		{
			if (this.loadedItems[i].subStep == this.subStep)
			{
				if (this.loadedItems[i].dropAtY <= this.progress)
				{
					this.dropLoaded(this.loadedItems[i].dropAtY,this.loadedItems[i]);
					this.loadedItems.splice(i, 1);
				}
				else
				{
					return;
				}
			}
			else if (this.loadedItems[i].subStep > this.subStep)
			{
				return;
			}
		}
		else if (this.loadedItems[i].stage > this.stage)
		{
			return;
		}
	}
};

DropperActor.prototype.dropLoaded = function(time,item)
{
	var payload = item.payload;
	var target = item.target;
	var type = item.payload.type;
	var position = item.target.position;
	var actor = null;

	if (type == "SWAYING")
	{
		actor = SwayEnemy.alloc();
	}

	if (type == "CIRCLE")
	{
		actor = CircleEnemy.alloc();
	}
	if (type == "WHEEL")
	{
		actor = WheelEnemy.alloc();
	}
	if (type == "TEXT")
	{
		actor = TextActor.alloc();
	}

	if (actor != null)
	{
		actor.updatePosition({x: 0, y: (GAMEMODEL.gameSession.gameWorld.size.h)});
		actor.shiftPosition({x: position.x, y: (-position.y-time)});

		if (typeof actor.loadingData === "function")
		{
			actor.loadingData(payload.data);
		}

		GAMEMODEL.gameSession.gameWorld.addActor(actor, 'act');
	}
};

DropperActor.prototype.sortLoads = function()
{
	this.loadedItems.sort(function(a,b) {
		return a.dropAtY - b.dropAtY;
	});
};
DropperActor.prototype.tryCleaning = function()
{
	var camera = GAMEMODEL.gameCamera;
	var camshift = camera.getCameraShift();
	var actors = GAMEMODEL.gameSession.gameWorld.gameActors;

	//    var c=0;for(var i in actors)	{if(typeof actors[i]!=="undefined") c++;}
	//    console.log(c);
	for (var i in actors)
	{
		if (actors[i].alive && actors[i] instanceof EnemyActor)
		{
			if(actors[i].position.y > (this.position.y+400+actors[i].deadLength)) {
				if (actors[i] instanceof EnemyActor)		actors[i].alive = false;
				if (actors[i] instanceof SwayEnemy)			actors[i].alive = false;
				if (actors[i] instanceof CircleEnemy)		actors[i].alive = false;
			}
		}
	}
};

DropperActor.alloc = function()
{
	var vc = new DropperActor();
	vc.init();
	return vc;
};
