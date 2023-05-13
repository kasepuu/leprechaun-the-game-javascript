let isMovingLeft = false;
let isMovingRight = false;
let isJumping = false;
let animationId = null;
let animationIdLeft = null;
let gameRunning = false;
let isCollided = false
let body = document.getElementById("playground")
let theGame = document.getElementById("theGame")
let Character = document.getElementById("thePlayer")
let Floors = document.getElementById("floors")
import { level1 } from "./levels.js";
let frameTimes = []
var gameIsPaused = false
let timeElapsed = 0 // timer
let startTime = 0 // game started at...
// this function handles the framerate, displaying it in the game
function frameRate() {
    const now = performance.now() // current performance
    while (frameTimes.length > 0 && frameTimes[0] <= now - 1000) {
        frameTimes.shift()
    }
    frameTimes.push(now)
    let fps = frameTimes.length > 30 ? frameTimes.length.toString() : "Initializing..."
    document.getElementById("fps").innerHTML = "FPS: " + fps
}
// this function handles the timer
function timer() {
    if (!gameIsPaused) {
        timeElapsed += Date.now() - startTime
        startTime = Date.now()
        var minutes = Math.floor(timeElapsed / 60000);
        var seconds = ((timeElapsed % 60000) / 1000).toFixed(0);
        let timerHTML = (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds

        document.getElementById(("time")).innerHTML = timerHTML
    } else {
        startTime = Date.now()
    }
}

//Refresh playground every frame
function main() {
    if (!gameRunning) {
        return
    }

    frameRate() // get Framerate
    timer() // handle Timer

    let floor = document.getElementById("floor-1")
    let floorHeight = parseInt(floor.style.bottom, 10);

    if (Character.getBoundingClientRect().y === Floors.offsetHeight) isCollided = true
    else if (Character.getBoundingClientRect().y === (floorHeight + 20)) isCollided = true

    else isCollided = false
    if (!isCollided && !isJumping) fallAnimation()

    theGame.appendChild(Character)
    body.appendChild(theGame)
    requestAnimationFrame(main)
}


document.addEventListener("keydown", (event) => {
    let bodyPos = body.getBoundingClientRect()
    let currentPos = Character.getBoundingClientRect()
    if ((event.code === 'ArrowRight' || event.code === 'KeyD') && currentPos.x <= body.offsetWidth + bodyPos.x - 30) {
        moveRight();
        Character.style.backgroundImage = "url(/images/leprechaun_walking_RIGHT_gif.gif)"
    }
    if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && currentPos.x - 10 >= bodyPos.x) {
        moveLeft();
        Character.style.backgroundImage = "url(/images/leprechaun_walking_LEFT.png)"
    }
    if ((event.code === 'Space' || event.code === "ArrowUp") && isCollided) {
        let jumpHeight = parseInt(Character.style.bottom, 10)
        charJump(jumpHeight);
        Character.style.backgroundImage = "url(/images/leprechaun_jumping.png)"
    }

    if (isMovingLeft && isMovingRight) Character.style.backgroundImage = "url(/images/leprechaun.png)"

});

document.addEventListener("keyup", (event) => {
    if (event.code === 'ArrowRight' || event.code === 'KeyD') stopAnimationRight();
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') stopAnimationLeft();
});


function stopAnimationLeft() {
    Character.style.backgroundImage = "url(/images/leprechaun.png)"

    isMovingLeft = false;
    cancelAnimationFrame(animationIdLeft);
    animationIdLeft = null;

}
function stopAnimationRight() {
    Character.style.backgroundImage = "url(/images/leprechaun.png)"

    isMovingRight = false;
    cancelAnimationFrame(animationId);
    animationId = null;
}

function moveLeft() {
    if (isMovingLeft || animationIdLeft) return;
    isMovingLeft = true;

    function moveAnimationLeft() {
        const currentLeft = parseInt(thePlayer.style.left, 10) || 0;
        const newLeft = currentLeft - 7;
        thePlayer.style.left = newLeft + 'px';
        if (newLeft <= 0) {
            stopAnimationLeft();
        } else {
            animationIdLeft = requestAnimationFrame(moveAnimationLeft);
        }
    }
    animationIdLeft = requestAnimationFrame(moveAnimationLeft);
}



function moveRight() {
    if (isMovingRight || animationId) return;

    isMovingRight = true;

    function moveAnimation() {
        const currentLeft = parseInt(thePlayer.style.left, 10) || 0;
        const newLeft = currentLeft + 7;
        thePlayer.style.left = newLeft + 'px';
        if (newLeft >= body.offsetWidth - 30) {
            stopAnimationRight();
        } else {
            animationId = requestAnimationFrame(moveAnimation);
        }
    }

    animationId = requestAnimationFrame(moveAnimation);
}

function charJump(startY) {
    if (isJumping) return;

    isJumping = true;
    let currentJumpHeight = startY;
    
    function jumpAnimation() {
        currentJumpHeight += 10;
        thePlayer.style.bottom = currentJumpHeight + 'px';

        if (currentJumpHeight >= 120 + startY) {
            isJumping = false
        } else {
            requestAnimationFrame(jumpAnimation);
        }
    }

    requestAnimationFrame(jumpAnimation);
}


function fallAnimation() {
    let characterX = parseInt(Character.style.left, 10) + 25
    let characterY = parseInt(Character.style.bottom, 10);
    let floor = document.getElementById("floor-1")
    let floorMin = parseInt(floor.style.left, 10)
    let floorMax = floorMin + floor.offsetWidth + 20;
    let floorS = parseInt(Floors.style.bottom, 10)
    let floorHeight = parseInt(floor.style.bottom, 10);

    if (isCollided || characterY === floorS + Floors.offsetHeight || characterY <= 10
        || (characterY === (floorHeight + floor.offsetHeight) && (characterX >= floorMin && characterX <= floorMax))
    ) {
        isCollided = true
        if (!isMovingLeft && !isMovingRight) {
            Character.style.backgroundImage = "url(/images/leprechaun.png)"
        } else if (isMovingLeft && !isMovingRight) {
            Character.style.backgroundImage = "url(/images/leprechaun_walking_LEFT.png)"
        } else if (!isMovingLeft && isMovingRight) {
            Character.style.backgroundImage = "url(/images/leprechaun_walking_RIGHT_gif.gif)"
        }

        return
    }
    characterY -= 10;
    thePlayer.style.bottom = characterY + 'px';
}

export function stopGame() {
    gameRunning = false;
}
export function startGame() {
    gameRunning = true;
    Character.style.bottom = 30 + 'px';
    level1()
    main()
}

export function resetGame() {
    let thePlayer = document.getElementById("thePlayer")
    if (thePlayer) {
        thePlayer.removeAttribute("style")
        console.log(thePlayer)
    } else {
        console.log("The player does not exist!", thePlayer)
    }
    let floors = document.getElementById("floors")
    if (floors) {
        floors.hidden = "hidden"
        console.log("floors removed.")
    }
}