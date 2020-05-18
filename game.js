var gameState = 0;
var menuOption = 0;
var menu_options = ["Start", "Change Starting Difficulty"];
window.baseDifficulty = 10;
var MAX_OPTIONS = menu_options.length;
/*
0 = menu
1 = InGame
2 = Paused
3 = Game Over
*/
let Obstacles = []; 

let Obstacle = function(start, end, speed, size, type){
	this.start = start;
	this.end = end;
	this.speed = speed;
	this.type = type;
	this.topLeft = [Math.random() * size, Math.random() * size];
	this.topRight = [Math.random() * size, Math.random() * size];
	this.bottomRight = [Math.random() * size, Math.random() * size];
	this.bottomLeft = [Math.random() * size, Math.random() * size];
}

Obstacle.prototype.moveToEnd = function(){
	this.topLeft[1] += this.speed;
	this.topRight[1] += this.speed;
	this.bottomRight[1] += this.speed;
	this.bottomLeft[1] += this.speed;
}

var gameStart = 0;
var lastTime = 0;
var objectCount = 0;
window.savedScore = 0;
window.scoreStartTime = 0;
window.score = 0;

function renderObjects(shouldUpdate)
{
	var collision = 0;
	for(var i = 0; i < Obstacles.length; i++)
	{
		if(Obstacles[i] != undefined && Obstacles[i].topLeft[1] >= height){
			delete Obstacles[i];
		}
		
		var obj = Obstacles[i];
		if(obj == undefined)
			continue;
		
		
		var verts = [];
		verts[0] = createVector(obj.topLeft[0] + obj.start, obj.topLeft[1]);
		verts[1] = createVector(obj.topRight[0] + obj.start, obj.topRight[1]);
		verts[2] = createVector(obj.bottomRight[0] + obj.start, obj.bottomRight[1]);
		verts[3] = createVector(obj.bottomLeft[0] + obj.start, obj.bottomLeft[1]);
		
		if(obj.type == Players[0].state && collideRectPoly(Players[0].x, Players[0].y, Players[0].w, Players[0].h, verts)){
			collision = 1;
			break;
		}
		
		if(obj.type == 0){
			noFill();
			stroke(0,0,0);
		}
		else if(obj.type == 1){
			noFill();
			stroke(255,255,255);
		}
		quad(obj.topLeft[0] + obj.start, obj.topLeft[1], obj.topRight[0] + obj.start, obj.topRight[1], obj.bottomRight[0] + obj.start, obj.bottomRight[1], obj.bottomLeft[0] + obj.start, obj.bottomLeft[1]);
		if(shouldUpdate)
			obj.moveToEnd();
	}
	return collision;
}

function runGame()
{
	var currentTime = Date.now();
	var newScore = (currentTime - scoreStartTime) + savedScore;
	window.score = newScore;
	newScore /= 1000;
	textSize(24);
	textAlign(LEFT);
	text("Score: " + newScore, 0, 20);
	var sinceLast = currentTime - lastTime;
	if(sinceLast > 3000){
		lastTime = currentTime;
		var currentDifficulty = baseDifficulty + newScore;
		objectCount = 0;
		for(var i = 0; i < currentDifficulty; i++){
			var chance = Math.floor(Math.random() * currentDifficulty);
			if(chance > currentDifficulty / 2)
				objectCount++;
			if(chance < currentDifficulty / 2 && objectCount > 0)
				objectCount--;
		}
		
		for(var i = 0; i < objectCount; i++){
			var start = Math.floor(Math.random() * width);
			var end = Math.floor(Math.random() * width);
			var speed = Math.floor(Math.random() * 4) + 3;
			var type = Math.floor(Math.random() * 100) % 2;
			Obstacles.push(new Obstacle(start, end, speed, 50, type));
		}
	}
	
	var collision = renderObjects(true);
	if(collision){
		gameState = 3;
		window.savedScore = window.score;
		Obstacles.length = 0;
	}
}