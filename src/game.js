
// simple variables, health, current level etc
export let currentLevel = 1
let lives = 4
let maxLevels = 3

// list of variables
let frameTimes = []
export let gameIsPaused = true
let timeElapsed = 0 // timer
let startTime // game started at...
let fallsoundOnce = false
let gameRunning = false

// importing 
import { mainMenu, playGround, backToMenu, healthBar, Character } from "./main.js"
let MuteButton = document.getElementById("toggleMute")
let PauseButton = document.getElementById("togglePause")
//imports
import { fallAnimation, charJump, moveLeft, moveRight, checkCollision, stopAnimationRight, stopAnimationLeft } from "./physics.js"
import * as physics from "./physics.js"
import { PlayMusic, playSoundOnce } from "./sound.js"
import { level1_map, level2_map, level3_map } from "../level/levels.js"
import { drawTiles, deleteTiles, createEnemies } from "../level/tileMap.js"
import { frameRate, getFpsDelay, timer } from "./overlayItems.js"
export let lastLeftMove = false


let winamp = new PlayMusic() // music player, with pause/stop/resume features

function resetCharacter(xPos = "left", yPos ="bottom", xPosValue = 40, yPosValue = 40) {
    Character.style[xPos] = xPosValue + "px"
    Character.style[yPos] = yPosValue + "px"
}


export function StartGame() {
    playground.classList.remove(`menu`)
    playground.classList.add(`level_${currentLevel}`)
    playground.style.backgroundImage = `url(level/sprites/level${currentLevel}/background.png)`

    mainMenu.setAttribute("hidden", "")
    playGround.removeAttribute("hidden")
    PauseButton.removeAttribute("hidden")
    backToMenu.removeAttribute("hidden")

    console.log("Game started!")
    healthBar.src = "images/hud/lives_4.png"
    resetCharacter()
    drawTiles(eval(`level${currentLevel}_map`)) // setting up current level
    createEnemies(currentLevel) // creating current enemies for currentlevel

    playground.classList.add("level_1") // type of theme song 
    playground.classList.remove("menu") // remove the previous class
    gameIsPaused = false
    gameRunning = true; // sets the game status to "is running"
    startTime = Date.now() // timer startpoint

    main() // animation frame loop
}

let animationFrameId = null

export function ExitGame() {
    playground.classList.remove(`level_${currentLevel}`)
    currentLevel = 1
    lives = 0
    playground.classList.add(`menu`)
    deleteTiles()
    playGround.setAttribute("hidden", "")
    mainMenu.removeAttribute("hidden")
    PauseButton.setAttribute("hidden", "")
    backToMenu.setAttribute("hidden", "")

    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
}


//Main function, refreshes the playground every frame
function main() {
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)

    frameRate(frameTimes) // handles Framerate
    timer(startTime, timeElapsed) // handles Timer

    let currentLeft = parseInt(Character.style.left, 10) || 40;
    let currentBottom = parseInt(Character.style.bottom, 10) || 40;
    let newX = currentLeft;
    let newY = currentBottom - 10;

    if (!checkCollision(newX, newY, "down") && !physics.isJumping && !checkCollision(newX + Character.offsetWidth - 5, newY, 'down')) {
        fallAnimation()
        Character.style.backgroundImage ="url(/images/characters/main/leprechaun.gif)"
    }
    playGround.appendChild(Character)

    // limiting to 60 fps, to prove rich people that money doesnt buy happiness
    let delay = getFpsDelay()
    setTimeout(() => {
        animationFrameId = requestAnimationFrame(main)
    }, delay)
}

