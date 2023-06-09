
// simple variables, health, current level etc
export let currentLevel = 1
export let currentAmmo = 3 // current ammo count
export let scoreCounter = 0
let lives = 4
let maxLevels = 3

// list of variables
export let gameIsPaused = true
let frameTimes = []
let timeElapsed = 0 // timer
let startTime // time game started at...
let gameRunning = false
// importing 
import { mainMenu, playGround, healthBar, Character, frameCapping } from "./main.js"
import { resetBossHealth } from "./physics.js"
//imports
import { fallAnimation, charJump, moveLeft, moveRight, checkCollision, stopAnimationRight, stopAnimationLeft, moveEnemy, characterMushroomCollision } from "./physics.js"
import * as physics from "./physics.js"
import { PlayMusic, playSoundOnce } from "./sound.js"
import { levelMaps } from "../level/levels.js"
import { drawTiles, deleteTiles, deleteEnemies, fetchCheckpoints, deleteFlyingEnemies, resetCharacter, removeElements, getElements } from "../level/tileMap.js"
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

export function addAndReturnScore(amount) {
    scoreCounter += amount
    return scoreCounter
}

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


// story writing!
let currentlyWritingStory = false
function continueStory() {
    currentlyWritingStory = false
    document.getElementById("sbTitle").innerHTML = ""
    document.getElementById("sbText").innerHTML = ""
    document.getElementById("sbText2").innerHTML = ""
    document.getElementById("sbContinue").innerHTML = ""
    document.getElementById("storybox").setAttribute("hidden", "")
}


function writeStory(body, text, speed, showContinue = false, startDelay = 0) {
    document.getElementById("storybox").removeAttribute("hidden")
    setTimeout(() => {

        for (let i = 0; i < text.length; i++) {

            setTimeout(() => {
                body.innerHTML += text.charAt(i);
                currentlyWritingStory = true
                //continue
                if (body.innerHTML.includes(text) && showContinue) document.getElementById("sbContinue").innerHTML = "continue (c) ..."
            }, speed * i);
        }

    }, startDelay)
}

function writeCurrentStory(currentLevel) {
    continueStory()
    if (currentLevel === 1) {
        writeStory(document.getElementById("sbTitle"), "NARRATOR:", 10)
        writeStory(document.getElementById("sbText"), "once there was an elf, who lived happily ever after.", 50, false)
        writeStory(document.getElementById("sbText2"), "But then the evil werewolves and dogs started howling. And the little elf decided that is enough!", 50, true, 3300)
    }
    if (currentLevel === 2) {
        writeStory(document.getElementById("sbTitle"), "NARRATOR:", 10)
        writeStory(document.getElementById("sbText"), "The evil dogs lead the elf in to a cave.", 50, false)
        writeStory(document.getElementById("sbText2"), "Now the little one must find a way out!", 50, true, 2500)
    }
    if (currentLevel === 3) {
        writeStory(document.getElementById("sbTitle"), "ELF:", 10)
        writeStory(document.getElementById("sbText"), "What is that?....", 50, false, 500)
        writeStory(document.getElementById("sbText2"), "Thats a dragon! A live breating one! I must shoot him down!", 50, true, 4000)
    }
}


export function StartGame() {
    levelCompletion.level1 = []
    levelCompletion.level2 = []
    levelCompletion.level3 = []
    scoreCounter = 0
    checkpoints = fetchCheckpoints() // getting checkpoints
    playground.classList.remove(`menu`)
    playground.classList.add(`level_${currentLevel}`)
    playground.style.backgroundImage = `url(game/level/sprites/level${currentLevel}/background.png)`
    document.getElementById("death-screen").setAttribute("hidden", "")
    document.getElementById("bossHealthBar").setAttribute("hidden", "")
    document.getElementById("health-level").style.width = "100%"
    resetBossHealth()


    writeCurrentStory(currentLevel) // writing story for current level

    if (currentLevel === 3) {
        document.getElementById("bossHealthBar").removeAttribute("hidden")
        document.getElementById("gun").removeAttribute("hidden")
    }
    mainMenu.setAttribute("hidden", "")
    playGround.removeAttribute("hidden")
    PauseButton.removeAttribute("hidden")

    console.log("Game started!")
    healthBar.src = "game/images/hud/lives_4.png"

    drawTiles(levelMaps[currentLevel - 1], currentLevel) // setting up current level
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
    StartGame()
    unPause()
}

export function ExitGame() {
    continueStory()
    playground.classList.remove(`level_${currentLevel}`)
    currentLevel = 1
    playground.classList.add(`level_${currentLevel}`)
    lives = 4
    playground.style.backgroundImage = `url(game/level/sprites/level${currentLevel}/background.png)`
    Character.style.left = 40
    Character.style.bottom = 40
    healthBar.src = `game/images/hud/lives_4.png`
    scoreCounter = 0
    playground.classList.add(`menu`)
    score.innerHTML = "Score: " + scoreCounter // resetting score
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

    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
}

