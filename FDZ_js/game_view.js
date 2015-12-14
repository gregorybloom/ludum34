
GAMEVIEW={
	screen: {w:0,h:0},
	context: null,
	loadedImgs: {},
	
    worldPt: {},
    worldPt2: {},
    worldDim: {},
        
	drawPt: {},
	drawSize: {},
	drawModifiers: {},

	avgTick: 0,
	lastTick: 0,
	
	MAXSAMPLES: 100,
	tickindex: 0,
	ticksum: 0,
	ticklist: {},
	
	clipset: false,

	boundTexture: -1,
	drawcount: 0	
};

GAMEVIEW.init = function()
{
	if( !this.loadTextures() )		return false;

	return true;
};
GAMEVIEW.loadTextures = function()
{
	return true;
};
GAMEVIEW.set = function(screendim, cont)
{
	this.screen.w = screendim.w;
	this.screen.h = screendim.h;
	this.context = cont;	
};
GAMEVIEW.loadImg = function(num, imgsrc)
{
	if(typeof this.loadedImgs[num] === "undefined")		this.loadedImgs[num] = {};
	this.loadedImgs[num].src = imgsrc;
	this.loadedImgs[num].img = new Image();
	this.loadedImgs[num].img.src = imgsrc;
};
GAMEVIEW.detectWebGLSupport = function() {
	if (window.WebGLRenderingContext) {
//     	webGLcanvasApp()
	} else if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//     	html5CanvasAppFMobile()
    } else {
//	    html5CanvasApp()
    }
};
GAMEVIEW.setDrawPt = function(x,y)
{
    this.drawPt.x = x;
    this.drawPt.y = y;
};
GAMEVIEW.setWorldPt = function(x,y)
{
    this.worldPt.x = x;
    this.worldPt.y = y;
};
GAMEVIEW.setWorldPt2 = function(x,y)
{
    this.worldPt2.x = x;
    this.worldPt2.y = y;
};
GAMEVIEW.setWorldDim = function(w,h)
{
    this.worldDim.w = w;
    this.worldDim.h = h;
};
GAMEVIEW.fetchCamera = function(type)
{
	if(type === "game") {
		if(GAMEMODEL.gameSession instanceof SessionActor && GAMEMODEL.gameSession.gameCamera instanceof ViewCamera) {
			return GAMEMODEL.gameSession.gameCamera;
		}
	}
	if(type === "screen") {
		if(GAMEMODEL.gameScreens instanceof ScreenManager && GAMEMODEL.gameScreens.screenCamera instanceof ViewCamera) {
			return GAMEMODEL.gameScreens.screenCamera;
		}
	}
	if(type === "model") {
		if(GAMEMODEL.modelCamera instanceof ViewCamera) {
			return GAMEMODEL.modelCamera;
		}
	}


	if(GAMEMODEL.gameSession instanceof SessionActor && GAMEMODEL.gameSession.gameCamera instanceof ViewCamera) {
		return GAMEMODEL.gameSession.gameCamera;
	}
	if(GAMEMODEL.modelCamera instanceof ViewCamera) {
		return GAMEMODEL.modelCamera;
	}
};


GAMEVIEW.calcAverageTick = function(newtick)
{
	if(typeof this.ticklist[ this.tickindex ] === "undefined")
	{
		this.ticklist[ this.tickindex ] = 0;
	}
	
	this.ticksum -= this.ticklist[ this.tickindex ];
	this.ticksum += newtick;
	
	this.ticklist[ this.tickindex ] = newtick;
	this.tickindex = this.tickindex+1;
	
	if( this.tickindex == this.MAXSAMPLES )
	{
		this.tickindex = 0;
		var fps = Math.floor(1000/(this.ticksum/this.MAXSAMPLES));
	}

	return (this.ticksum/this.MAXSAMPLES);
};

GAMEVIEW.BoxIsInCamera = function(box, shift)
{
	if(typeof shift === "undefined")	shift = {x:0, y:0};
	if(typeof shift.x === "undefined")	shift.x = 0;
	if(typeof shift.y === "undefined")	shift.y = 0;
	
	var camera = GAMEMODEL.gameCamera;
	if(camera != null && camera instanceof GameCamera)
	{
		var absBox = camera.absBox;
		var shiftBox = {x:box.x, y:box.y, w:box.w, h:box.h};
		shiftBox.x = shiftBox.x+shift.x;
		shiftBox.y = shiftBox.y+shift.y;

		return GAMEGEOM.BoxIntersects(absBox, shiftBox);
	}
	return false;
};
GAMEVIEW.clearDrawMods = function()
{
	for(var i in this.drawModifiers)
	{
		delete this.drawModifiers[i];
	}
};

