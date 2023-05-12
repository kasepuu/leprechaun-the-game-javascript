let isMovingLeft = false;
let isMovingRight = false;
let isJumping = false;
let animationId = null;
let animationIdLeft = null;
let gameRunning = false;
let body = document.getElementById("playground")
let theGame = document.getElementById("theGame")
let Character = document.getElementById("thePlayer")


//Refresh playground every frame
export const main = () => {
    if (!gameRunning) {
        return
    }
    theGame.appendChild(Character)
    body.appendChild(theGame)
    requestAnimationFrame(main)
}


document.addEventListener("keydown", (event) => {
    let bodyPos = body.getBoundingClientRect()
    let currentPos = Character.getBoundingClientRect()
    if ((event.code === 'ArrowRight' || event.code === 'KeyD') && currentPos.x <= body.offsetWidth + bodyPos.x - 30) {
        moveRight();
    }
    if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && currentPos.x - 10 >= bodyPos.x) {
        moveLeft();
    }
    if (event.code === 'Space' || event.code === "ArrowUp") charJump();
});

document.addEventListener("keyup", (event) => {
    if (event.code === 'ArrowRight' || event.code === 'KeyD') stopAnimation();
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') stopAnimationLeft();
});


function stopAnimationLeft() {
    isMovingLeft = false;
    cancelAnimationFrame(animationIdLeft);
    animationIdLeft = null;
}

function moveLeft() {
    if (isMovingLeft || animationIdLeft) return;

    function moveAnimationLeft() {
        const currentLeft = parseInt(thePlayer.style.left, 10) || body.getBoundingClientRect().x;
        const newLeft = currentLeft - 10;
        thePlayer.style.left = newLeft + 'px';
        if (newLeft < body.getBoundingClientRect().x + 10) {
            stopAnimationLeft();
        } else {
            animationIdLeft = requestAnimationFrame(moveAnimationLeft);
        }
    }
    animationIdLeft = requestAnimationFrame(moveAnimationLeft);
}
function stopAnimation() {
    isMovingRight = false;
    cancelAnimationFrame(animationId);
    animationId = null;
}
function moveRight() {
    if (isMovingRight || animationId) return;

    isMovingRight = true;

    function moveAnimation() {
        const currentLeft = parseInt(thePlayer.style.left, 10) || body.getBoundingClientRect().x;
        const newLeft = currentLeft + 10;
        thePlayer.style.left = newLeft + 'px';
        if (newLeft > body.getBoundingClientRect().x + body.offsetWidth - 30) {
            stopAnimation();
        } else {
            animationId = requestAnimationFrame(moveAnimation);
        }
    }

    animationId = requestAnimationFrame(moveAnimation);
}

function charJump() {
    if (isJumping) return;

    isJumping = true;
    let currentJumpHeight = 0;

    function jumpAnimation() {
        currentJumpHeight += 10;
        thePlayer.style.bottom = currentJumpHeight + 'px';

        if (currentJumpHeight >= 100) {
            fallAnimation();
        } else {
            requestAnimationFrame(jumpAnimation);
        }
    }

    function fallAnimation() {
        currentJumpHeight -= 10;
        thePlayer.style.bottom = currentJumpHeight + 'px';

        if (currentJumpHeight <= 0) {
            isJumping = false;
        } else {
            requestAnimationFrame(fallAnimation);
        }
    }
    requestAnimationFrame(jumpAnimation);
}


export function stopGame() {
    gameRunning = false;
}
export function startGame() {
    gameRunning = true;
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
}