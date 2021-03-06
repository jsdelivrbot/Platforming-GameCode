//has scrolling in the y direction

function hitBox(width, height, thickness, x, y) {
	//thickness tells you how thick the region will be
	//x and y are the initial x and y cooordinates of the upper left corner of the box
	//points a-H is used for hit detection with other objects and platforms
	this.x = x;
	this.y = y;
	this.w = width;
	this.h = height;
	this.t = thickness;
	this.a = [x,y+thickness+(height/5)]; //offsetted a little bit to fix hitbox
	this.b = [x+thickness+(width/5),y];
	this.c = [x+width-thickness-(width/5),y];
	this.d = [x+width,y+thickness+(height/5)];
	this.e = [x+width,y+height-thickness-(height/5)];
	this.f = [x+width-thickness-(width/5),y+height];
	this.g = [x+thickness+(width/5),y+height];
	this.H = [x,y+height-thickness-(height/5)]; //NOTE THE UPPER CASE H TO DISTINGUISH FROM HEIGHT
	
	//this function will print all values to console
	this.log = function() {
		for (var key in this) {
			if (typeof this[key] != "function") {
				console.log(key + ": " + this[key]);
			}
		}
	}
	
	//this function updates every single point
	this.updatePoint = function(newX,newY) {
		this.x = newX;
		this.y = newY;
		this.a = [newX,newY+this.t+(this.h/5)]; //offsetted a little bit to fix hitbox
		this.b = [newX+this.t+(this.w/5),newY];
		this.c = [newX+this.w-this.t-(this.w/5),newY];
		this.d = [newX+this.w,newY+this.t+(this.h/5)];
		this.e = [newX+this.w,newY+this.h-this.t-(this.h/5)];
		this.f = [newX+this.w-this.t-(this.w/5),newY+this.h];
		this.g = [newX+this.t+(this.w/5),newY+this.h];
		this.H = [newX,newY+this.h-this.t-(this.h/5)];
	}
	
	//this function updates the dimensions of the box
	this.updateDim = function(newW,newH,newT) {
		//pass in 0's to the parameters you don't want to change
		this.w = newW || this.w;
		this.h = newH || this.h;
		this.t = newT || this.t;
		this.a = [this.x,this.y+this.t];
		this.b = [this.x+this.t,this.y];
		this.c = [this.x+this.w-this.t,this.y];
		this.d = [this.x+this.w,this.y+this.t];
		this.e = [this.x+this.w,this.y+this.h-this.t];
		this.f = [this.x+this.w-this.t,this.y+this.h];
		this.g = [this.x+this.t,this.y+this.h];
		this.H = [this.x,this.y+this.h-this.t];
	}
	
	this.inBox = function(x,y,bool) {
		//returns a boolean array, 1st element being whether it is in the left box, 2nd in the right box
		//3rd in the upper box, 4th in the lower box
		/* looks like this:
		-------------------
		|__|_____3_____|__|
		|  |           |  |
		|1 |           |2 |
		|  |           |  |
		|--|-----------|--|
		|__|_____4_____|__|*/
		//the 5th determines whether it is inside the outer box as a whole, neglecting the inside box
		//the corners overlap, passing for true for both sections
		//1 or true corresponds to inside, 0 or false corresponds to outside
		//pass 1 into bool to see the console log the results
		var result = [];
		var temp = ( (x >= this.x) && (x <= this.x +this.t) ) && ( (y >= this.y) && (y <= this.y +this.h));
		result.push(temp);
		temp = ( (x >= this.x + this.w - this.t) && (x <= this.x +this.w) ) && ( (y >= this.y) && (y <= this.y + this.h) );
		result.push(temp);
		temp = ( (x >= this.x)  && (x <= this.x + this.w) ) && ( (y >= this.y) && (y <= this.y + this.t) );
		result.push(temp);
		temp = ( (x >= this.x)  && (x <= this.x + this.w) ) && ( (y >= this.y + this.h - this.t) && (y <= this.y + this.h) );
		result.push(temp);
		temp = ( (x >= this.x)  && (x <= this.x + this.w) ) && ( (y >= this.y) && (y <= this.y + this.h) );
		result.push(temp);
		if (bool) {
			result.forEach(function(value, index) {
				console.log("" + (index + 1) + ": " + value);
			}
			);
		}
		return result;
	}
	
	this.drawBox = function() {
		fill('aquamarine');
		noStroke(); //rect(x,y,w,h);
		rect(this.x,this.y,this.w,this.t);
		rect(this.x,this.y,this.t,this.h);
		rect(this.H[0],this.H[1]+(this.h/5),this.w,this.t);
		rect(this.c[0]+(this.w/5),this.c[1],this.t,this.h);
		fill('blue');
  		stroke('blue');
  		strokeWeight(1);
  		textLeading(15);
  		textSize(11);
  		text("A",this.a[0],this.a[1]);
  		text("B",this.b[0],this.b[1]);
  		text("C",this.c[0],this.c[1]);
  		text("D",this.d[0],this.d[1]);
  		text("E",this.e[0],this.e[1]);
  		text("F",this.f[0],this.f[1]);
  		text("G",this.g[0],this.g[1]);
  		text("H",this.H[0],this.H[1]);
	}
}





