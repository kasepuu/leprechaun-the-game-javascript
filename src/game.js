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



//Refresh playground every frame
function main() {
    if (!gameRunning) {
        return
    }


    const now = performance.now() // current performance
    while (frameTimes.length > 0 && frameTimes[0] <= now - 1000) {
        frameTimes.shift();
    }
    frameTimes.push(now)
    document.getElementById("fps").innerHTML = "FPS: " + frameTimes.length.toString()


    if (Character.getBoundingClientRect().y === Floors.offsetHeight) isCollided = true
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
        charJump();
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

function charJump() {
    if (isJumping) return;

    isJumping = true;
    let currentJumpHeight = parseInt(thePlayer.style.bottom, 10);

    function jumpAnimation() {
        currentJumpHeight += 10;
        thePlayer.style.bottom = currentJumpHeight + 'px';

        if (currentJumpHeight >= 100) {
            isJumping = false
        } else {
            requestAnimationFrame(jumpAnimation);
        }
    }

    requestAnimationFrame(jumpAnimation);
}


function fallAnimation() {

    let currentHeight = parseInt(Character.style.bottom, 10);

    let floor = parseInt(Floors.style.bottom, 10)
    if (isCollided || currentHeight === floor + Floors.offsetHeight || currentHeight <= 10) {
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
    currentHeight -= 10;
    thePlayer.style.bottom = currentHeight + 'px';
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