import { startGame, stopGame, resetGame } from "./game.js"
import { PlayMusic } from "./sound.js"
let winamp = new PlayMusic()

let MuteButton = document.getElementById("toggleMusic")
var buttons = document.querySelectorAll("button")
let exit = document.getElementById("backToMenu")
let pause = document.getElementById("togglePause")
let gameStart = document.getElementById("theGame")

// HANDLING THE THEME SONG WHEN FIRST VISIT
function themeSong(){
    if (!MuteButton.src.includes("off"))  winamp.setAudio("menu.ogg")
    else winamp.pause()
}

// START THE GAME!
document.getElementById("startButton").addEventListener("click", (e) => {
    winamp.pause()
    winamp.stop()
    console.log("game started")
    // hiding buttons
    for (let b = 0; b < buttons.length; b++) {
        buttons[b].setAttribute("hidden", "hidden")
    }

    if (pause.hasAttribute("hidden")) pause.removeAttribute("hidden")
    if (exit.hasAttribute("hidden")) exit.removeAttribute("hidden")

    if (!creditsInfo.hasAttribute("hidden")) creditsInfo.setAttribute("hidden", "hidden") // hide credits

    // starting the game
    if (gameStart.hasAttribute("hidden")) {
        gameStart.removeAttribute("hidden")
        startGame()
    }
})

// RETURN BACK TO MENU
document.getElementById("backToMenu").addEventListener("click", () => {

    console.log("game exited:")
    exit.removeAttribute("hidden")

    for (let b = 0; b < buttons.length; b++) {
        if (buttons[b].hasAttribute("hidden")) {
            buttons[b].removeAttribute("hidden")
        }
    }

    if (!exit.hasAttribute("hidden")) exit.setAttribute("hidden", "hidden")
    if (!pause.hasAttribute("hidden")) pause.setAttribute("hidden", "hidden")

    if (!gameStart.hasAttribute("hidden")) {
        gameStart.setAttribute("hidden", "hidden")
       // backToMenu_sound()
            
        stopGame()
        resetGame()
    }
})

// SHOW CREDITS
var creditsInfo = document.querySelector("h3")
 document.getElementById("creditsButton").addEventListener("click", () => {
     console.log("credits shown:")
     let creditsInfo = document.querySelector("h3")
     if (creditsInfo.hasAttribute("hidden")) {
         creditsInfo.removeAttribute("hidden")
     } else {
         creditsInfo.setAttribute("hidden", "hidden")
     }
 })

themeSong()