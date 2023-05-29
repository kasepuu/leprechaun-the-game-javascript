
// simple variables, health, current level etc
export let currentLevel = 3
export let currentAmmo = 3 // current ammo count

let lives = 4
let maxLevels = 3
let hasWeapon = (currentLevel === maxLevels)

//let 
// list of variables
let frameTimes = []
export let gameIsPaused = true
let timeElapsed = 0 // timer
let startTime // game started at...
let gameRunning = false
// importing 
import { mainMenu, playGround, backToMenu, healthBar, Character } from "./main.js"
import { resetBossHealth } from "./physics.js"
//imports
import { fallAnimation, charJump, moveLeft, moveRight, checkCollision, stopAnimationRight, stopAnimationLeft, moveEnemy, characterMushroomCollision } from "./physics.js"
import * as physics from "./physics.js"
import { PlayMusic, playSoundOnce } from "./sound.js"
import { level1_map, level2_map, level3_map } from "../level/levels.js"
import { drawTiles, deleteTiles, createEnemies, deleteEnemies, fetchCheckpoints, deleteFlyingEnemies, currentElements, removeElements, getElements } from "../level/tileMap.js"
import { frameRate, timerCounter } from "./overlayItems.js"
export let lastLeftMove = false

// for pausemenu
export const pausedMenu = document.getElementById("paused-menu")
export const continueButton = document.getElementById("continueButton")
export const restartButtonP = document.getElementById("restartButtonPause")
export const restartButtonD = document.getElementById("restartButtonDeath")
export let levelCompletion = {
    level1: [],
    level2: [],
    level3: [],
}
let timer = document.getElementById("timer")
let score = document.getElementById("score")
const DeathScreen = document.getElementById("death-screen")
const MuteButton = document.getElementById("toggleMute")
const PauseButton = document.getElementById("togglePause")
let enemiesParent = document.getElementById("enemies")
let flyingEnemiesParent = document.getElementById("flyingEnemies")
let elements = document.getElementById('elements')
let mushRoom = elements.getElementsByTagName('div')
let shootInterval = false;


let winamp = new PlayMusic() // music player, with pause/stop/resume features
let checkpoints

export function addAmmo(value) {
    currentAmmo = currentAmmo + value
    document.getElementById("gun").innerText = currentAmmo
}
export function removeAmmo(value) {
    currentAmmo = currentAmmo - value
    document.getElementById("gun").innerText = currentAmmo
}
export function getAmmo() {
    return currentAmmo
}

function resetCharacter(xPosValue = 40, yPosValue = 50) {
    Character.style.left = xPosValue + "px"
    Character.style.bottom = yPosValue + "px"
}


export function StartGame() {
    levelCompletion.level1 = []
    levelCompletion.level2 = []
    levelCompletion.level3 = []
    checkpoints = fetchCheckpoints() // getting checkpoints
    playground.classList.remove(`menu`)
    playground.classList.add(`level_${currentLevel}`)
    playground.style.backgroundImage = `url(level/sprites/level${currentLevel}/background.png)`
    document.getElementById("death-screen").setAttribute("hidden", "")
    document.getElementById("bossHealthBar").setAttribute("hidden", "")
    document.getElementById("health-level").style.width = 100%
    resetBossHealth()

    mainMenu.setAttribute("hidden", "")
    playGround.removeAttribute("hidden")
    PauseButton.removeAttribute("hidden")
    backToMenu.removeAttribute("hidden")

    console.log("Game started!")
    healthBar.src = "images/hud/lives_4.png"

    createEnemies(currentLevel)
    resetCharacter()
    drawTiles(eval(`level${currentLevel}_map`), currentLevel) // setting up current level
    playground.classList.add("level_1") // type of theme song 
    playground.classList.remove("menu") // remove the previous class
    gameIsPaused = false
    gameRunning = true; // sets the game status to "is running"
    startTime = Date.now() // timer startpoint
    requestAnimationFrame(main); // animation frame loop
}

let animationFrameId = null


function Continue() {
    console.log("continue!")
    unPause()
}
function Restart() {
    console.log("restart!")
    ExitGame()
    resetCharacter() // reset character to default position 
    StartGame()
    unPause()
}

