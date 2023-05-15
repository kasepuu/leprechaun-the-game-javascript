const playground = document.getElementById("playground") // The Playground
let isMovingLeft = false
let isMovingRight = false
let isJumping = false
let animationIdRight = null
let animationIdLeft = null
let gameRunning = false
let isCollided = false
let body = document.getElementById("playground")
let theGame = document.getElementById("theGame")
let Character = document.getElementById("thePlayer")
let Floors = document.getElementById("floors")
let MuteButton = document.getElementById("toggleMusic")
let PauseButton = document.getElementById("togglePause")

let floorArr = [];
import { level1 } from "./levels.js";
let frameTimes = []
var gameIsPaused = true
let timeElapsed = 0 // timer
let startTime // game started at...
let fallsoundOnce = false
import { PlayMusic, playSoundOnce } from "./sound.js"
let winamp = new PlayMusic()
let lives = 4

// basics
let prePause = ""
function pause() {
    prePause = playground.classList.value

    playground.classList.remove("level_1")
    playground.classList.remove("level_2")
    playground.classList.remove("level_3")

    playground.classList.add("paused")


    //...pause stuff
    gameIsPaused = true
    PauseButton.src = "/images/hud/unpause.png"
}

function unPause() {
    playground.classList.remove("paused")
    playground.classList.add(prePause)

    ///...pause stuff but in reverse
    gameIsPaused = false
    PauseButton.src = "/images/hud/pause.png"
}

export function stopGame() {
    winamp.pause()
    winamp.stop()
    playground.classList.remove("level_1")
    playground.classList.remove("level_2")
    playground.classList.remove("level_3")

    playground.classList.add("menu")
    playground.style.backgroundImage = `url("/images/levels/main_menu_gamename.png")`

    gameRunning = false;
}

export function resetGame() {
    winamp.stop()

    floorArr = []
    let thePlayer = document.getElementById("thePlayer")
    if (thePlayer) {
        thePlayer.removeAttribute("style")
    } else {
        console.log("The player does not exist!", thePlayer)
    }
    let floors = document.getElementById("floors")
    if (floors) {
        floors.hidden = "hidden"
        console.log("floors removed.")
    }
}

// eventlisteners for pause & music on/off toggle
document.getElementById("toggleMusic").addEventListener("click", (e) => {
    if (MuteButton.src.includes("off")) {
        winamp.resume()
        MuteButton.src = "/images/hud/music_on.png"
    } else {
        winamp.pause()
        MuteButton.src = "/images/hud/music_off.png"
    }
})
document.getElementById("togglePause").addEventListener("click", (e) => {

    if (gameIsPaused) unPause()
    else pause()

})

// this function handles the framerate, displaying it in game
function frameRate() {
    const now = performance.now() // current performance
    while (frameTimes.length > 0 && frameTimes[0] <= now - 1000) {
        frameTimes.shift()
    }
    frameTimes.push(now)
    let fps = frameTimes.length > 30 ? frameTimes.length.toString() : "Initializing..."
    document.getElementById("fps").innerHTML = "FPS: " + fps
}

// this function handles the timer, displaying it in game
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

//Main function, refreshes the playground every frame
function main() {
    if (!gameRunning) return

    frameRate() // handles Framerate
    timer() // handles Timer

    if (Character.getBoundingClientRect().y === 20) isCollided = true
    else isCollided = false

    if (!isCollided && !isJumping) fallAnimation()

    theGame.appendChild(Character)
    requestAnimationFrame(main)
}

// eventlisteners for movement
document.addEventListener("keydown", (event) => {
    let bodyPos = body.getBoundingClientRect()
    let currentPos = Character.getBoundingClientRect()

    if ((event.code === 'ArrowRight' || event.code === 'KeyD') && currentPos.x <= body.offsetWidth + bodyPos.x - 30) {
        moveRight()
        Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_RIGHT.gif)"
    }
    if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && currentPos.x - 10 >= bodyPos.x) {
        moveLeft()
        Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_LEFT.gif)"
    }
    if ((event.code === 'Space' || event.code === "ArrowUp") && isCollided) {
        let jumpHeight = parseInt(Character.style.bottom)
        charJump(jumpHeight)
        Character.style.backgroundImage = "url(/images/characters/main/leprechaun_jumping.png)"
    }

    if (isMovingLeft && isMovingRight) Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"

})

document.addEventListener("keyup", (event) => {
    if (event.code === 'ArrowRight' || event.code === 'KeyD') stopAnimationRight();
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') stopAnimationLeft();
});

// animation functions
function moveLeft() {
    if (isMovingLeft || animationIdLeft) return;
    isMovingLeft = true;

    function moveAnimationLeft() {
        const currentLeft = parseInt(thePlayer.style.left) || 0;

        let thePlayerHeight = parseInt(thePlayer.style.bottom)
        let walls = Floors.getElementsByTagName('div')

        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];
            const wallLeft = parseInt(wall.style.left);
            const wallBottom = parseInt(wall.style.bottom);

            if (currentLeft < wallLeft + walls[i].offsetWidth
                && currentLeft > wallLeft
                && thePlayerHeight < wallBottom + walls[i].offsetHeight
                && thePlayerHeight + 60 > wallBottom) {

                animationIdLeft = requestAnimationFrame(moveAnimationLeft)
                return
            }
        }

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

