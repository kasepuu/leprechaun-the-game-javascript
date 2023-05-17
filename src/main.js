import { StartGame, ExitGame } from "./game.js"
import { buildMaps } from "../level/levels.js"
import { PlayMusic } from "./sound.js"

// element variables
export let mainMenu = document.getElementById("start-menu") // LOBBY
export let Character = document.getElementById("character")
export let playGround = document.getElementById("playground")
export let MuteButton = document.getElementById("toggleMute")
export let PauseButton = document.getElementById("togglePause")
export let healthBar = document.getElementById("lives")
export let backToMenu = document.getElementById("backToMenu") // RETURN TO LOBBY

let winamp = new PlayMusic()
// HANDLING THE THEME SONG WHEN FIRST VISIT, on click though :(
window.addEventListener("click", (e) => {
    if (!mainMenu.hasAttribute("hidden")){
        if (!MuteButton.src.includes("off")) winamp.setAudio("menu.ogg")
    }
})

// FETCHING THE PREVIOUS STATE OF MUTEBUTTON STATUS
window.addEventListener("load", (e) => {
    const savedSrc = localStorage.getItem("muteButtonSrc")
    if (savedSrc) {
        MuteButton.src = savedSrc
    }
})


document.addEventListener("keypress", (e) => {
    if (mainMenu.hasAttribute("hidden")) return
    if (e.key === "s") StartGame()
})


document.getElementById("startButton").addEventListener("click", () => StartGame())

document.getElementById("creditsButton").addEventListener("click", (e) => {
    // mainMenu.setAttribute("hidden", "")
    // playGround.removeAttribute("hidden")  
})

document.getElementById("backToMenu").addEventListener("click", (e) => ExitGame())


buildMaps()


