
// simple variables, health, current level etc
export let currentLevel = 1
export let currentAmmo = 3 // current ammo count
export let scoreCounter = 0
export let scoreTimeElapsed = 200
let lives = 4
let maxLevels = 3

// list of variables
export let gameIsPaused = true
let frameTimes = []
export let gameRunning = false
let playInStoryMode = false
// importing 
import { mainMenu, playGround, healthBar, Character, frameCapping } from "./main.js"
import { resetBossHealth } from "./physics.js"
//imports
import { fallAnimation, charJump, moveLeft, moveRight, checkCollision, stopAnimationRight, stopAnimationLeft, moveEnemy, characterMushroomCollision } from "./physics.js"
import * as physics from "./physics.js"
import { PlayMusic, playSoundOnce } from "./sound.js"
import { levelMaps } from "../level/levels.js"
import { drawTiles, deleteTiles, deleteEnemies, fetchCheckpoints, deleteFlyingEnemies, resetCharacter, removeElements, getElements, createElements } from "../level/tileMap.js"
import { frameRate, timerCounter, resetTimer } from "./overlayItems.js"
export let lastLeftMove = false

// for pausemenu
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
let bonus = document.getElementById("bonus")
const DeathScreen = document.getElementById("death-screen")
const MuteButton = document.getElementById("musicButton")
const SettingButton = document.getElementById("settings")
const SettingMenu = document.getElementById("settingMenu")
let enemiesParent = document.getElementById("enemies")
let flyingEnemiesParent = document.getElementById("flyingEnemies")
let elements = document.getElementById('elements')
let mushRoom = elements.getElementsByTagName('div')
let shootInterval = false;

let winamp = new PlayMusic() // music player, with pause/stop/resume features
let checkpoints
let animationFrameId = null

export function addAndReturnScore(amount) {
    scoreCounter += amount
    score.innerHTML = `SCORE: ${scoreCounter}`
    return scoreCounter
}

export function reduceTimerScore(amount) {
    scoreTimeElapsed += amount
    if (bonus) bonus.innerHTML = `BONUS: ${scoreTimeElapsed}`
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

// story mode removed

export function StartGame(storyMode = false) {

    levelCompletion.level1 = []
    levelCompletion.level2 = []
    levelCompletion.level3 = []
    scoreCounter = 0
    scoreTimeElapsed = 120
    if (bonus) bonus.innerHTML = `BONUS: ${scoreTimeElapsed}`
    currentAmmo = 3
    checkpoints = fetchCheckpoints() // getting checkpoints
    playground.classList.remove(`menu`)
    playground.classList.add(`level_${currentLevel}`)
    playground.style.backgroundImage = `url(game/level/sprites/level${currentLevel}/background.png)`
    document.getElementById("death-screen").setAttribute("hidden", "")
    document.getElementById("bossHealthBar").setAttribute("hidden", "")
    document.getElementById("health-level").style.width = "100%"
    document.getElementById("gun").innerText = currentAmmo
    document.getElementById("gun").setAttribute("hidden", "")
    resetBossHealth()

    // story disabled

    if (currentLevel === 3) {
        document.getElementById("bossHealthBar").removeAttribute("hidden")
        document.getElementById("gun").removeAttribute("hidden")
    }
    mainMenu.setAttribute("hidden", "")
    playGround.removeAttribute("hidden")

    console.log("Game started!")
    healthBar.src = "game/images/hud/lives_4.png"

    drawTiles(levelMaps[currentLevel - 1], currentLevel) // setting up current level
    playground.classList.add("level_1") // type of theme song 
    playground.classList.remove("menu") // remove the previous class
    gameIsPaused = false
    gameRunning = true; // sets the game status to "is running"
    resetTimer()
    requestAnimationFrame(main); // animation frame loop
}

export function ExitGame() {
    
    scoreCounter = 0
    scoreTimeElapsed = 200
    currentLevel = 1
    lives = 4
    healthBar.src = `game/images/hud/lives_4.png`

    playground.classList.remove(`level_${currentLevel}`)
    playground.classList.add(`level_${currentLevel}`)
    playground.style.backgroundImage = `url(game/level/sprites/level${currentLevel}/background.png)`
    playground.classList.add(`menu`)

    resetCharacter()
    deleteTiles()
    deleteEnemies()
    deleteFlyingEnemies()

    score.innerHTML = `SCORE: ${scoreCounter}` // resetting score
    timer.innerHTML = "00:00" // resetting timer (overlay updates bonus in timer)
    if (bonus) bonus.innerHTML = `BONUS: ${scoreTimeElapsed}`
    gameRunning = false

    SettingMenu.setAttribute("hidden", "")
    DeathScreen.setAttribute("hidden", "")
    playGround.setAttribute("hidden", "")
    mainMenu.removeAttribute("hidden")

    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
}


function main() {
    if (!gameRunning) return
    if (gameIsPaused) { animationFrameId = requestAnimationFrame(main); return }

    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);

    // updating framerate & timer
    frameRate(frameTimes);
    timerCounter();

    updateEntityPositioning() // updating the positions of enemies & the main character

    playGround.appendChild(enemiesParent);
    playGround.appendChild(flyingEnemiesParent);
    playGround.appendChild(Character);

    setTimeout(() => {
        animationFrameId = requestAnimationFrame(main);
    }, frameCapping);
}

