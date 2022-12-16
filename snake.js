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
    const gappleColor = "yellow";
    const pappleColor = "#ff9500";
    const unitSize = 20;

    let running = false;
    let xVelocity = 0;
    let yVelocity = 0;
    let appleX,gappleX,pappleX;
    let appleY,gappleY,pappleY;

    let score = 0;
    let highScore = 0;
    let scores = [];

    let portal1X,portal2X;
    let portal1Y,portal2Y;
    // let portals = [];

    let gameSpeed = 111;

    let python =[
        {x:unitSize*2   ,y:unitSize*10},
    ];

    window.addEventListener("keyup",changeDirection);
    resetBtn.addEventListener("click",resetGame);
    window.addEventListener("keyup",resetGame);

    gameStart();
    document.getElementById("slow").addEventListener("click",slow);
    function slow(){    gameSpeed = 130;    }
    document.getElementById("normal").addEventListener("click",normal);
    function normal(){  gameSpeed = 90;     }
    document.getElementById("fast").addEventListener("click",fast);
    function fast(){    gameSpeed = 35;     }

    function gameStart(){
        running = true;

        createPortal();
        locateApple();
        drawApple();
        locateGapple();
        drawGapple();
        nextTick();

    }


    function drawScore(){
        context.font = "16.5px Orbitron-M";
        context.fillStyle = "rgba(255, 255, 255)";
        context.fillText("Score:  ", unitSize,30 );
        context.fillStyle = "lime";
        context.fillText("  " + score, unitSize*4,30 );
            if(score === 10 || score > 10){gameSpeed=100}
            if(score === 25 || score > 25){gameSpeed=90}
            if(score === 35 || score > 35){gameSpeed=80}
            if(score === 70 || score > 70){gameSpeed=70}
            if(score === 90 || score >90){gameSpeed=60}
            if(score === 105 || score > 105){gameSpeed=50}
            if(score === 120 || score > 120){gameSpeed=40}
            if(score === 135 || score > 135){gameSpeed=35}

        console.log(gameSpeed);
    }

    function nextTick(){
        if(running){
            setTimeout(()=>{
                clearBoard();
                createPortal();
                drawScore();
                drawApple();
                drawGapple();
                drawPapple();
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

    function locateApple(){
        function randomApple(num){
            return Math.round((Math.random() * (num) / unitSize)) * unitSize;
        }
        appleX = randomApple(width-unitSize);
        appleY = randomApple(height-unitSize);

    }
    function locateGapple(){
        function randomGapple(num){
            return Math.round((Math.random() * (num) / unitSize)) * unitSize;
        }
        gappleX = randomGapple(width-unitSize);
        gappleY = randomGapple(height-unitSize);
    }
    function locatePapple(){
        function randomPapple(num){
            return Math.round((Math.random() * (num) / unitSize)) * unitSize;
        }
        pappleX = randomPapple(width-unitSize);
        pappleY = randomPapple(height-unitSize);
    }
    function drawApple(){
        context.fillStyle = appleColor;
        context.fillRect(appleX,appleY,unitSize,unitSize);
    }
    function drawGapple(){
        context.fillStyle = gappleColor;
        context.fillRect(gappleX,gappleY,unitSize,unitSize);
    }
    function drawPapple(){
        context.fillStyle = pappleColor;
        context.fillRect(pappleX,pappleY,unitSize,unitSize);
    }

    function hideGapple(){
        let tempX = gappleX;
        let tempY = gappleY;
        context.clearRect(gappleX,gappleY,unitSize,unitSize);
        gappleX = gappleY = -100;
        context.fillStyle = "black";
        context.fillRect(tempX,tempY,unitSize,unitSize);
    }
    function hidePapple(){
        let tempX = pappleX;
        let tempY = pappleY;
        context.clearRect(pappleX,pappleY,unitSize,unitSize);
        pappleX = pappleY = -100;
        context.fillStyle = "black";
        context.fillRect(tempX,tempY,unitSize,unitSize);
    }

    //!! Important
    function movePython(){
        const head = {x:python[0].x + xVelocity,
                      y:python[0].y + yVelocity};

            python.unshift(head);
        //eat apple
        if(python[0].x === appleX && python[0].y === appleY){
            score+= 1;
            locateApple();
            if(score % 5 === 0){
                locateGapple();
                setInterval(()=> {
                    context.fillStyle = "black";
                    context.fillRect(gappleX,gappleY,unitSize,unitSize);}
                    ,700);
                setTimeout(hideGapple,7000);
            }
            if(score % 20 === 0){
                locatePapple();
            }
        }else if(python[0].x === gappleX && python[0].y === gappleY){
            score+= 2;
            hideGapple();
        }else if(python[0].x === pappleX && python[0].y === pappleY){
            score+=5;
            hidePapple();
        } else {
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
        portal1Y = height-2;

        context.fillRect(portal2X,portal2Y,unitSize*8,unitSize)
        portal2X = unitSize*16;
        portal2Y = -18;
    }
    function throughPortal() {

    }

    function gameOver(){
        document.getElementById("gameOver").style.visibility = "visible";
        document.getElementById("score").innerText = score;

        // if(score > highScore) {
        //     scores.unshift(score);
        //     highScore = scores[0];
        // }
        scores.push(score);
        //sorting scores
        let max = 0;
        for(let i=0 ; i<scores.length; i++){
            for (let j = i; j < scores.length ; j++) {
                if(scores[i] <= scores[j]){
                    max       = scores[j];
                    scores[j] = scores[i];
                    scores[i] = max;
                }
            }
        }
        highScore = scores[0];
        document.querySelector("#highScore").innerText = highScore;
        ranking();

    }
    function ranking(){
        const ranks = document.querySelectorAll(".topscores");

        //display rank
        if (scores.length){
            for (let i = 0; i<ranks.length; i++){
                ranks[i].innerText = scores[i];
            }
        }
    }


    function resetGame(){
        if(!running){
            gameSpeed = 110;
            score = 0;
            xVelocity = 0;
            yVelocity = 0;

            function randomNum(num){
                return Math.round((Math.random() * (num) / unitSize)) * unitSize;
            }

            python =[
                {x:randomNum(width-unitSize),y:randomNum(height-unitSize)},
            ];

            gameStart()
            document.getElementById("instructor").style.visibility = "visible";
            document.getElementById("gameOver").style.visibility = "hidden";
        }
    }


}

