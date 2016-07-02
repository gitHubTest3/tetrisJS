$(document).ready(function() {
	field = new Field(11, 20);
	figure = new Figure(Math.floor((Math.random() * 5) + 1));
	window.setInterval(function(){
		figure.lower();
	}, 500);
});

$(document).keydown(function(e) {
   switch(e.keyCode) {
	   case 37://left
			if(!figure.checkCollisions(-1, 0))
				figure.move(-1, 0);
			break;
	   case 39://right
			if(!figure.checkCollisions(1, 0))
				figure.move(1, 0);
			break;
	   case 40://down
			figure.lower();
			break;
		case 32://space
			figure.turn();
			break;
   }
});

var Field = function(width, height) {
	this.width = width;
	this.height = height;
	this.bricksLeft = [];

	var field = document.createElement('div');
	this.field = field;
	$(this.field).css('width', 30*width).css('height', 30*height).addClass("field").appendTo($("body"));
};


Field.prototype.removeFullRows = function() {
	var bricksInRows = new Array(this.height).fill(0);//array containing amount of bricks in every row
	
	$.each(this.bricksLeft, function(){//for each brick in a field
		bricksInRows[this.y]++;//increment value of bricks in a row
	});
	
	for(var i in bricksInRows) {//for each row
		if(bricksInRows[i] == this.width) {//if it's full
			this.bricksLeft = $.map(this.bricksLeft, function(item, index){
				if(item.y == i) {//delete brick
					item.brick.remove();//removing "brick" div
					return null;//doesn't return brick to an array
				} else if(item.y < i) {//lower brick
					item.move(0, 1);
					return item;//returns brick to an array
				}
			});
		}
	}
};

var Figure = function(type) {
	this.type = type;
	var figure = document.createElement('div');
	this.figure = figure;
	$(this.figure).addClass("figure").appendTo($(".field"));
	
	this.state = 1;
	if(this.type == 1 || this.type == 4 || this.type == 5)
		this.statesAmount = 4;
	else if(this.type == 2)
		this.statesAmount = 1;
	else if(this.type == 3)
		this.statesAmount = 2;
	
	this.bricks = [];
	if(type==1) {//platform
		this.bricks[0] = new Brick(this, 4, 0);
		this.bricks[1] = new Brick(this, 5, 0);
		this.bricks[2] = new Brick(this, 6, 0);
		this.bricks[3] = new Brick(this, 5, 1);
	} else if(type==2) {//square
		this.bricks[0] = new Brick(this, 5, 0);
		this.bricks[1] = new Brick(this, 6, 0);
		this.bricks[2] = new Brick(this, 5, 1);
		this.bricks[3] = new Brick(this, 6, 1);
	} else if(type==3) {//line
		this.bricks[0] = new Brick(this, 4, 0);
		this.bricks[1] = new Brick(this, 5, 0);
		this.bricks[2] = new Brick(this, 6, 0);
		this.bricks[3] = new Brick(this, 7, 0);
	} else if(type==4) {//L normal
		this.bricks[0] = new Brick(this, 4, 0);
		this.bricks[1] = new Brick(this, 5, 0);
		this.bricks[2] = new Brick(this, 6, 0);
		this.bricks[3] = new Brick(this, 4, 1);
	} else if(type==5) {//L turned
		this.bricks[0] = new Brick(this, 4, 0);
		this.bricks[1] = new Brick(this, 5, 0);
		this.bricks[2] = new Brick(this, 6, 0);
		this.bricks[3] = new Brick(this, 6, 1);
	}
};

Figure.prototype.lower = function() {
	if(!figure.checkCollisions(0, 1))
		figure.move(0, 1);
	else {
		for(var i in figure.bricks) {
			$(figure.bricks[i].brick).appendTo($(".field"));//moving bricks from previous figure straight onto field
			field.bricksLeft.push(figure.bricks[i]);//bricks goes to an array with left bricks
		}
		
		figure.figure.remove();//removing "figure" div
		
		field.removeFullRows();
		
		figure = new Figure(Math.floor((Math.random() * 5) + 1));
		//TODO: check if figure can be created, if not - game end
	}
};

Figure.prototype.checkCollisions = function(x, y) {
	for(var i in this.bricks) {
        if(this.bricks[i].checkCollisions(x, y))
			return true;
    }
	
	return false;
};

Figure.prototype.move = function(x, y) {
	for(var i in this.bricks)
		this.bricks[i].move(x, y);
};