function updateEntityPositioning() {
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
}

// handling the themesong between multiple levels
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            if (playground.classList.contains("menu")) {
                if (!MuteButton.innerHTML.includes("OFF")) winamp.setAudio("menu.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("level_1")) {
                if (!MuteButton.innerHTML.includes("OFF")) winamp.setAudio("level1.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("level_2")) {
                if (!MuteButton.innerHTML.includes("OFF")) winamp.setAudio("level2.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("level_3")) {
                if (!MuteButton.innerHTML.includes("OFF")) winamp.setAudio("level3.ogg")
                else winamp.pause()
            } else if (playground.classList.contains("paused")) {
                if (!MuteButton.innerHTML.includes("OFF")) winamp.setAudio("paused.ogg")
                else winamp.pause()
            }
        }
    })
})

observer.observe(playground, { attributes: true }) // observing the current status of playground 

// game events
export function levelUp() {
    playSoundOnce("levelup.wav")

    stopAnimationLeft()
    stopAnimationRight()
    if (physics.getIsJumping()) physics.setIsJumping(false)

    document.getElementById("death-screen").setAttribute("hidden", "")
    document.getElementById("bossHealthBar").setAttribute("hidden", "")

    resetBossHealth()
    resetCharacter()

    currentLevel += 1
    writeCurrentStory(currentLevel) // storytime :)

    if (currentLevel === maxLevels) {
        document.getElementById("bossHealthBar").removeAttribute("hidden")
        document.getElementById("gun").removeAttribute("hidden")
    }

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
    // this function is working, however is currently unused!
    if (currentLevel != maxLevels) {
        document.getElementById("bossHealthBar").setAttribute("hidden", "")
        document.getElementById("gun").setAttribute("hidden", "")
    }

    if (currentLevel === 1) { console.log("failed, trying to go down from level", currentLevel); return }

    document.getElementById("death-screen").setAttribute("hidden", "")
    document.getElementById("bossHealthBar").setAttribute("hidden", "")
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
    addAndReturnScore(-100)

    if (lives === 0) {
        console.log("HEY! YOU JUST COMPLETELY BLEW THE GAME, LEARN TO PLAY!")
        pause(true)
        document.getElementById("currentLevel").innerHTML = "Level reached: " + currentLevel
        document.getElementById("finalScore").innerHTML = `SCORE: ${scoreCounter} <br>TIME BONUS: +${scoreTimeElapsed}<br>TOTAL SCORE: ${scoreCounter + scoreTimeElapsed}`
        const plainTime = document.getElementById("timer").innerHTML.split(" ")[0]
        document.getElementById("finalTimer").innerHTML = plainTime
        // update bests in localStorage
        const totalScore = scoreCounter + scoreTimeElapsed
        const bestTotal = parseInt(localStorage.getItem("bestTotalScore") || "0", 10)
        const bestTimeSec = parseInt(localStorage.getItem("bestTimeSec") || "0", 10)
        const timerText = document.getElementById("timer").innerHTML.split(" ")[0]
        const [mm, ss] = timerText.split(":").map(n => parseInt(n, 10))
        const elapsedSec = (isNaN(mm) || isNaN(ss)) ? 0 : (mm * 60 + ss)
        if (totalScore > bestTotal) localStorage.setItem("bestTotalScore", String(totalScore))
        if (elapsedSec > bestTimeSec) localStorage.setItem("bestTimeSec", String(elapsedSec))
        const finalScoreInput = document.getElementById("final_score")
        const finalTimerInput = document.getElementById("final_timer")
        if (finalScoreInput) finalScoreInput.value = scoreCounter + scoreTimeElapsed
        if (finalTimerInput) finalTimerInput.value = timer.innerHTML

        DeathScreen.removeAttribute("hidden")
        return // restart button handle
    }

    resetCharacter() // default character setting

    if (lives >= 0) healthBar.src = `game/images/hud/lives_${lives}.png`
}