export function ExitGame() {
    playground.classList.remove(`level_${currentLevel}`)
    currentLevel = 1
    playground.classList.add(`level_${currentLevel}`)
    lives = 4
    playground.style.backgroundImage = `url(level/sprites/level${currentLevel}/background.png)`
    Character.style.left = 40
    Character.style.bottom = 40
    healthBar.src = `images/hud/lives_4.png`

    playground.classList.add(`menu`)
    score.innerHTML = "Score: 0" // resetting score
    timer.innerHTML = "00:00" // resetting timer
    gameRunning = false
    deleteTiles()
    deleteEnemies()
    deleteFlyingEnemies()
    pausedMenu.setAttribute("hidden", "")
    DeathScreen.setAttribute("hidden", "")
    playGround.setAttribute("hidden", "")
    mainMenu.removeAttribute("hidden")
    PauseButton.setAttribute("hidden", "")
    backToMenu.setAttribute("hidden", "")

    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
}

//if (!pausedMenu.hasAttribute("hidden")){
continueButton.addEventListener("click", (e) => Continue())
restartButtonP.addEventListener("click", (e) => Restart())
restartButtonD.addEventListener("click", (e) => Restart())
//}


document.addEventListener("keydown", (e) => {
    if (e.key === "m") toggleAudio()
    if (playGround.hasAttribute("hidden")) return
    if (!DeathScreen.hasAttribute("hidden")) {
        if (e.code === "KeyR") Restart()
    }
    if (pausedMenu.hasAttribute("hidden")) {
        if (e.key === "p" || e.key === "Escape") pause()
        return
    } else {
        if (e.code === "KeyR") Restart()
        if (e.key === "p" || e.key === "Escape") unPause()
        return
    }
})

function main() {
    if (!gameRunning) return
    if (gameIsPaused) {
        animationFrameId = requestAnimationFrame(main)
        return
    }
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }
    
    frameRate(frameTimes); // handles Framerate
    timerCounter(startTime, timeElapsed); // handles Timer

    let currentLeft = parseInt(Character.style.left, 10) || 40;
    let currentBottom = parseInt(Character.style.bottom, 10) || 40;
    let newX = currentLeft;
    let newY = currentBottom - 10;
    moveEnemy(enemiesParent);
    moveEnemy(flyingEnemiesParent, true)
    characterMushroomCollision(mushRoom)
    if (
        !checkCollision(newX, newY, "down") &&
        !physics.isJumping &&
        !checkCollision(newX + Character.offsetWidth - 5, newY, "down") &&
        lives !== 0
    ) {
        fallAnimation();
        Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)";
    }

    playGround.appendChild(enemiesParent);
    playGround.appendChild(flyingEnemiesParent);
    playGround.appendChild(Character);
    setTimeout(() => {
        animationFrameId = requestAnimationFrame(main); // mul tiksub 46-56 fps vahepeal xd 
    }, 0); // 0 asemel oli 1000 / 72, 0'iga on fps normis? 240hz ekraanil (linuxis)
    // level 3 oli 1000/72 kohutav, 30 fps lausa
}

import { createElements } from "../level/tileMap.js"
// eventlisteners for movement, character movement
document.addEventListener("keydown", (event) => {
    if (gameIsPaused) return
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
    if ((event.code === 'KeyW' || event.code === "ArrowUp")
        && (checkCollision(currentLeft, jumpHeight - 10, 'down') || checkCollision(currentLeft + Character.offsetWidth, jumpHeight - 10, 'down'))
    ) {

        charJump(jumpHeight + Character.offsetHeight * 2.5)
        Character.style.backgroundImage = "url(/images/characters/main/leprechaun_jumping.png)"
    }
    if (event.code === 'Space' && hasWeapon) {
        if (shootInterval) {
            // tulistamine bugib siia vist, v siis hasweapon muutub falseks vahest
            return;
        }
        shootInterval = true
        console.log(currentElements, currentAmmo)
        if (currentAmmo == 1 && getElements() === 0){
            removeElements()
            createElements()
        }
        if (currentAmmo <= 0) return
        removeAmmo(1)
        moveEnemy(flyingEnemiesParent, true, true)
        setTimeout(() => {
            shootInterval = false
        }, 1000)
    }

    if (physics.isMovingLeft && physics.isMovingRight) Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"
})

