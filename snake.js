window.onload = function (){

    const board = document.getElementById("board");
    const context = board.getContext("2d");

    const width=board.width;
    const height=board.height;

    const resetBtn = document.getElementById("reset");

    const boardBg = "rgba(0, 0, 0, 0.5)";
    const pythonColor = "lime";
    const pythonBorder = "black";
    const appleColor= "red";
    const gappleColor = "yellow";
    const pappleColor = "#ff00f2";
    const portalColor = "#12FFF7";

    const unitSize = 20;
    let running = false;
    let xVelocity = 0;
    let yVelocity = 0;
    let appleX,gappleX,pappleX;
    let appleY,gappleY,pappleY;

    let score = 0;
    let highScore = 0;
    let scores = [];

    let portal1X,portal2X,portal3X,portal4X;
    let portal1Y,portal2Y,portal3Y,portal4Y;

    let speed = 123, speedMode = false;
    let mode = 2;

    let python =[
        {x:unitSize*8   ,y:unitSize*25},
        {x:unitSize*8   ,y:unitSize*25},
    ];


    window.addEventListener("keyup",changeDirection);
    resetBtn.addEventListener("click",resetGame);
    window.addEventListener("keyup",resetGame);

    gameStart();
    document.getElementById("slow").addEventListener("click",slow);
    function slow(){    speed = 130; speedMode = true;   }
    document.getElementById("normal").addEventListener("click",normal);
    function normal(){  speed = 90;  speedMode = true;   }
    document.getElementById("fast").addEventListener("click",fast);
    function fast(){    speed = 35;  speedMode = true;  }

    document.getElementById("classic").addEventListener("click",classic);
    function classic(){ mode = 1 }
    document.getElementById("infinity").addEventListener("click",infinity);
    function infinity(){ mode = 2 }
    document.getElementById("portal").addEventListener("click",teleport);
    function teleport(){ mode = 3 }

    let speedToggle = 1;
    document.getElementById("speed-toggle").addEventListener("click",popUpSpeed);
    function popUpSpeed(){
        speedToggle += 1;
        let speedMenu = document.querySelector(".gameSpeed");
        if (speedToggle % 2 !== 0){
            speedMenu.style.visibility = "hidden";
        }
        if(speedToggle % 2 === 0){
            speedMenu.style.visibility = "visible";
        }
    }
    let modeToggle = 1;
    document.getElementById("mode-toggle").addEventListener("click",popUpMode);
    function popUpMode(){
        modeToggle += 1;
        let modeMenu = document.querySelector(".modes");
        if (modeToggle % 2 !== 0){
            modeMenu.style.visibility = "hidden";
        }
        if(modeToggle % 2 === 0){
            modeMenu.style.visibility = "visible";
        }
    }

    function gameStart(){
        running = true;

        if(mode === 3){createPortal();}
        setTimeout(locateApple,500);
        drawApple();
        setTimeout(locateGapple,3000);
        drawGapple();
        frame();

    }


    function drawScore(){
        context.font = "16.5px Orbitron-M";
        context.fillStyle = "rgba(255, 255, 255)";
        context.fillText("Score:  ", unitSize,30 );
        context.fillStyle = "lime";
        context.fillText("  " + score, unitSize*4,30 );
        if(!speedMode){
            if(score > 10){speed=110}
            if(score > 20){speed=100}
            if(score > 30){speed=90}
            if(score > 50){speed=80}
            if(score > 65){speed=75}
            if(score > 80){speed=55}
            if(score > 100){speed=44}
            if(score > 120){speed=40}
            if(score > 150){speed=35}
        }
        console.log(speed);
    }

    function frame(){
        if(running){
            setTimeout(()=>{
                clearBoard();
                if(mode === 3){createPortal()}
                drawScore();
                drawApple();
                drawGapple();
                drawPapple();
                movePython();
                drawPython();
               checkGameOver();
                frame();

            },speed);
        }
        else {gameOver()}
    }

    function clearBoard(){
        context.fillStyle = boardBg;
        context.fillRect(0,0,width,height);

        if(mode === 1){
            context.strokeStyle = "white";
            context.strokeRect(0,0,width,height);
            context.strokeRect(1,1,width-2,height-2);
        }
        if(mode === 2){
            context.strokeStyle = "cyan";
            context.strokeRect(0,0,width,height);
            context.strokeRect(1,1,width-2,height-2);
            context.strokeRect(2,2,width-4,height-4);
        }
        if(mode === 3){
            context.strokeStyle = "rgba(200,0,255,0.6)";
            context.strokeRect(0,0,width,height);
            context.strokeRect(1,1,width-2,height-2);
        }
    }


    function randomLocation(num){
        return Math.round((Math.random() * (num) / unitSize)) * unitSize;
    }
    function locateApple(){
        if(appleX === gappleX && appleY === gappleY
            || appleX === gappleX+unitSize && appleY === gappleY
            || appleX === gappleX && appleY === gappleY+unitSize
            || appleX === gappleX+unitSize && appleY === gappleY+unitSize)
        {
            appleX = randomLocation(width-unitSize);
            appleY = randomLocation(height-unitSize);
        }else{
            appleX = randomLocation(width-unitSize);
            appleY = randomLocation(height-unitSize);
        }
    }
    function locateGapple(){
            gappleX = randomLocation(width-unitSize*2);
            gappleY = randomLocation(height-unitSize*2);
    }
    function locatePapple(){
        if (pappleX === appleX && pappleY === appleY || pappleX === gappleX && pappleX === pappleY) {
            pappleX = randomLocation(width - unitSize);
            pappleY = randomLocation(height - unitSize);
        }else{
            pappleX = randomLocation(width - unitSize);
            pappleY = randomLocation(height - unitSize);
        }
    }
    function drawApple(){
        context.fillStyle = appleColor;
        context.fillRect(appleX+2.5,appleY+2.5,unitSize-5,unitSize-5);
    }
    function drawGapple(){
        context.fillStyle = gappleColor;
        context.fillRect(gappleX+4,gappleY+4,unitSize*2-8,unitSize*2-8 );
        context.strokeStyle = "black";
        context.strokeRect(gappleX+4,gappleY+4,unitSize*2-8,unitSize*2-8)
        context.strokeRect(gappleX+5,gappleY+5,unitSize*2-10,unitSize*2-10)
    }
    function drawPapple(){
        context.fillStyle = pappleColor;
        context.fillRect(pappleX,pappleY,unitSize,unitSize);
        context.strokeStyle = "black";
        context.strokeRect(pappleX+1,gappleY+1,unitSize*2-2,unitSize*2-2)
    }

    function hideGapple(){
        let tempX = gappleX;
        let tempY = gappleY;
        context.clearRect(gappleX,gappleY,unitSize,unitSize);
        gappleX = gappleY = -100;
        context.fillStyle = "black";
        context.fillRect(tempX,tempY,unitSize*2,unitSize*2);
    }
    function hidePapple(){
        let tempX = pappleX;
        let tempY = pappleY;
        context.clearRect(pappleX,pappleY,unitSize,unitSize);
        pappleX = pappleY = -50;
        context.fillStyle = "black";
        context.fillRect(tempX,tempY,unitSize,unitSize);

    }

    //!! Important
    function movePython(){
        //moving the head
        const head = {x:python[0].x + xVelocity,
                      y:python[0].y + yVelocity};

            python.unshift(head);
        //eat apple

        if(python[0].x === appleX && python[0].y === appleY){
            if(score % 5 === 0){
                setTimeout(locateGapple,2000);
                setInterval(()=> {
                        context.fillStyle = "black";
                        context.fillRect(gappleX,gappleY,unitSize*2,unitSize*2)}
                    ,600);
                setTimeout(hideGapple,10000);
            }
            if(score % 20 === 0){
                setTimeout(locatePapple,3000);
                setInterval(()=> {
                        context.fillStyle = "black";
                        context.fillRect(pappleX,pappleY,unitSize,unitSize)}
                    ,750);
                setTimeout(hidePapple,8000);
            }
        }

        if(python[0].x === appleX && python[0].y === appleY){
            score+= 1;
            locateApple();

        }else if(python[0].x === gappleX && python[0].y === gappleY
                || python[0].x === gappleX+unitSize && python[0].y === gappleY
                || python[0].x === gappleX && python[0].y === gappleY+unitSize
                || python[0].x === gappleX+unitSize && python[0].y === gappleY+unitSize){
            score+= 3;
            hideGapple();

        }else if(python[0].x === pappleX && python[0].y === pappleY){
            score+=6;
            hidePapple();
        } else {
            python.pop();
        }

    }

    function drawPython(){
        context.fillStyle= pythonColor;
        context.strokeStyle = pythonBorder;
        python.forEach(part => {
            context.fillRect(part.x+2,part.y+2,unitSize-4,unitSize-4);

        })
        context.fillStyle = "black";
        context.fillRect(python[0].x+5,python[0].y+5,10,10)

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

    //Portal
    // let portal1 = [];
    // for(let i = 0; i < 10; i++){
    //     portal1.push({x:portal1X+(unitSize*i),y:-20});
    // }
    // let portal2 = [];
    // for(let i =0; i < 10; i++){
    //     portal2.push({x:portal2X+(unitSize*i),y:height});
    // }
    function createPortal(){
        let portalW=10;
        let portalH=8;
        context.fillStyle = portalColor;
        context.fillRect(portal1X,portal1Y,unitSize*portalW,unitSize)
        portal1X = unitSize*15;
        portal1Y = -16;

        context.fillRect(portal2X,portal2Y,unitSize*portalW,unitSize)
        portal2X = unitSize*15;
        portal2Y = height-4;

        context.fillRect(portal3X,portal3Y,unitSize,unitSize*portalH)
        portal3X = -16;
        portal3Y = unitSize*11;

        context.fillRect(portal4X,portal4Y,unitSize,unitSize*portalH)
        portal4X = width-4;
        portal4Y = unitSize*11;
    }
    //Portal 1 --> Portal 2 ; Portal 3 --> Portal 4.

    function checkGameOver(){
        if(mode === 1) {
            switch (running) {
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
        }else if (mode === 2){
            switch (running) {
                case (python[0].x < 0):
                    python[0].x = width;
                    break;
                case (python[0].x >= width):
                    python[0].x = 0;
                    break;
                case (python[0].y < 0):
                    python[0].y = height;
                    break;
                case (python[0].y >= height):
                    python[0].y = 0;
                    break;
            }
        }else if (mode ===3) {
            // Go through the portal
            switch (running) {
                case (python[0].y < 0):
                    if (python[0].x === 300 || python[0].x === 320 || python[0].x === 340 || python[0].x === 360  || python[0].x === 380 ||
                        python[0].x === 400 || python[0].x === 420 || python[0].x === 440 || python[0].x === 460 || python[0].x === 480)
                    {
                        python[0].y = height;
                    } else {
                        running = false;
                    }
                    break;

                case (python[0].y > height - 20):
                    if (python[0].x === 300 || python[0].x === 320 || python[0].x === 340 || python[0].x === 360  || python[0].x === 380 ||
                        python[0].x === 400 || python[0].x === 420 || python[0].x === 440 || python[0].x === 460 || python[0].x === 480)
                    {
                        python[0].y = 0;
                    }else {
                        running = false;
                    }
                    break;

                case (python[0].x < 0):
                    if (python[0].y === 220 || python[0].y === 240 || python[0].y === 260 || python[0].y === 280 ||
                        python[0].y === 300 || python[0].y === 320 || python[0].y === 340 || python[0].y === 360)
                    {
                        python[0].x = width;
                    } else {
                        running = false;
                    }
                    break;

                case (python[0].x > width - 20):
                    if (python[0].y === 220 || python[0].y === 240 || python[0].y === 260 || python[0].y === 280 ||
                        python[0].y === 300 || python[0].y === 320 || python[0].y === 340 || python[0].y === 360)
                    {
                        python[0].x = 0;
                    } else {
                        running = false;
                    }
                    break;
            }
        }

        if(python.length > 1) {
            for (let i = 2; i < python.length; i++) {
                if (python[i].x === python[0].x && python[i].y === python[0].y) {
                    running = false;
                }
            }
        }
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
                ranks[i].innerText = " " + scores[i];
            }
        }
    }

    function resetGame(){
        if(!running){
            speed = 123;
            score = 0;
            xVelocity = 0;
            yVelocity = 0;

            python =[
                {x:randomLocation(width-unitSize),y:randomLocation(height-unitSize)},
                {x:randomLocation(width-unitSize),y:randomLocation(height-unitSize)},
            ];

            gameStart()
            document.getElementById("instructor").style.visibility = "visible";
            document.getElementById("gameOver").style.visibility = "hidden";
        }
    }

}