function scrollCanvas(x,y,w,h) {
	//its position is given by the upper left corner
	this.x = x; //in world/scroll coordinates
	this.y = y;
	this.w = w;
	this.h = h;
}





function scrollPlatform(x,y,w,h) {
	//has multiple platforms all under one object
	//uses arrays, first index corresponding to the initial platform, second one to the second platform
	//and so on
	this.x = [x]; //x and y are in world/scroll coordinates
	this.y = [y];
	this.w = [w];
	this.h = [h];

	this.init = false;
	this.pushed = true;
	this.xi = 0; //temp variables used to initialize new platform
	this.yi = 0;
	this.xf = 0;
	this.yf = 0;
	this.addPlatform = function(x,y,w,h) {
		this.x.push(x);
		this.y.push(y);
		this.w.push(w);
		this.h.push(h);
	}
	
	//This function is to create platforms by dragging the mouse, for testing purposes.
	//Function is called when the mouse is pressed on canvas, init is a member variable
	//that must be set to false initially before you use the function in order to initialize an
	//initial point
	//REQUIRES scrollCanvas object
	this.createPlatform = function(canvas) {
		if (!this.init) {
			this.init = true;
			this.xi = mouseX + canvas.x; //these are temp variables used for the vertex of the rectangle
			this.yi = mouseY + canvas.y;
			this.pushed = false; //used to make sure you only push once
		}
		noFill();
		stroke('red');
		strokeWeight(4);
		this.xf = mouseX + canvas.x;
		this.yf = mouseY + canvas.y;
		rect(this.xi-canvas.x,this.yi-canvas.y,this.xf-this.xi,this.yf-this.yi); //must subtract off canvasX and canvasY before you draw
	}
	
	//p is an array [x,y] representing a point to test
	//REQUIRES scrollCanvas object
	this.inRect = function(p,canvas) {
		var hitTest = false;
		for (var i = 0; i < this.x.length; i++) {
    		hitTest = ( (p[0] >= this.x[i]-canvas.x) && (p[0] <= this.x[i] - canvas.x + this.w[i]) ) && ( (p[1] >= this.y[i] - canvas.y) && (p[1] <= this.y[i] - canvas.y + this.h[i]) );
			if (hitTest) { //if a point is in any of the platforms, break out, no need for computation
				break;
			}
		}
		return hitTest;
	}
	//REQUIRES scrollCanvas object
	this.drawRect = function(canvas) {
		fill('red');
		noStroke(); //rect(x,y,w,h);
		for (var i = 0; i < this.x.length; i++) {
			if ( (this.x[i] - canvas.x >= -this.w[i]) && (this.x[i] - canvas.x <= canvas.w) && (this.y[i] - canvas.y >= -this.h[i]) && (this.y[i] - canvas.y <= canvas.h) )
				rect(this.x[i]-canvas.x,this.y[i]-canvas.y,this.w[i],this.h[i]);
		}
	}
}