GAMEVIEW.PtToDrawCoords = function(absPt, vShift)
{
	if(typeof vShift === "undefined")	vShift = null;
	
	var zoom = GAMEMODEL.gameCamera.zoom;

	var camShift = GAMEMODEL.gameCamera.getCameraShift();
	camShift.x = camShift.x;
	camShift.y = camShift.y;

	var drawPt = {x:0,y:0};
	if(absPt != null)			drawPt.x += absPt.x;
	if(absPt != null)			drawPt.y += absPt.y;
	if(camShift.x != null)		drawPt.x -= camShift.x;
	if(camShift.y != null)		drawPt.y -= camShift.y;
	if(vShift != null)			drawPt.x += vShift.x;
	if(vShift != null)			drawPt.y += vShift.y;

	drawPt.x = drawPt.x/zoom;
	drawPt.y = drawPt.y/zoom;

	return drawPt;
};
GAMEVIEW.BoxToDrawCoords = function(absBox, vShift)
{
	if(typeof vShift === "undefined")	vShift = null;

	var zoom = GAMEMODEL.gameCamera.zoom;

	var drawBox = {x:0,y:0,w:0,h:0};
	var drawPt = GAMEVIEW.PtToDrawCoords(absBox, vShift);
	
	drawBox.x = drawPt.x;
	drawBox.y = drawPt.y;
	drawBox.w = absBox.w/zoom;
	drawBox.h = absBox.h/zoom;

	return drawBox;
};

GAMEVIEW.updateAll = function()
{
	if(GAMEMODEL.gameMode === "GAME_RUN")
	{
		var newTick = GAMEMODEL.gameClock.elapsedMS();

		var TickDiff = newTick - this.lastTick;
		this.avgTick = GAMEVIEW.calcAverageTick( TickDiff );
				
		this.lastTick = newTick;
	}
};
GAMEVIEW.drawAll = function()
{
	this.context.fillStyle = "#FFFFFF";
	this.context.fillRect( 0, 0, this.screen.w, this.screen.h );
	
	if(GAMEMODEL.gameMode !== "GAME_INIT")		GAMEMODEL.drawAll();
};




/*		GAMEVIEW.drawFromAnimationFrame( frame, this.target.absPosition, {x:0,y:0}, this.target.absBox.ptC, this.target.drawLayer, null );
/**/
GAMEVIEW.drawFromAnimationFrame = function(frame, absPosition, vShift, drawPt, dLayer, filter)
{
	if(frame == null)	return;
	
	var imgFrame = GAMEANIMATIONS.getImageFrame(frame.imgNum, frame.imgFrameNum);
	if(imgFrame == null)	return;
	
	var drawSize = {w:0,h:0};
	drawSize.w = frame.scale.w*imgFrame.dim.w;
	drawSize.h = frame.scale.h*imgFrame.dim.h;
	drawSize.w = Math.abs(drawSize.w);
	drawSize.h = Math.abs(drawSize.h);
	
	var drawBox = {w:drawSize.w,h:drawSize.h};
	drawBox.x = absPosition.x - imgFrame.baseKeypt.x*frame.scale.w;
	drawBox.y = absPosition.y - imgFrame.baseKeypt.y*frame.scale.h;
		
	if( !GAMEVIEW.BoxIsInCamera(drawBox) )		return;

	if(typeof vShift === "undefined")	vShift = null;
	if(vShift == null)			vShift = {x:0,y:0};
	vShift.x -= imgFrame.baseKeypt.x*frame.scale.w;
	vShift.y -= imgFrame.baseKeypt.y*frame.scale.h;
		
	// convert to screen values
	var zoom = GAMEMODEL.gameCamera.zoom;
	drawSize.w = drawSize.w / zoom;
	drawSize.h = drawSize.h / zoom;
	
	var drawPos = GAMEVIEW.PtToDrawCoords(absPosition, vShift);

	if(typeof this.loadedImgs[frame.imgNum] === "undefined")	return;
	var img = this.loadedImgs[frame.imgNum].img;
	if(typeof img === "undefined" || img == null)	return;
		
		//draw frame
		this.context.save();

		this.context.scale(1,1);
		this.context.drawImage(img, 

			imgFrame.pos.x,imgFrame.pos.y,   //sprite sheet top left 
			imgFrame.dim.w, imgFrame.dim.h,    	//sprite sheet width/height
//			Math.floor(drawPos.x), Math.floor(drawPos.y), //destination x/y
			drawPos.x, drawPos.y, //destination x/y
			drawSize.w, drawSize.h     
			   //destination width/height  (this can be used to scale)
		);


//		this.context.restore();

};

