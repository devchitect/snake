window.onload = function (){

    const board = document.getElementById("board");
    const context = board.getContext("2d");

    const width=board.width;
    const height=board.height;

    const resetBtn = document.getElementById("reset");

    const boardBg = "black";
    const pythonColor = "lime";
    const pythonBorder = "black";
    const appleColor= "red";
    const unitSize = 20;

    let running = false;
    let xVelocity = 0;
    let yVelocity = 0;
    let appleX,gappleX;
    let appleY,gappleY;
    let score = 0;

    let portal1X,portal2X;
    let portal1Y,portal2Y;
    let portals = [];

    let gameSpeed = 85;

    let python =[
        {x:unitSize*2   ,y:unitSize*10},

    ];

    window.addEventListener("keyup",changeDirection);
    resetBtn.addEventListener("click",resetGame);

    gameStart();
    document.getElementById("easy").addEventListener("click",slow);
    function slow(){    gameSpeed = 105;    }
    document.getElementById("normal").addEventListener("click",normal);
    function normal(){  gameSpeed = 70;     }
    document.getElementById("hard").addEventListener("click",fast);
    function fast(){    gameSpeed = 35;     }

    function gameStart(){
        running = true;

        createPortal();
        createApple();
        drawApple();
        nextTick();

    }
    function drawScore(){
        context.font = "16.5px Verdana";
        context.fillStyle = "rgba(255, 255, 255)";
        context.fillText("Score: ", unitSize,30 );
        context.fillStyle = "lime";
        context.fillText(score, unitSize*4,30 );
            if(score === 15){gameSpeed=70}
            if(score === 25){gameSpeed=63}
            if(score === 35){gameSpeed=57}
            if(score === 70){gameSpeed=50}
            if(score === 90){gameSpeed=45}
            if(score === 120){gameSpeed=35}
            console.log(gameSpeed);
    }

    function nextTick(){
        if(running){
            setTimeout(()=>{
                clearBoard();
                createPortal();
                drawScore();
                drawApple();
                movePython();
                drawPython();
                checkGameOver();
                nextTick();
            },gameSpeed);
        }
        else {gameOver()}
    }

    function clearBoard(){
        context.fillStyle = boardBg;
        context.fillRect(0,0,width,height);
    }

    function createApple(){
        function randomApple(num){
            return Math.round((Math.random() * (num) / unitSize)) * unitSize;
        }
        appleX = randomApple(width-unitSize);
        appleY = randomApple(height-unitSize);
    }
    function drawApple(){
        context.fillStyle = appleColor;
        context.fillRect(appleX,appleY,unitSize,unitSize);
    }

    function movePython(){
        const head = {x:python[0].x + xVelocity,
                      y:python[0].y + yVelocity};
        python.unshift(head);
        //eat apple
        if(python[0].x === appleX && python[0].y === appleY){
            score+= 3;
            createApple();
        }else {
            python.pop();
        }
    }
    function drawPython(){
        context.fillStyle= pythonColor;
        context.strokeStyle = pythonBorder;
        python.forEach(part => {
            context.fillRect(part.x,part.y,unitSize,unitSize);
            context.strokeRect(part.x,part.y,unitSize,unitSize);
        })
    }
    function changeDirection(event){
        const keyPressed = event.keyCode;
        const left = 37;
        const up = 38;
        const right = 39;
        const down = 40;

        if(keyPressed === left || keyPressed === right || keyPressed === up || keyPressed === down){
            document.getElementById("instructor").style.visibility = "hidden";
        }

        const goUp = (yVelocity === -unitSize);
        const goDown = (yVelocity === unitSize);
        const goRight = (xVelocity === unitSize);
        const goLeft = (xVelocity === -unitSize);

        switch (true){
            case (keyPressed === left && !goRight):
                xVelocity = -unitSize;
                yVelocity = 0;
                break;
            case (keyPressed === right && !goLeft):
                xVelocity = unitSize;
                yVelocity = 0;
                break;
            case (keyPressed === up && !goDown):
                xVelocity = 0;
                yVelocity = -unitSize;
                break;
            case (keyPressed === down && !goUp):
                xVelocity = 0;
                yVelocity = unitSize;
                break;
        }
    }
    function checkGameOver(){
        switch (true){
            case (python[0].x < 0):
                running = false;
                break;
            case (python[0].x >= width):
                running = false;
                break;
            case (python[0].y < 0):
                running = false;
                break;
            case (python[0].y >= height):
                running = false;
                break;
        }

        for(let i = 1; i< python.length; i++ ){
            if (python[i].x === python[0].x && python[i].y === python[0].y ){
                running = false;
            }
        }

    }
    function createPortal(){
        context.fillStyle = "cyan";
        context.fillRect(portal1X,portal1Y,unitSize*8,unitSize)
        portal1X = unitSize*16;
        portal1Y = 598;

        context.fillRect(portal2X,portal2Y,unitSize*8,unitSize)
        portal2X = unitSize*16;
        portal2Y = -18;
    }
    function throughPortal() {

    }
    function gameOver(){
        document.getElementById("gameOver").style.visibility = "visible";
        document.getElementById("score").innerText = score;
    }
    function resetGame(){
        if(!running){
            score = 0;
            xVelocity = 0;
            yVelocity = 0;

            python =[
                {x:unitSize*2   ,y:unitSize*15},
                // {x:unitSize     ,y:unitSize*15},
            ];

            gameStart()
            document.getElementById("instructor").style.visibility = "visible";
            document.getElementById("gameOver").style.visibility = "hidden";
        }
    }


}

