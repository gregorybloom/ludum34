
function ViewScreen() {
}
ViewScreen.prototype = new Actor;
ViewScreen.prototype.identity = function() {
	return ('ViewScreen (' +this._dom.id+ ')');
};

ViewScreen.prototype.init = function() {
	Actor.prototype.init.call(this);
	
	this.elements = {};

	this.updatePosition(0,0);
	
	this.load();
};

ViewScreen.prototype.clear = function() {
	for(var i in this.elements)
	{
        this.elements[i].clear();
		delete this.elements[i];
	}
	this.elements = {};
};
ViewScreen.prototype.load = function() {

        
};

ViewScreen.prototype.updateAll = function() {
    this.update();
    
    for(var i in this.elements)
    {
    	if(this.elements[i] instanceof Actor)
        {
            this.elements[i].update();
	   }
    }
};
ViewScreen.prototype.drawAll = function() {
    this.draw();
    
    for(var i in this.elements)
    {
    	if(this.elements[i] instanceof Actor)
        {
            this.elements[i].draw();
        }
    }
};


ViewScreen.prototype.distributeInput = function(kInput)
{
	if(kInput.keyID == GAMECONTROL.keyIDs['KEY_DELETE'])		return true;
	if(kInput.keyID == GAMECONTROL.keyIDs['KEY_BACKSPACE'])		return true;
        
        var used = false;
        used = used | this.readInput(kInput);

        for(var i in this.elements)
        {
            if(this.elements[i] instanceof Actor)
            {
                used = used | this.elements[i].readInput(kInput);
            }
        }
        return used;
};




ViewScreen.prototype.update = function() {
	Actor.prototype.update.call(this);	

};
ViewScreen.prototype.draw = function() {

	GAMEVIEW.clearDrawMods();
	GAMEVIEW.context.globalAlpha=1.0;
               
};

ViewScreen.prototype.readInput = function(kInput) {
    var used = false;

    return used;
};

ViewScreen.prototype.cleanAll = function() {

        for(var i in this.elements)
        {
                if(this.elements[i].alive == false)		
                {
                    this.elements[i].clear();
                    delete this.elements[i];
                }
        }	
};



ViewScreen.alloc = function() {
	var vc = new ViewScreen();
	vc.init();
	return vc;
}