Figure.prototype.turn = function() {
	var shifts = [];//making array for shifts of every brick in a figure
	for(var i in this.bricks) {//creating 2nd dimension of an array
		shifts[i] = [];
		shifts[i]["x"] = 0;
		shifts[i]["y"] = 0; 
	}
	
	if(this.type == 1) {//setting shifts of bricks in a figure
		if(this.state == 1) {
			shifts[0]["x"] = 2;
			shifts[0]["y"] = 2;
			shifts[1]["x"] = 1;
			shifts[1]["y"] = 1;
		} else if(this.state == 2) {
			shifts[1]["x"] = -1;
			shifts[1]["y"] = 1;
			shifts[2]["x"] = -2;
			shifts[2]["y"] = 2;
		} else if(this.state == 3) {
			shifts[0]["x"] = -2;
			shifts[0]["y"] = -2;
			shifts[1]["x"] = -1;
			shifts[1]["y"] = -1;
		} else if(this.state == 4) {
			shifts[1]["x"] = 1;
			shifts[1]["y"] = -1;
			shifts[2]["x"] = 2;
			shifts[2]["y"] = -2;
		}
	} else if(this.type == 3) {
		if(this.state == 1) {
			shifts[0]["x"] = 2;
			shifts[0]["y"] = -2;
			shifts[1]["x"] = 1;
			shifts[1]["y"] = -1;
			shifts[3]["x"] = -1;
			shifts[3]["y"] = 1;
		} else if(this.state == 2) {
			shifts[0]["x"] = -2;
			shifts[0]["y"] = 2;
			shifts[1]["x"] = -1;
			shifts[1]["y"] = 1;
			shifts[3]["x"] = 1;
			shifts[3]["y"] = -1;
		}
	} else if(this.type == 4) {
		if(this.state == 1) {
			shifts[0]["x"] = 2;
			shifts[0]["y"] = 1;
			shifts[3]["x"] = 2;
			shifts[3]["y"] = 1;
		} else if(this.state == 2) {
			shifts[1]["x"] = -1;
			shifts[1]["y"] = 2;
			shifts[2]["x"] = -1;
			shifts[2]["y"] = 2;
		} else if(this.state == 3) {
			shifts[0]["x"] = -2;
			shifts[0]["y"] = -1;
			shifts[3]["x"] = -2;
			shifts[3]["y"] = -1;
		} else if(this.state == 4) {
			shifts[1]["x"] = 1;
			shifts[1]["y"] = -2;
			shifts[2]["x"] = 1;
			shifts[2]["y"] = -2;
		}
	} else if(this.type == 5) {
		if(this.state == 1) {
			shifts[0]["x"] = 1;
			shifts[0]["y"] = 2;
			shifts[1]["x"] = 1;
			shifts[1]["y"] = 2;
		} else if(this.state == 2) {
			shifts[2]["x"] = -2;
			shifts[2]["y"] = 1;
			shifts[3]["x"] = -2;
			shifts[3]["y"] = 1;
		} else if(this.state == 3) {
			shifts[0]["x"] = -1;
			shifts[0]["y"] = -2;
			shifts[1]["x"] = -1;
			shifts[1]["y"] = -2;
		} else if(this.state == 4) {
			shifts[2]["x"] = 2;
			shifts[2]["y"] = -1;
			shifts[3]["x"] = 2;
			shifts[3]["y"] = -1;
		}
	}

	var collisionOccurs = false;
	for(var i in this.bricks) {//checking collisions
		if(this.bricks[i].checkCollisions(shifts[i]["x"], shifts[i]["y"]))
			collisionOccurs = true;
	}
	
	if(!collisionOccurs) {//rotating figure
		for(var i in this.bricks)
			this.bricks[i].move(shifts[i]["x"], shifts[i]["y"]);
		this.state++;
		if(this.state > this.statesAmount)
			this.state -= this.statesAmount;
	}
};

var Brick = function(figure, x, y) {
	this.figure = figure;
	this.x = x;
	this.y = y;
	var brick = document.createElement('div');
	this.brick = brick;
	$(brick).css('left', 30*x).css('top', 30*y).addClass("brick").appendTo($(this.figure.figure));
};

Brick.prototype.checkCollisions = function(x, y) {
	var newX = this.x + x;
	var newY = this.y + y;
	
	var collisionOccurs = false;
	
	if(newX<0 || newX>field.width-1 || newY<0 || newY>field.height-1)//checking field boundaries
		collisionOccurs = true;

	$.each(field.bricksLeft, function(){//checking collisions with bricks in field
		if(this.x == newX && this.y == newY) {
			collisionOccurs = true;
		}
	});
	
	if(collisionOccurs)
		return true;
	else
		return false;
};

Brick.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
	$(this.brick).css('left', 30*this.x).css('top', 30*this.y);
};