//if (!pausedMenu.hasAttribute("hidden")){
continueButton.addEventListener("click", (e) => Continue())
restartButtonP.addEventListener("click", (e) => Restart())
restartButtonD.addEventListener("click", (e) => Restart())
//}


document.addEventListener("keydown", (e) => {
    if (e.key === "KeyM") toggleAudio()
    if (playGround.hasAttribute("hidden")) return
    if (!DeathScreen.hasAttribute("hidden")) if (e.code === "KeyR") Restart()
    if (e.code === "KeyC" && document.getElementById("sbContinue").innerHTML !== "") continueStory()

    if (pausedMenu.hasAttribute("hidden")) {
        if (e.key === "KeyP" || e.key === "Escape") pause()
        return
    } else {
        if (e.code === "KeyR") Restart()
        if (e.key === "KeyP" || e.key === "Escape") unPause()
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
        if ((!physics.isMovingLeft && !physics.isMovingRight) || (physics.isMovingLeft && physics.isMovingRight)) {
            if (currentLevel === 3 && currentAmmo > 0) Character.style.backgroundImage = "url(game/images/characters/main/leprechaun_shooting.gif)"
            else Character.style.backgroundImage = "url(game/images/characters/main/leprechaun.gif)"
        } else if (physics.isMovingLeft && !physics.isMovingRight) {
            Character.style.backgroundImage = "url(game/images/characters/main/leprechaun_walking_LEFT.gif)"
        } else if (!physics.isMovingLeft && physics.isMovingRight) {
            Character.style.backgroundImage = "url(game/images/characters/main/leprechaun_walking_RIGHT.gif)"
        }
    }

    playGround.appendChild(enemiesParent);
    playGround.appendChild(flyingEnemiesParent);
    playGround.appendChild(Character);
    setTimeout(() => {
        animationFrameId = requestAnimationFrame(main); // mul tiksub 46-56 fps vahepeal xd 
    }, frameCapping);
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
        if (!currentlyWritingStory) {
            lastLeftMove = false
            moveRight()
            Character.style.backgroundImage = "url(game/images/characters/main/leprechaun_walking_RIGHT.gif)"
        }
    }
    if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && currentPos.x - 10 >= bodyPos.x) {
        if (!currentlyWritingStory) {
            lastLeftMove = true
            moveLeft()
            Character.style.backgroundImage = "url(game/images/characters/main/leprechaun_walking_LEFT.gif)"
        }
    }
    if ((event.code === 'KeyW' || event.code === "ArrowUp")
        && (checkCollision(currentLeft, jumpHeight - 10, 'down') || checkCollision(currentLeft + Character.offsetWidth, jumpHeight - 10, 'down'))
    ) {
        if (!currentlyWritingStory) {

            charJump(jumpHeight + Character.offsetHeight * 2.5)
            if (currentLevel === 3 && currentAmmo > 0) Character.style.backgroundImage = "url(game/images/characters/main/leprechaun_shooting.gif)"
            else Character.style.backgroundImage = "url(game/images/characters/main/leprechaun_jumping.png)"
            // if (physics.isMovingLeft) Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_LEFT.gif)"
            // if (physics.isMovingRight) Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_RIGHT.gif)"
        }
    }
    if (event.code === 'Space' && (currentLevel === maxLevels)) {
        if (currentlyWritingStory) return

        if (shootInterval) {
            return;
        }
        playSoundOnce("laserShoot.wav")
        shootInterval = true
        // if currentammo is 1 and no mushrooms on the ground
        if (currentAmmo == 1 && getElements() === 0) {
            removeElements()
            createElements()
        }
        if (currentAmmo <= 0) { shootInterval = false; Character.style.backgroundImage = "url(game/images/characters/main/leprechaun.gif"; return }


        Character.style.backgroundImage = "url(game/images/characters/main/leprechaun_shooting.gif"

        // handling score, making each shot cost some score points :)
        score.innerHTML = "SCORE: " + (addAndReturnScore(-100)) // +500 score for every hit
        ///

        removeAmmo(1)
        moveEnemy(flyingEnemiesParent, true, true)
        setTimeout(() => {
            shootInterval = false
        }, 1000)
    }

    if (physics.isMovingLeft && physics.isMovingRight) Character.style.backgroundImage = "url(game/images/characters/main/leprechaun.gif)"
})

