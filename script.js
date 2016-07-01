var figure;
var bricksLeft = [];

$(document).ready(function() {
	figure = new Figure(1);
	window.setInterval(function(){
		//figure.lower();
	}, 500);
});

function lowerFigure() {
	
}

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

var Figure = function(type) {
	this.type = type;
	if(this.type == 1)
		this.statesAmount = 4;
	figure = document.createElement('div');
	this.figure = figure;
	$(figure).addClass("figure").appendTo($(".field"));
	this.state = 1;
	this.bricks = [];
	if(type==1) {
		this.bricks[0] = new Brick(this, 4, 0);
		this.bricks[1] = new Brick(this, 5, 0);
		this.bricks[2] = new Brick(this, 6, 0);
		this.bricks[3] = new Brick(this, 5, 1);
	}
};

Figure.prototype.lower = function() {
	if(!figure.checkCollisions(0, 1))
		figure.move(0, 1);
	else {
		for(var i in figure.bricks) {
			$(figure.bricks[i].brick).appendTo($(".field"));//przeniesienie kostek z poprzedniej figury bezpośrednio na planszę
			bricksLeft.push(figure.bricks[i]);
			//TODO: nie zapisywanie bricksów które już są w tablicy
		}
		
		figure.figure.remove();//usunięcie diva
		
		figure = new Figure(1);//sprawdzanie, czy figura może się pojawić
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
	var positions = [];

	for(var i in this.bricks) {//saving positions of bricks in a figure
		positions[i] = [];//creating 2nd dimension in array
        positions[i]["x"] = this.bricks[i].x;
		positions[i]["y"] = this.bricks[i].y;
	}
	
	if(this.type == 1) {//counting new positions of bricks in a figure
		if(this.state == 1) {
			positions[0]["x"] += 2;
			positions[0]["y"] += 2;
			positions[1]["x"] += 1;
			positions[1]["y"] += 1;
		} else if(this.state == 2) {
			positions[1]["x"] -= 1;
			positions[1]["y"] += 1;
			positions[2]["x"] -= 2;
			positions[2]["y"] += 2;
		} else if(this.state == 3) {
			positions[0]["x"] -= 2;
			positions[0]["y"] -= 2;
			positions[1]["x"] -= 1;
			positions[1]["y"] -= 1;
		} else if(this.state == 4) {
			positions[1]["x"] += 1;
			positions[1]["y"] -= 1;
			positions[2]["x"] += 2;
			positions[2]["y"] -= 2;
		}
	}
	
	var collisionOccurs = false;
	
	if(this.type == 1) {//checking collisions of new positions
		if(this.state == 1) {
			for(var i in this.bricks)
				if(this.bricks[i].checkCollisions(positions[i]["x"], positions[i]["y"]))
					collisionOccurs = true;
		}
	}
	
	if(!collisionOccurs) {//rotating figure
		for(var i in this.bricks)
			this.bricks[i].move(positions[i]["x"], positions[i]["y"]);
		this.state++;
		this.state = this.state % this.statesAmount;
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
	
	if(newX<0 || newX>10 || newY>19)//sprawdzenie krawędzi ekranu
		collisionOccurs = true;

	$.each(bricksLeft, function(){//sprawdzenie wszystkich kostek poza należącymi do figury
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