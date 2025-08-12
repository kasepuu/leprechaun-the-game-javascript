
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
export let gameRunning = false
let playInStoryMode = true
// importing 
import { mainMenu, playGround, healthBar, Character, frameCapping } from "./main.js"
import { resetBossHealth } from "./physics.js"
//imports
import { fallAnimation, charJump, moveLeft, moveRight, checkCollision, stopAnimationRight, stopAnimationLeft, moveEnemy, characterMushroomCollision } from "./physics.js"
import * as physics from "./physics.js"
import { PlayMusic, playSoundOnce } from "./sound.js"
import { levelMaps } from "../level/levels.js"
import { drawTiles, deleteTiles, deleteEnemies, fetchCheckpoints, deleteFlyingEnemies, resetCharacter, removeElements, getElements, createElements } from "../level/tileMap.js"
import { frameRate, timerCounter } from "./overlayItems.js"
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
let stopWriting = false
let writingTimeouts = []
function continueStory() {
    writingTimeouts.forEach(timeoutId => clearTimeout(timeoutId))
    writingTimeouts = []
    currentlyWritingStory = false
    document.getElementById("sbTitle").innerHTML = ""
    document.getElementById("sbText").innerHTML = ""
    document.getElementById("sbText2").innerHTML = ""
    document.getElementById("sbContinue").innerHTML = ""
    document.getElementById("storybox").setAttribute("hidden", "")
}

function writeStory(body, text, speed, showContinue = false, startDelay = 0) {
    document.getElementById("storybox").removeAttribute("hidden")
    // Clear existing timeouts


    setTimeout(() => {
        for (let i = 0; i < text.length; i++) {
            const timeout = setTimeout(() => {
                if (stopWriting) return

                body.innerHTML += text.charAt(i);
                currentlyWritingStory = true
                //continue
                if (body.innerHTML.includes(text) && showContinue) document.getElementById("sbContinue").innerHTML = "continue (c) ..."
            }, speed * i);

            writingTimeouts.push(timeout)
        }
    }, startDelay)
}

function writeCurrentStory(currentLevel) {
    continueStory()
    if (!playInStoryMode) return

    if (currentLevel === 1) {
        writeStory(document.getElementById("sbTitle"), "NARRATOR:", 10)
        writeStory(document.getElementById("sbText"), "once there was an elf, who lived happily ever after.", 50, false)
        writeStory(document.getElementById("sbText2"), "But then the evil werewolves and dogs started howling. And the little elf had enough!", 50, true, 3300)
    }
    if (currentLevel === 2) {
        writeStory(document.getElementById("sbTitle"), "NARRATOR:", 10)
        writeStory(document.getElementById("sbText"), "The evil dogs lead the elf in to a cave.", 50, false)
        writeStory(document.getElementById("sbText2"), "Now the little one must find a way out!", 50, true, 2500)
    }
    if (currentLevel === 3) {
        writeStory(document.getElementById("sbTitle"), "ELF:", 10)
        writeStory(document.getElementById("sbText"), "What is that?....", 50, false, 500)
        writeStory(document.getElementById("sbText2"), "A dragon! A live breating one! I must shoot him down!", 50, true, 4000)
    }
}

export function StartGame(storyMode = false) {
    currentlyWritingStory = false
    playInStoryMode = storyMode
    stopWriting = false

    levelCompletion.level1 = []
    levelCompletion.level2 = []
    levelCompletion.level3 = []
    scoreCounter = 0
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

    writeCurrentStory(currentLevel) // writing story for current level

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
    startTime = Date.now() // timer startpoint
    requestAnimationFrame(main); // animation frame loop
}

export function ExitGame() {
    continueStory()
    stopWriting = true
    scoreCounter = 0
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

    score.innerHTML = "Score: " + scoreCounter // resetting score
    timer.innerHTML = "00:00" // resetting timer
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
    timerCounter(startTime, timeElapsed);

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
    score.innerHTML = "SCORE: " + (addAndReturnScore(-100))

    if (lives === 0) {
        console.log("HEY! YOU JUST COMPLETELY BLEW THE GAME, LEARN TO PLAY!")
        pause(true)
        document.getElementById("currentLevel").innerHTML = "Level reached: " + currentLevel
        document.getElementById("finalScore").innerHTML = "Your final score: " + scoreCounter
        document.getElementById("finalTimer").innerHTML = "Time survived: " + timer.innerHTML
        document.getElementById("final_score").value = scoreCounter
        document.getElementById("final_timer").value = timer.innerHTML

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
    if ((e.code === "KeyC") && document.getElementById("sbContinue").innerHTML !== "") continueStory()

    if (SettingMenu.hasAttribute("hidden")) {
        if ((e.code === "KeyP" || e.key === "Escape") && DeathScreen.hasAttribute("hidden")) pause()
        return
    } else {
        if (e.code === "KeyR") Restart()
        if ((e.code === "KeyP" || e.key === "Escape") && DeathScreen.hasAttribute("hidden")) unPause()
        return
    }
})