GAMEVIEW.fillBox = function(absBox, color)
{
	if(typeof color === "undefined")		color = "#FF0000";

	if( !GAMEVIEW.BoxIsInCamera(absBox) )		return;
	
	var drawBox = GAMEVIEW.BoxToDrawCoords(absBox);

	this.context.fillStyle=color;
	this.context.fillRect(drawBox.x, drawBox.y, drawBox.w, drawBox.h);
};
GAMEVIEW.drawBox = function(absBox, color, width)
{
	if(typeof color === "undefined")		color = "#FF0000";
	if(typeof width === "undefined")		width = 1;

	if( !GAMEVIEW.BoxIsInCamera(absBox) )		return;
	
	var drawBox = GAMEVIEW.BoxToDrawCoords(absBox);
	
	this.context.beginPath();
	this.context.rect(  drawBox.x, drawBox.y, drawBox.w, drawBox.h);
	this.context.lineWidth = width;
	this.context.strokeStyle = color;
	this.context.stroke();	
};
GAMEVIEW.drawCircle = function(centerPt, radius, color, width)
{
	if(typeof color === "undefined")		color = "#FF0000";
	if(typeof width === "undefined")		width = 1;

	var absBox = {x:centerPt.x,y:centerPt.y,w:radius*2,h:radius*2};
	absBox.x = absBox.x - radius;
	absBox.y = absBox.y - radius;

	if( !GAMEVIEW.BoxIsInCamera(absBox) )		return;
	
	var zoom = GAMEMODEL.gameCamera.zoom;

	var drawCenter = GAMEVIEW.PtToDrawCoords(centerPt);

	radius = radius/zoom;

	this.context.beginPath();
	this.context.arc(drawCenter.x, drawCenter.y, radius, 0,2*Math.PI);
	this.context.lineWidth = width;
	this.context.strokeStyle = color;
	this.context.stroke();	
};
GAMEVIEW.fillCircle = function(centerPt, radius, color)
{
	if(typeof color === "undefined")		color = "#FF0000";

	var absBox = {x:centerPt.x,y:centerPt.y,w:radius*2,h:radius*2};
	absBox.x = absBox.x - radius;
	absBox.y = absBox.y - radius;

	if( !GAMEVIEW.BoxIsInCamera(absBox) )		return;
	
	var zoom = GAMEMODEL.gameCamera.zoom;

	var drawCenter = GAMEVIEW.PtToDrawCoords(centerPt);

	radius = radius/zoom;

	this.context.beginPath();
	this.context.arc(drawCenter.x, drawCenter.y, radius, 0,2*Math.PI);
	this.context.fillStyle = color;
	this.context.fill();	
};

GAMEVIEW.drawLine = function(absPt1, absPt2, color, width)
{
	if(typeof color === "undefined")		color = "#FF0000";
	if(typeof width === "undefined")		width = 1;

//	if( !GAMEVIEW.BoxIsInCamera(absPt1) )		return;		// LINE vs BOX
	
	var drawPt1 = GAMEVIEW.PtToDrawCoords(absPt1);
	var drawPt2 = GAMEVIEW.PtToDrawCoords(absPt2);

	this.context.moveTo(drawPt1.x, drawPt1.y);
	this.context.lineWidth = width;
	this.context.strokeStyle = color;
	this.context.lineTo(drawPt2.x, drawPt2.y);
	this.context.stroke();	
};
GAMEVIEW.drawShape = function(pos, pts, transf, color, mode, width)
{
	if(this.clipset == false)	this.context.save();

	if(mode == "clip")			this.clipset = true;
    if(mode == "restore") {
	    this.context.restore();
	    this.clipset = false;
//	    this.context.save();
	    return;
    }


	if(typeof color === "undefined")		color = "#FF0000";
	if(typeof width === "undefined")		width = 1;

	var absBox = {x:0,y:0,w:0,h:0};
	for(var i in pts) {
		absBox.x = pts[i].x + transf.t2.x;	
		absBox.y = pts[i].y + transf.t2.y;
		absBox.w = absBox.x*absBox.x + absBox.y*absBox.y;
		if(absBox.h < absBox.w)		absBox.h = absBox.w;
	}
	absBox.w = Math.sqrt(absBox.h)*2;
	absBox.h = absBox.w;
	absBox.x = pos.x + transf.t1.x - absBox.w/2;	
	absBox.y = pos.y + transf.t1.y - absBox.h/2;	

//	this.drawBox(absBox);
	if( !GAMEVIEW.BoxIsInCamera(absBox) )		return;


	var zoom = GAMEMODEL.gameCamera.zoom;
	var drawPt = this.PtToDrawCoords(pos);

			this.context.translate(drawPt.x, drawPt.y);
		    this.context.translate(transf.t1.x/zoom, transf.t1.y/zoom);

	        var a = transf.ang*Math.PI/180;

        this.context.rotate(a);
	    this.context.translate(transf.t2.x/zoom, transf.t2.y/zoom);

	    this.context.beginPath();

	    	for(var i in pts) {
	    		if(pts[i].t=='m')		this.context.moveTo(pts[i].x/zoom, pts[i].y/zoom);
    			if(pts[i].t=='l')		this.context.lineTo(pts[i].x/zoom, pts[i].y/zoom);
				if(pts[i].t=='b')		this.context.bezierCurveTo(pts[i].x1/zoom,pts[i].y1/zoom, pts[i].x2/zoom,pts[i].y2/zoom, pts[i].xb/zoom,pts[i].yb/zoom);
				if(pts[i].t=='a')		this.context.arc(pts[i].x,pts[i].y, pts[i].r/zoom, pts[i].ar1,pts[i].ar2,false);
				if(pts[i].t=='r')		this.context.rect(pts[i].x,pts[i].y, pts[i].w,pts[i].h);
	        }


	        if(mode == "fill") {
	        	this.context.fillStyle = color;
	        	this.context.fill();
	        }
	        else if(mode == "stroke"){
				this.context.lineWidth = width;
				this.context.strokeStyle = color;
	    	    this.context.stroke();
	    	}

	    	this.context.closePath();

	        if(mode == "clip"){
			    this.context.clip();
			}
        
			    this.context.translate(-transf.t2.x/zoom, -transf.t2.y/zoom);
		        this.context.rotate(-a);
			    this.context.translate(-transf.t1.x/zoom, -transf.t1.y/zoom);
				this.context.translate(-drawPt.x, -drawPt.y);

	if(this.clipset == false)	this.context.save();
};

