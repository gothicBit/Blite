let Players = [];
function menuInput(player)
{
	if(gameState == 0 && player != undefined){
		
		if(player.buttons["ArrowUp"] == true || player.buttons["w"] == true){
			menuOption--;
			if(menuOption < 0)
				menuOption = MAX_OPTIONS - 1;
			
		}
		if(player.buttons["ArrowDown"] == true || player.buttons["s"] == true){
			menuOption++;
			if(menuOption >= MAX_OPTIONS)
				menuOption = 0;
		}
		if(player.buttons["Enter"] == true){
			if(menuOption == 0){
				gameState = 1;
				gameStart = Date.now();
				scoreStartTime = gameStart;
				savedScore = 0;
				Players[0].x = width/2;
				Players[0].y = height/1.5;
			}
			if(menuOption == 1){
				var newDifficulty = prompt("Enter starting difficulty", "" + baseDifficulty);
				if(parseInt(newDifficulty) != NaN)
					baseDifficulty = parseInt(newDifficulty);
				
				Players[0].buttons["Enter"] = false;
			}
		}
	}
}

window.addEventListener("keydown", function(event){
    if(event.defaultPrevented || Players[0] == undefined)
        return;

    Players[0].buttons[event.key] = true;
	menuInput(Players[0]);
	
	if(gameState == 1 && event.key == "Control"){
		Players[0].state ^= 1;
	}
	
	if(gameState == 1 && event.key == "Escape"){
		window.savedScore = window.score;
		gameState = 2;
	}
	else if(gameState == 2 && event.key == "Escape"){
		scoreStartTime = Date.now();
		gameState = 1;
	}
	else if(gameState == 3){
		gameState = 0;
	}
	
	
    event.preventDefault();

}, true);

window.addEventListener("keyup", function(event){
    if(event.defaultPrevented || Players[0] == undefined)
        return;

    Players[0].buttons[event.key] = false;
	if(event.key != event.key.toLowerCase())
		Players[0].buttons[event.key.toLowerCase()] = false;
	
	menuInput(Players[0]);
    event.preventDefault();
}, true);



let Player = function(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = 2;
    this.canJump = true;
    this.velocityY = 0;
    this.gravity = 0.5;
    this.buttons = {};
	this.state = 0;
};

Player.prototype.monitorInput = function(){
	if(this.buttons["Shift"])
		this.speed = 3;
	else
		this.speed = 2;
	
    if(this.buttons["ArrowUp"] == true || this.buttons["w"] == true || this.buttons["W"] == true)
        this.y -= this.speed;
    if(this.buttons["ArrowDown"] == true || this.buttons["s"] == true || this.buttons["S"] == true)
        this.y += this.speed;
    if(this.buttons["ArrowLeft"] == true || this.buttons["a"] == true || this.buttons["A"] == true)
        this.x -= this.speed;
    if(this.buttons["ArrowRight"] == true || this.buttons["d"] == true || this.buttons["D"] == true)
        this.x += this.speed;
    if(this.buttons[" "] == true && this.canJump == true){
        this.velocityY = -7.5;
        this.canJump = false;
    }
}

Player.prototype.isKeyDown = function(key){
    if(this.buttons[key] == undefined)
        return false;
    else
        return this.buttons[key];
}

Player.prototype.applyGravity = function(floor){

    this.y += this.velocityY;
    this.velocityY += this.gravity;
    this.y  = constrain(this.y, 0, height-floor - this.h);
    if(this.y == (height-floor-this.h))
        this.canJump = true;

}
