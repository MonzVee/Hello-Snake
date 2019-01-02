var canvas;
var ctx;

var snake;
var snake_dir;
var snake_next_dir;
var snake_speed;

var food = {x: 0, y: 0};

var score;

var wall;

var screen_snake;
var screen_menu;
var screen_setting;
var screen_gameover;
var button_newgame_menu;
var button_newgame_gameover;
var button_setting_menu;
var button_setting_gameover;
var ele_score;
var speed_setting;
var wall_setting;
var timeOutObj;
var previousScore = 0;
var specialCounter = 0;

function activeDot(x, y) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x * 16, y * 16, 16, 16);
}

function activeDotSpecial(x,y){
    ctx.fillStyle = "#FF0000";
    ctx.moveTo(x * 16, y * 16);
    ctx.lineTo((x * 16)+16, (y * 16)+8);
    ctx.lineTo(x * 16, (y * 16)+16);
    ctx.fill();
}

function changeDir(key) {

    if (key == 38 && snake_dir != 2) {
        snake_next_dir = 0;
    } else {
        if (key == 39 && snake_dir != 3) {
            snake_next_dir = 1;
        } else {
            if (key == 40 && snake_dir != 0) {
                snake_next_dir = 2;
            } else {
                if (key == 37 && snake_dir != 1) {
                    snake_next_dir = 3;
                }
            }
        }
    }

}

function foodTimeOutValue() {
    return Math.floor(Math.random() * (10 - 4 + 1) + 4);
}

function foodTimeOut() {
    timeOutObj = setTimeout(function () {
        addFood();
        activeDot(food.x, food.y);
    }, foodTimeOutValue() * 1000);
}

function resetFoodTimeOut() {
    if (timeOutObj !== null) {
        clearTimeout(timeOutObj);
    }
}

function resetCanvas(){
    canvas.width = 800;
    canvas.height = 800;
}

function rebuildSnake(axis,value,positive,opposite,oppositeValue,adjust){
   for (var i = 0; i < snake.length; i++) {
       if(positive){
           snake[i][axis] = value + i;
       } else {
           snake[i][axis] = value - i;
       }
       if(adjust){
           snake[i][opposite] = oppositeValue;
       }
       
   }
}

function addFood() {
    specialCounter += 1;
    food.x = Math.floor(Math.random() * ((canvas.width / 16) - 1));
    food.y = Math.floor(Math.random() * ((canvas.height / 16) - 1));
    for (var i = 0; i < snake.length; i++) {
        if (checkBlock(food.x, food.y, snake[i].x, snake[i].y)) {
            addFood();
        }
    }
    resetFoodTimeOut();
    foodTimeOut();
    if(specialCounter === 9){
        specialCounter = 1;
    }
}
function checkBlock(x, y, _x, _y) {
    return (x == _x && y == _y) ? true : false;
}


function altScore(score_val) {
    ele_score.innerHTML = String(score_val);
}


