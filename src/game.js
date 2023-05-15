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
function pause() {
    //...pause stuff
    gameIsPaused = true
    PauseButton.src = "/images/unpause.png"
}

function unPause() {
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
    body.appendChild(theGame)
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
        let jumpHeight = parseInt(Character.style.bottom, 10)
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
        const currentLeft = parseInt(thePlayer.style.left, 10) || 0;
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
    playSoundOnce("jump.ogg", 0.1)

    isJumping = true
    let currentJumpHeight = startY

    function jumpAnimation() {
        let thePlayerXpos = parseInt(thePlayer.style.left)
        let thePlayerHeight = parseInt(thePlayer.style.bottom)
        if (floorArr.includes(String(thePlayerHeight + 80) + "H")) {

            let num = floorArr.indexOf(String(thePlayerHeight + 80) + "H")
            let floorMin = floorArr[num - 2] - 30
            let floorMax = floorArr[num - 1] - 20

            if (thePlayerXpos >= floorMin && thePlayerXpos <= floorMax //&&
                //             (thePlayerXcoord )
            ) {
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
    let characterX = parseInt(Character.style.left, 10) + 25
    let characterY = parseInt(Character.style.bottom, 10);

    if (isCollided || characterY <= 20
        || (floorArr.includes(String(characterY) + "H"))) {
        let floorMin, floorMax;
        let num = floorArr.indexOf(String(characterY) + "H")

        if (num === -1) {
            floorMin = 9999
            floorMax = 0
        } else {
            floorMin = floorArr[num - 2]
            floorMax = floorArr[num - 1]
        }

        if (isCollided || characterY <= 20 || (characterX >= floorMin && characterX <= floorMax)) {
            fallsoundOnce = true
            isCollided = true


            if (!isMovingLeft && !isMovingRight) {
                Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"
            } else if (isMovingLeft && !isMovingRight) {
                Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_LEFT.gif)"
            } else if (!isMovingLeft && isMovingRight) {
                Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_RIGHT.gif)"
            }

            return
        }
    }
    characterY -= 10;
    thePlayer.style.bottom = characterY + 'px';
    if (fallsoundOnce) { playSoundOnce("fall.ogg", 0.5), fallsoundOnce = false }
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

    let allFloors = Floors.getElementsByTagName('div');
    for (var i = 1; i < allFloors.length; i++) {
        let floorMin = (parseInt(allFloors[i].style.left, 10));
        let floorMax = parseInt(allFloors[i].style.left, 10) + allFloors[i].offsetWidth + 20;
        let floorHeight = parseInt(allFloors[i].style.bottom, 10) + allFloors[i].offsetHeight + "H";
        floorArr.push(floorMin, floorMax, floorHeight);
    }

    main() // starting the animation process
}


// handling the themesong between multiple levels
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            if (playground.classList.contains("menu")) {
                if (!MuteButton.src.includes("off"))  winamp.setAudio("menu.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("level_1")) {
                if (!MuteButton.src.includes("off")) winamp.setAudio("level3.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("level_2")) {
                if (!MuteButton.src.includes("off")) winamp.setAudio("level2.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("level_3")) {
                if (!MuteButton.src.includes("off")) winamp.setAudio("level3.ogg")
                else winamp.pause()
            }
        }
    })
})


observer.observe(playground, { attributes: true }) // observing the current status of playground