// eventlisteners for movement
document.addEventListener("keydown", (event) => {

    let bodyPos = playGround.getBoundingClientRect()
    let currentPos = Character.getBoundingClientRect()
    let jumpHeight = parseInt(Character.style.bottom) || 40;
    let currentLeft = parseInt(Character.style.left) || 40;
    if ((event.code === 'ArrowRight' || event.code === 'KeyD') && currentPos.x <= playGround.offsetWidth + bodyPos.x - 30) {
        lastLeftMove = false
        moveRight()
        Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_RIGHT.gif)"
    }
    if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && currentPos.x - 10 >= bodyPos.x) {
        lastLeftMove = true
        moveLeft()
        Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_LEFT.gif)"
    }
    if ((event.code === 'Space' || event.code === "ArrowUp")
        && (checkCollision(currentLeft, jumpHeight - 10, 'down') || checkCollision(currentLeft + Character.offsetWidth, jumpHeight - 10, 'down'))
    ) {

        charJump(jumpHeight + Character.offsetHeight * 2.5)
        Character.style.backgroundImage = "url(/images/characters/main/leprechaun_jumping.png)"
    }

    if (physics.isMovingLeft && physics.isMovingRight) Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"

})

document.addEventListener("keyup", (event) => {
    if (event.code === 'ArrowRight' || event.code === 'KeyD') stopAnimationRight()
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') stopAnimationLeft();
    //if (event.code === 'Space' || event.code === 'ArrowUp') physics.isJumping = false;
});




// handling the themesong between multiple levels
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            if (playground.classList.contains("menu")) {
                if (!MuteButton.src.includes("off")) winamp.setAudio("menu.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("level_1")) {
                if (!MuteButton.src.includes("off")) winamp.setAudio("level1.ogg")
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

// game events

export function levelUp() {
    console.log("level up! yay!")
    playSoundOnce("fall.ogg")

    currentLevel += 1

    //changelevel!
    deleteTiles()
    resetCharacter()
    if (currentLevel <= maxLevels) {
        drawTiles(eval(`level${currentLevel}_map`))
        playground.classList.remove(`level_${currentLevel - 1}`)
        playground.classList.add(`level_${currentLevel}`)
        playground.style.backgroundImage = `url(level/sprites/level${currentLevel}/background.png)`
    }
    else {
        console.log("HEY! YOU JUST COMPLETED THE GAME!")
        currentLevel = 1
        lives = 4
        playground.classList.remove(`level_${maxLevels}`)
        playground.classList.add(`level_${currentLevel}`)
        playground.style.backgroundImage = `url(level/sprites/level${currentLevel}/background.png)`
        drawTiles(eval(`level${currentLevel}_map`)) // setting up current level
    }
}
export function loseLife() {
    console.log("OUCH!")
    playSoundOnce("jump.ogg")

    resetCharacter()
    lives -= 1
    if (lives < 0) {
        console.log("HEY! YOU JUST COMPLETELY BLEW THE GAME, LEARN TO PLAY!")
        deleteTiles()
        playground.classList.remove(`level_${currentLevel}`)
        currentLevel = 1
        playground.classList.add(`level_${currentLevel}`)
        lives = 4
        playground.style.backgroundImage = `url(level/sprites/level${currentLevel}/background.png)`
        Character.style.left = 40
        Character.style.bottom = 40
        healthBar.src = `images/hud/lives_4.png`
        drawTiles(eval(`level${currentLevel}_map`)) // setting up current level
    }
    else healthBar.src = `images/hud/lives_${lives}.png`

}

// eventlisteners for pause & music on/off toggle'
MuteButton.addEventListener("click", (e) => {
    if (MuteButton.src.includes("off")) {
        winamp.resume()
        MuteButton.src = "/images/hud/music_on.png"
        localStorage.setItem("muteButtonSrc", "/images/hud/music_on.png")
    } else {
        winamp.pause()
        MuteButton.src = "/images/hud/music_off.png"
        localStorage.setItem("muteButtonSrc", "/images/hud/music_off.png")
    }
})
PauseButton.addEventListener("click", (e) => {
    if (gameIsPaused) gameIsPaused = unPause()
    else gameIsPaused = pause()

    return gameIsPaused
})


// basics
let songPrePause = ""
function pause() {
    songPrePause = playground.classList.value

    playground.classList.remove("level_1")
    playground.classList.remove("level_2")
    playground.classList.remove("level_3")

    playground.classList.add("paused")

    //...pause stuff
    PauseButton.src = "/images/hud/unpause.png"
    return true
}

function unPause() {
    playground.classList.remove("paused")
    playground.classList.add(songPrePause)

    ///...pause stuff but in reverse
    PauseButton.src = "/images/hud/pause.png"
    return false
}