document.addEventListener("keyup", (event) => {
    if (gameIsPaused) return
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        if (!currentlyWritingStory) {
            stopAnimationRight()
        }
    }
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        if (!currentlyWritingStory) {
            stopAnimationLeft()
        }
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
    playSoundOnce("levelup.wav")
    stopAnimationLeft()
    stopAnimationRight()
    if (physics.getIsJumping()) physics.setIsJumping(false)
    document.getElementById("death-screen").setAttribute("hidden", "")
    document.getElementById("bossHealthBar").setAttribute("hidden", "")
    document.getElementById("health-level").style.width = "100%"

    resetCharacter()

    currentLevel += 1
    writeCurrentStory(currentLevel)

    if (currentLevel === maxLevels) {
        document.getElementById("bossHealthBar").removeAttribute("hidden")
        document.getElementById("gun").removeAttribute("hidden")
    }
    //changelevel!

    if (currentLevel <= maxLevels) {
        drawTiles(levelMaps[currentLevel - 1], currentLevel) // setting up current level
        playground.classList.remove(`level_${currentLevel - 1}`)
        playground.classList.add(`level_${currentLevel}`)
        playground.style.backgroundImage = `url(game/level/sprites/level${currentLevel}/background.png)`
    }
    else {
        console.log("HEY! YOU JUST COMPLETED THE GAME!")
        currentLevel = 1
        lives = 4
        playground.classList.remove(`level_${maxLevels}`)
        playground.classList.add(`level_${currentLevel}`)
        playground.style.backgroundImage = `url(game/level/sprites/level${currentLevel}/background.png)`
        drawTiles(levelMaps[currentLevel - 1], currentLevel) // setting up current level
    }
}

export function levelDown() {
    if (currentLevel != maxLevels) {
        document.getElementById("bossHealthBar").setAttribute("hidden", "")
        document.getElementById("gun").setAttribute("hidden", "")
    }

    if (currentLevel === 1) { console.log("failed, trying to go down from level", currentLevel); return }

    document.getElementById("death-screen").setAttribute("hidden", "")
    document.getElementById("bossHealthBar").setAttribute("hidden", "")
    document.getElementById("health-level").style.width = 100 %
        resetBossHealth()

    stopAnimationLeft()
    stopAnimationRight()
    if (physics.getIsJumping()) physics.setIsJumping(false)

    // changelevel!
    playground.classList.remove(`level_${currentLevel}`)
    currentLevel -= 1
    playground.classList.add(`level_${currentLevel}`)
    playground.style.backgroundImage = `url(game/level/sprites/level${currentLevel}/background.png)`

    resetCharacter(checkpoints[`level${currentLevel}`][0],
        checkpoints[`level${currentLevel}`][1])

    drawTiles(levelMaps[currentLevel - 1], currentLevel) // setting up current level
}

export function loseLife() {
    playSoundOnce("damage.wav", 0.3, 0.1)

    stopAnimationLeft()
    stopAnimationRight()
    if (physics.getIsJumping()) physics.setIsJumping(false)
    lives -= 1
    score.innerHTML = "SCORE: " + (addAndReturnScore(-100))

    if (lives === 0) {
        console.log("HEY! YOU JUST COMPLETELY BLEW THE GAME, LEARN TO PLAY!")
        pause(true)
        document.getElementById("currentLevel").innerHTML = "Level reached: " + currentLevel
        document.getElementById("finalScore").innerHTML = "Your final score: " + scoreCounter
        document.getElementById("finalTimer").innerHTML = "Time survived: " + timer.innerHTML

        console.log(scoreCounter)
        console.log(timer.innerHTML)

        document.getElementById("final_score").value = scoreCounter
        document.getElementById("final_timer").value = timer.innerHTML
        DeathScreen.removeAttribute("hidden")
        return // restart button handle
    }

    resetCharacter() // default character setting


    healthBar.src = `game/images/hud/lives_${lives}.png`
}

// eventlisteners for pause & music on/off toggle'
MuteButton.addEventListener("click", (e) => {
    toggleAudio()
})
function toggleAudio() {
    if (MuteButton.src.includes("off")) {
        winamp.resume()
        MuteButton.src = "game/images/hud/music_on.png"
        localStorage.setItem("muteButtonSrc", "game/images/hud/music_on.png")
    } else {
        winamp.pause()
        MuteButton.src = "game/images/hud/music_off.png"
        localStorage.setItem("muteButtonSrc", "game/images/hud/music_off.png")
    }
}
PauseButton.addEventListener("click", (e) => {
    if (gameIsPaused) gameIsPaused = unPause()
    else gameIsPaused = pause()

    return gameIsPaused
})


// basics
let songPrePause = `level${currentLevel}`
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
    PauseButton.src = "game/images/hud/unpause.png"
    return true
}

function unPause() {
    playground.classList.remove("paused")
    if (!MuteButton.src.includes("off")) playground.classList.add(songPrePause)
    pausedMenu.setAttribute("hidden", "")


    gameIsPaused = false
    ///...pause stuff but in reverse
    PauseButton.src = "game/images/hud/pause.png"
    return false
}