//needs canvas object to construct a player object
function scrollPlayer(x,y,d,canvas) {
	//uses an ellipse to test hit detection and gravity
	//width and height are the diameters/major and minor axes
	//hitBox(width,height,thickness,x,y)
	
	//these are in canvas coordinates
	this.x = x;
	this.y = y;
	this.d = d;
	this.maxX = (canvas.w)/2 + (canvas.w)/6;
	this.minX = (canvas.w)/2 - (canvas.w)/6;
	this.maxY = (canvas.h)/2;
	this.minY = (canvas.h)/2 - (canvas.h)/5;

	this.hitBox = new hitBox(d,d,7,x-(d/2),y-(d/2));
	
	//updates both player and hitbox
	//only update player and hitbox when minX<=x<=maxX
	//otherwise update canvas object coordinates
	//REQUIRES a scrollCanvas object
	this.updatePoint = function(canvas) {
		if ( (this.x >= this.minX) && (this.x <= this.maxX) ) {
			this.x = this.x + this.xVelocity;
		} else if ((this.x <= this.minX && this.xVelocity > 0) || (this.x >= this.maxX && this.xVelocity < 0)) {
			this.x = this.x + this.xVelocity;
			} else {
				canvas.x = canvas.x + this.xVelocity;
			}
		if ( (this.y >= this.minY) && (this.y <= this.maxY) ) {
			this.y = this.y + this.yVelocity;
		} else if ( (this.y >= this.maxY && this.yVelocity < 0) || (this.y <= this.minY && this.yVelocity > 0) ) {
			this.y = this.y + this.yVelocity;
			} else {
				canvas.y = canvas.y + this.yVelocity;
			}
		this.hitBox.updatePoint(this.x-(this.d/2),this.y-(this.d/2));
	}

	this.drawPlayer = function() {
		stroke('black');
		strokeWeight(5);
		fill('red');
		ellipse(this.x,this.y,this.d,this.d);
	}
	
	
	// If gravity is true, no jumping and y acceleration downward begins
	//If gravity is false, you can jump and no y acceleration downward
	this.gravity = true;

	
	//stores booleans for each point that is hit from hitTest method
	this.hit = {
		a: false,
		b: false,
		c: false,
		d: false,
		e: false,
		f: false,
		g: false,
		H: false
	};
	
	
	//NEEDS a platform object AND a scrollCanvas object, stores it in hit property
	this.hitTest = function(platform,canvas) {
			this.hit = {
			a: platform.inRect(this.hitBox.a,canvas),
			b: platform.inRect(this.hitBox.b,canvas),
			c: platform.inRect(this.hitBox.c,canvas),
			d: platform.inRect(this.hitBox.d,canvas),
			e: platform.inRect(this.hitBox.e,canvas),
			f: platform.inRect(this.hitBox.f,canvas),
			g: platform.inRect(this.hitBox.g,canvas),
			H: platform.inRect(this.hitBox.H,canvas),
		};
	}
	
	
	//these tell you how much to change x and y by
	this.xVelocity = 0;
	this.yVelocity = 0;

	
	//the collision tests are ALWAYS the first thing you compute. This is used
	//for the friction and gravity functions, as well removing x and y velocity in collisions.
	this.collisionTest = function() {
		if (this.hit.d || this.hit.e || this.hit.a || this.hit.H) {
			this.xVelocity = 0;
		}
		//when you get hit from above, set y movement to zero, but
		//only when you are moving upwards to prevent the resetting of gravity
		if ( (this.hit.b || this.hit.c) && this.yVelocity < 0) {
			this.yVelocity = 0;
			this.yVelocity = this.yVelocity + 1;
		}
		if (this.hit.g || this.hit.f) {
			this.gravity = false;
			this.yVelocity = 0;
		} else {
			this.gravity = true;
		}
	}

	
	//this depends on the hit and gravity properties
	this.keyPress = function() {
		if (keyIsDown(RIGHT_ARROW) && !this.hit.d && !this.hit.e) {
    		if (this.xVelocity < 10) //max speed
    			this.xVelocity = this.xVelocity + 0.8;
		}
		if (keyIsDown(LEFT_ARROW) && !this.hit.a && !this.hit.H) {
    		if (this.xVelocity > -10)
    			this.xVelocity = this.xVelocity - 0.8;
		}
		//this is mostly meant for crouching, not implemented yet:
		//if (keyIsDown(DOWN_ARROW)  && !hit.g && !hit.f)
    	//	y+=5;
		if (keyIsDown(UP_ARROW) && !this.gravity) {
    		this.yVelocity = -15;
    		this.gravity = true;
		}
	}

	
	this.doGravity = function() {
		if (this.gravity) {
			if (this.yVelocity < 15)
				this.yVelocity = this.yVelocity + 0.5;
		}
	}

	
	//slows xVelocity to a stop
	this.doFriction = function() {
		if ((this.xVelocity > 0) && !keyIsDown(RIGHT_ARROW)) {
			this.xVelocity = this.xVelocity - 1.5;
			if (this.xVelocity <= 0) { //when it finally stops moving, make sure the velocity stays 0
				this.xVelocity = 0;
			}
		}
		if ((this.xVelocity < 0) && !keyIsDown(LEFT_ARROW)) {
			this.xVelocity = this.xVelocity + 1.5;
			if (this.xVelocity >= 0) {
				this.xVelocity = 0;
			}
		}		
	}

}