function mainLoop() {

    var _x = snake[0].x;
    var _y = snake[0].y;
    snake_dir = snake_next_dir;

    // 0 - Up, 1 - Right, 2 - Down, 3 - Left
    switch (snake_dir) {
        case 0:
            _y--;
            break;
        case 1:
            _x++;
            break;
        case 2:
            _y++;
            break;
        case 3:
            _x--;
            break;
    }

    snake.pop();
    snake.unshift({x: _x, y: _y});
    if (snake[0].x < 0 || snake[0].x == Math.ceil(canvas.width / 16) || snake[0].y < 0 || snake[0].y == Math.ceil(canvas.height / 16)) {
        if (canvas.width < 300) {
            showScreen(3);
            return;
        } else {
            canvas.width = canvas.width - 113;
            canvas.height = canvas.height - 113;
            var yValue = Math.ceil(canvas.height / 16) > snake[0].y? snake[0].y:  Math.ceil(canvas.height / 16) -1;
            var xValue = Math.ceil(canvas.width / 16) > snake[0].x? snake[0].x:  Math.ceil(canvas.width / 16) -1;
            var adjust = (Math.ceil(canvas.height / 16) <= snake[0].y  && snake[0].y=== snake[1].y)|| (Math.ceil(canvas.width / 16) <= snake[0].x && snake[0].x=== snake[1].x);
            // 0 - Up, 1 - Right, 2 - Down, 3 - Left
            switch (snake_next_dir){
                case 3:
                    snake_next_dir = 1;
                    rebuildSnake("x",1,false,"y",yValue,adjust);
                    break;
                case 2:
                    snake_next_dir = 0;  
                    rebuildSnake("y",Math.floor(canvas.height/16) + 1, true,"x",xValue,adjust);
                    break;
                case 1:
                    snake_next_dir = 3;  
                    rebuildSnake("x",Math.floor(canvas.width/16) + 1, true,"y",yValue,adjust);
                    break;  
                case 0:
                    snake_next_dir = 2;  
                    rebuildSnake("y",1,false,"x",xValue,adjust);
                    break;
            }
            addFood();
            //return;
        }
        //return;
    }

    for (var i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            showScreen(3);
            return;
        }
    }

    if (checkBlock(snake[0].x, snake[0].y, food.x, food.y)) {
        if(specialCounter === 3){
            snake[snake.length] = {x: snake[0].x, y: snake[0].y};
            snake[snake.length] = {x: snake[0].x, y: snake[0].y};
            score += 9;            
        } else {
            snake[snake.length] = {x: snake[0].x, y: snake[0].y};
            score += 1;            
        }

        altScore(score);
        addFood();
        activeDot(food.x, food.y);
    }

    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < snake.length; i++) {
        activeDot(snake[i].x, snake[i].y);
    }

    if(specialCounter === 3){
        activeDotSpecial(food.x, food.y);
    } else {
        activeDot(food.x, food.y);
    }
    

    setTimeout(mainLoop, snake_speed);
}

function newGame() {
    resetCanvas();
    showScreen(0);
    screen_snake.focus();
    snake = [];
    for (var i = 4; i >= 0; i--) {
        snake.push({x: i, y: 15});
    }
    snake_next_dir = 1;
    score = 0;
    altScore(score);
    addFood();
    canvas.onkeydown = function (evt) {
        evt = evt || window.event;
        changeDir(evt.keyCode);
    }
    mainLoop();
}

// Change the snake speed...
// 150 = slow
// 100 = normal
// 50 = fast
function setSnakeSpeed(speed_value) {
    snake_speed = speed_value;
}

function setWall(wall_value) {
    wall = wall_value;
    if (wall == 0) {
        screen_snake.style.borderColor = "#606060";
    }
    if (wall == 1) {
        screen_snake.style.borderColor = "#FFFFFF";
    }
}

// 0 for the game
// 1 for the main menu
// 2 for the settings screen
// 3 for the game over screen
var showScreen = function (screen_opt) {
    switch (screen_opt) {

        case 0:
            screen_snake.style.display = "block";
            screen_menu.style.display = "none";
            screen_gameover.style.display = "none";
            break;

        case 1:
            screen_snake.style.display = "none";
            screen_menu.style.display = "block";
            screen_gameover.style.display = "none";
            break;

        case 2:
            screen_snake.style.display = "none";
            screen_menu.style.display = "none";
            screen_gameover.style.display = "none";
            break;

        case 3:
            if(previousScore > 0 && score > previousScore){
                ele_score.setAttribute("style", "color: red;");
            }
            previousScore = score;
            screen_snake.style.display = "none";
            screen_menu.style.display = "none";
            screen_gameover.style.display = "block";
            break;
    }
}
window.onload = function () {

    canvas = document.getElementById("snake");
    ctx = canvas.getContext("2d");

    // Screens
    screen_snake = document.getElementById("snake");
    screen_menu = document.getElementById("menu");
    screen_gameover = document.getElementById("gameover");

    // Buttons
    button_newgame_menu = document.getElementById("newgame_menu");
    button_newgame_gameover = document.getElementById("newgame_gameover");

    // etc
    ele_score = document.getElementById("score_value");
    speed_setting = document.getElementsByName("speed");
    wall_setting = document.getElementsByName("wall");
    button_newgame_menu.onclick = function () {
        newGame();
    };
    button_newgame_gameover.onclick = function () {
        newGame();
    };

    setSnakeSpeed(100);
    setWall(1);

    showScreen("menu");


    document.onkeydown = function (evt) {
        if (screen_gameover.style.display == "block") {
            evt = evt || window.event;
            if (evt.keyCode == 32) {
                newGame();
            }
        }
    }
}