function stopAnimationLeft() {
    Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"

    isMovingLeft = false;
    cancelAnimationFrame(animationIdLeft);
    animationIdLeft = null;
}
function moveRight() {
    if (isMovingRight || animationIdRight) return;
    isMovingRight = true;

    function moveAnimation() {
        const currentLeft = parseInt(thePlayer.style.left) || 0;
        let thePlayerHeight = parseInt(thePlayer.style.bottom)
        let walls = Floors.getElementsByTagName('div')

        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];
            const wallLeft = parseInt(wall.style.left);
            const wallBottom = parseInt(wall.style.bottom);

            if (currentLeft + Character.offsetWidth < wallLeft + walls[i].offsetWidth
                && currentLeft + Character.offsetWidth > wallLeft
                && thePlayerHeight < wallBottom + walls[i].offsetHeight
                && thePlayerHeight + 60 > wallBottom) {

                animationIdRight = requestAnimationFrame(moveAnimation)
                return
            }
        }
        const newLeft = currentLeft + 7;
        thePlayer.style.left = newLeft + 'px';
        if (newLeft >= body.offsetWidth - 30) {
            stopAnimationRight();
        } else {
            animationIdRight = requestAnimationFrame(moveAnimation);
        }
    }

    animationIdRight = requestAnimationFrame(moveAnimation);
}

function stopAnimationRight() {
    Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"
    isMovingRight = false;
    cancelAnimationFrame(animationIdRight);
    animationIdRight = null;
}

// function for jumping
function charJump(startY) {
    if (isJumping) return
    playSoundOnce("jump.ogg", 0.03)

    isJumping = true
    let currentJumpHeight = startY;

    function jumpAnimation() {
        const currentLeft = parseInt(thePlayer.style.left) || 0;
        let thePlayerHeight = parseInt(thePlayer.style.bottom);
        let walls = Floors.getElementsByTagName('div')
    
        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];
            const wallLeft = parseInt(wall.style.left);
            const wallBottom = parseInt(wall.style.bottom);
            console.log(wallBottom, wallLeft, currentLeft, thePlayerHeight)
            if (currentLeft <= wallLeft + walls[i].offsetWidth - 10
                && currentLeft + Character.offsetWidth >= wallLeft + 10
                && thePlayerHeight + Character.offsetHeight === wallBottom) {

                isJumping = false
                return
            }
        }

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

// function for falling
function fallAnimation() {
    const currentLeft = parseInt(thePlayer.style.left) + 25 || 0;
    let thePlayerHeight = parseInt(thePlayer.style.bottom)
    let walls = Floors.getElementsByTagName('div')

    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        const wallLeft = parseInt(wall.style.left);
        const wallBottom = parseInt(wall.style.bottom);

        if (isCollided 
            || thePlayerHeight <= 20 
            || (currentLeft < wallLeft + walls[i].offsetWidth + Character.offsetWidth-10
            && currentLeft >= wallLeft
            && thePlayerHeight === wallBottom + walls[i].offsetHeight)) {
                
            isCollided = true

            if (!isMovingLeft && !isMovingRight) {
                Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"
            } else if (isMovingLeft && !isMovingRight) {
                Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_LEFT.gif)"
            } else if (!isMovingLeft && isMovingRight) {
                Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_RIGHT.gif)"
            }
            if (fallsoundOnce) { playSoundOnce("fall.ogg", 0.1), fallsoundOnce = false }
            return
        }
    }
    thePlayerHeight -= 10;
    thePlayer.style.bottom = thePlayerHeight + 'px';
    fallsoundOnce = true
}


// function that starts the game
export function startGame() {
    playground.classList.add("level_1") // type of theme song 
    playground.classList.remove("menu") // remove the previous class
    gameIsPaused = false
    gameRunning = true; // sets the game status to "is running"
    startTime = Date.now() // timer startpoint
    Character.style.bottom = 30 + 'px'

    level1() // executing level 1

    main() // starting the animation process
}


// handling the themesong between multiple levels
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            if (playground.classList.contains("menu")) {
                if (!MuteButton.src.includes("off")) winamp.setAudio("menu.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("level_1")) {
                if (!MuteButton.src.includes("off")) winamp.setAudio("level2.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("level_2")) {
                if (!MuteButton.src.includes("off")) winamp.setAudio("level2.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("level_3")) {
                if (!MuteButton.src.includes("off")) winamp.setAudio("level3.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("paused")) {
                if (!MuteButton.src.includes("off")) winamp.setAudio("paused.ogg")
                else winamp.pause()
            }
        }
    })
})


observer.observe(playground, { attributes: true }) // observing the current status of playground