document.addEventListener("keyup", (event) => {
    if (gameIsPaused) return
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        stopAnimationRight()
    }
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        stopAnimationLeft()
    }
})

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
    stopAnimationLeft()
    stopAnimationRight()
    if (physics.getIsJumping()) physics.setIsJumping(false)
    document.getElementById("death-screen").setAttribute("hidden", "")
    document.getElementById("bossHealthBar").setAttribute("hidden", "")
    document.getElementById("health-level").style.width = 100%
    resetBossHealth()

    currentLevel += 1

    if (currentLevel === maxLevels) {
        document.getElementById("bossHealthBar").removeAttribute("hidden")
        document.getElementById("gun").removeAttribute("hidden")
    }
    //changelevel!
    resetCharacter() // default character setting
    if (currentLevel <= maxLevels) {
        drawTiles(eval(`level${currentLevel}_map`), currentLevel)
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
        drawTiles(eval(`level${currentLevel}_map`), currentLevel) // setting up current level
    }
}

export function levelDown() {
    if (currentLevel != maxLevels) {
        document.getElementById("bossHealthBar").setAttribute("hidden", "")
        document.getElementById("gun").setAttribute("hidden", "")
    }

    if (currentLevel === 1) { console.log("failed, trying to go down from level", currentLevel); return }
    console.log(checkpoints[`level${currentLevel - 1}`])

    document.getElementById("death-screen").setAttribute("hidden", "")
    document.getElementById("bossHealthBar").setAttribute("hidden", "")
    document.getElementById("health-level").style.width = 100%
    resetBossHealth()

    stopAnimationLeft()
    stopAnimationRight()
    if (physics.getIsJumping()) physics.setIsJumping(false)

    // changelevel!
    playground.classList.remove(`level_${currentLevel}`)
    currentLevel -= 1
    playground.classList.add(`level_${currentLevel}`)
    playground.style.backgroundImage = `url(level/sprites/level${currentLevel}/background.png)`

    resetCharacter(checkpoints[`level${currentLevel}`][0],
        checkpoints[`level${currentLevel}`][1])

    drawTiles(eval(`level${currentLevel}_map`), currentLevel)
}

export function loseLife() {
    console.log("OUCH!")

    playSoundOnce("jump.ogg")

    stopAnimationLeft()
    stopAnimationRight()
    if (physics.getIsJumping()) physics.setIsJumping(false)
    lives -= 1
    let prevScore = parseInt(score.innerHTML.replace(/[^-\d]/g, ""));// fetching the current score value
    score.innerHTML = "SCORE: " + (prevScore - 100)

    if (lives === 0) {
        console.log("HEY! YOU JUST COMPLETELY BLEW THE GAME, LEARN TO PLAY!")
        pause(true)
        document.getElementById("currentLevel").innerHTML = "Level reached: " + currentLevel
        document.getElementById("finalScore").innerHTML = "Your final score: " + score.innerHTML
        document.getElementById("finalTimer").innerHTML = "Time survived: " + timer.innerHTML
        DeathScreen.removeAttribute("hidden")
        return // restart button handle
    }

    resetCharacter() // default character setting


    healthBar.src = `images/hud/lives_${lives}.png`
}

// eventlisteners for pause & music on/off toggle'
MuteButton.addEventListener("click", (e) => {
    toggleAudio()
})
function toggleAudio() {
    if (MuteButton.src.includes("off")) {
        winamp.resume()
        MuteButton.src = "/images/hud/music_on.png"
        localStorage.setItem("muteButtonSrc", "/images/hud/music_on.png")
    } else {
        winamp.pause()
        MuteButton.src = "/images/hud/music_off.png"
        localStorage.setItem("muteButtonSrc", "/images/hud/music_off.png")
    }
}
PauseButton.addEventListener("click", (e) => {
    if (gameIsPaused) gameIsPaused = unPause()
    else gameIsPaused = pause()

    return gameIsPaused
})


// basics
let songPrePause = "paused"
export function pause(death = false) {
    if (!MuteButton.src.includes("off")) songPrePause = playground.classList.value
    if (!death) pausedMenu.removeAttribute("hidden")
    playground.classList.remove("level_1")
    playground.classList.remove("level_2")
    playground.classList.remove("level_3")

    playground.classList.add("paused")


    gameIsPaused = true
    stopAnimationLeft()
    stopAnimationRight()
    //...pause stuff
    PauseButton.src = "/images/hud/unpause.png"
    return true
}

function unPause() {
    playground.classList.remove("paused")
    if (!MuteButton.src.includes("off")) playground.classList.add(songPrePause)
    pausedMenu.setAttribute("hidden", "")


    gameIsPaused = false
    ///...pause stuff but in reverse
    PauseButton.src = "/images/hud/pause.png"
    return false
}