// pause etc.. simple functions
function toggleAudio() {
    if (MuteButton.innerHTML.includes("OFF")) {
        winamp.resume()
        MuteButton.innerHTML = "MUSIC ON"
        localStorage.setItem("muteButtonSrc", "ON")

    } else {
        winamp.pause()
        MuteButton.innerHTML = "MUSIC OFF"
        localStorage.setItem("muteButtonSrc", "OFF")
    }
}

let songPrePause = `level${currentLevel}`
export function pause(death = false) {
    if (!MuteButton.innerHTML.includes("OFF")) songPrePause = playground.classList.value
    if (!death) SettingMenu.removeAttribute("hidden")
    playground.classList.remove("level_1")
    playground.classList.remove("level_2")
    playground.classList.remove("level_3")

    playground.classList.add("paused")


    gameIsPaused = true
    stopAnimationLeft()
    stopAnimationRight()
    //...pause stuff
    return true
}

export function unPause() {
    playground.classList.remove("paused")
    playground.classList.add(`level_${currentLevel}`)
    /// if (!MuteButton.innerHTML.includes("OFF")) playground.classList.add(songPrePause)
    SettingMenu.setAttribute("hidden", "")
    DeathScreen.setAttribute("hidden", "")

    gameIsPaused = false

    return false
}

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

// eventlisteners for movement, character movement
document.addEventListener("keydown", (event) => {
    event.preventDefault();
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
        score.innerHTML = `SCORE: ${addAndReturnScore(-100)} (+${scoreTimeElapsed})`// +500 score for every hit

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

// eventlisteners for pause & music on/off toggle'
MuteButton.addEventListener("click", (e) => toggleAudio())
SettingButton.addEventListener("click", (e) => {
    if (gameIsPaused) return gameIsPaused = unPause()
    else return gameIsPaused = pause()
})

continueButton.addEventListener("click", (e) => Continue())
restartButtonP.addEventListener("click", (e) => Restart())
restartButtonD.addEventListener("click", (e) => Restart())


// eventlistener for keydown shortcuts
document.addEventListener("keydown", (e) => {
    if (e.code === "KeyM") toggleAudio()
    if (playGround.hasAttribute("hidden")) return
    if (!DeathScreen.hasAttribute("hidden")) if (e.code === "keyR") Restart()
    

    if (SettingMenu.hasAttribute("hidden")) {
        if ((e.code === "KeyP" || e.key === "Escape") && DeathScreen.hasAttribute("hidden")) pause()
        return
    } else {
        if (e.code === "KeyR") Restart()
        if ((e.code === "KeyP" || e.key === "Escape") && DeathScreen.hasAttribute("hidden")) unPause()
        return
    }
})
