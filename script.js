$(document).ready(function() {
	var fig = new Figure(1);
	fig.move(0,1);
	//alert(obj.x + " " + obj.y);
});

var Figure = function(type) {
	figure = document.createElement('div');
	this.figure = figure;
	$(figure).addClass("figure").appendTo($(".field"));
	if(type==1) {
		$(figure).css('left', 30*4).css('top', 0);
		new Brick(0,0);
		new Brick(1,0);
		new Brick(2,0);
		new Brick(1,1);
	}
};

Figure.prototype.move = function(x, y) {
    var shiftX = parseInt($(this.figure).css('left')) + x*30;
	var shiftY = parseInt($(this.figure).css('top')) + y*30;
	$(this.figure).css('left', shiftX).css('top', shiftY);
};

var Brick = function(x, y) {
	var brick = document.createElement('div');
	$(brick).css('left', 30*x).css('top', 30*y).addClass("brick").appendTo($(".figure"));
};




//$(document).on('click', '', function() {

//});