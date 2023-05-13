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




//Refresh playground every frame
export const main = () => {
    if (!gameRunning) {
        return
    }

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
        Character.style.backgroundImage = "url(/images/leprechaun_walking_RIGHT.png)"
    }
    if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && currentPos.x - 10 >= bodyPos.x) {
        moveLeft();
        Character.style.backgroundImage = "url(/images/leprechaun_walking_LEFT.png)"
    }
    if ((event.code === 'Space' || event.code === "ArrowUp") && isCollided) charJump();
});

document.addEventListener("keyup", (event) => {
    if (event.code === 'ArrowRight' || event.code === 'KeyD') stopAnimation();
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') stopAnimationLeft();
});


function stopAnimationLeft() {
    Character.style.backgroundImage = "url(/images/leprechaun.png)"

    isMovingLeft = false;
    cancelAnimationFrame(animationIdLeft);
    animationIdLeft = null;

}

function moveLeft() {
    if (isMovingLeft || animationIdLeft) return;
    Character.style.backgroundImage = "url(/images/leprechaun_walking_LEFT.png)"

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


function stopAnimation() {
    Character.style.backgroundImage = "url(/images/leprechaun.png)"

    isMovingRight = false;
    cancelAnimationFrame(animationId);
    animationId = null;
}
function moveRight() {
    if (isMovingRight || animationId) return;
    Character.style.backgroundImage = "url(/images/leprechaun_walking_RIGHT.png)"

    isMovingRight = true;

    function moveAnimation() {
        const currentLeft = parseInt(thePlayer.style.left, 10) || 0;
        const newLeft = currentLeft + 7;
        thePlayer.style.left = newLeft + 'px';
        if (newLeft >= body.offsetWidth - 30) {
            stopAnimation();
        } else {
            animationId = requestAnimationFrame(moveAnimation);
        }
    }

    animationId = requestAnimationFrame(moveAnimation);
}

function charJump() {
    if (isJumping) return;
    Character.style.backgroundImage = "url(/images/leprechaun_jumping.png)"

    isJumping = true;
    let currentJumpHeight = 0;

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

    let currentHeight = parseInt(Character.style.bottom, 10) || 30;
    if (isCollided || currentHeight === Floors.offsetHeight) {
        isCollided = true
        Character.style.backgroundImage = "url(/images/leprechaun.png)"
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
        floors.remove()
        console.log("floors removed.")
    }
}