GAMEVIEW.fillText = function(absPt, text, font, color)
{
	if(typeof color === "undefined")		color = "#FF0000";

//	if( !GAMEVIEW.BoxIsInCamera(absPt1) )		return;		// LINE vs BOX
	
	var drawPt = GAMEVIEW.PtToDrawCoords(absPt);

	this.context.font = font;
	this.context.fillStyle = color;
	this.context.fillText(text,drawPt.x,drawPt.y);
};
GAMEVIEW.drawText = function(absPt, text, font, color, width)
{
	if(typeof color === "undefined")		color = "#FF0000";
	if(typeof width === "undefined")		width = 1;

//	if( !GAMEVIEW.BoxIsInCamera(absPt1) )		return;		// LINE vs BOX
	
	var drawPt = GAMEVIEW.PtToDrawCoords(absPt);
	var tfont =	this.context.font;


	this.context.font = font;
	this.context.lineWidth = width;
	this.context.strokeStyle = color;
	this.context.strokeText(text,drawPt.x,drawPt.y);

	this.context.font = tfont;
};


GAMEVIEW.drawEllipses = function(pos, size, ellshift, fill, a, color, width) {
	var kappa = 0.5522848;

	var t = {t1:{x:0,y:0},t2:ellshift, ang:a};
	var pt = {x:0,y:0};
	var endX = pt.x + size.w/2;
	var endY = pt.y + size.h/2;
	var baseX = pt.x - size.w/2;
	var baseY = pt.y - size.h/2;
	var offX = kappa* size.w/2;
	var offY = kappa* size.h/2;

	var pts = [ {t:'m',x:baseX,y:pt.y} ];
	pts.push( {t:'b',x1:baseX,y1:(pt.y-offY),	x2:(pt.x-offX),y2:baseY,	xb:pt.x,yb:baseY} );
	pts.push( {t:'b',x1:(pt.x+offX),y1:baseY,	x2:endX,y2:(pt.y-offY),		xb:endX,yb:pt.y} );
	pts.push( {t:'b',x1:endX,y1:(pt.y+offY),	x2:(pt.x+offX),y2:endY,		xb:pt.x,yb:endY} );
	pts.push( {t:'b',x1:(pt.x-offX),y1:endY,	x2:baseX,y2:(pt.y+offY),	xb:baseX,yb:pt.y} );

	if(fill == true)		fill = "fill";
	else if(fill == false)	fill = "stroke";
	if(!width)		width=1;

	GAMEVIEW.drawShape(pos, pts,  t, color, fill, width);
};
GAMEVIEW.drawEqTri = function(side, pos, fill, a, color, width) {
	var h = side * 0.866025;
	var t = {t1:{x:0,y:0},t2:{x:0,y:-5}, ang:a};
	pts = [ {t:'m',x:0,y:(-h/2)} ];
	pts.push( {t:'l',x:(-side/2),y:(h/2)} );
	pts.push( {t:'l',x:(side/2),y:(h/2)} );
	pts.push( {t:'l',x:0,y:(-h/2)} );

	if(fill == true)		fill = "fill";
	else if(fill == false)	fill = "stroke";
	if(!width)		width=1;

	GAMEVIEW.drawShape(pos, pts, t, color, fill, width);
};

