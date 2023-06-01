import { StartGame, ExitGame, currentAmmo } from "./game.js"
import { buildMaps } from "../level/levels.js"
import { PlayMusic, playSoundOnce } from "./sound.js"

export const frameCapping = 1000 / 72
// element variable
export const mainMenu = document.getElementById("start-menu") // LOBBY
export const Character = document.getElementById("character")
export const playGround = document.getElementById("playground")
const MuteButton = document.getElementById("toggleMute")
const PauseButton = document.getElementById("togglePause")
export const healthBar = document.getElementById("lives")
export const backToMenu = document.getElementById("backToMenu") // RETURN TO LOBBY

export let language = ""

let winamp = new PlayMusic()

document.getElementById("gun").innerText = currentAmmo // imo tekitab laggi

// FETCHING THE PREVIOUS STATE OF MUTEBUTTON STATUS
window.addEventListener("load", (e) => {
    const savedSrc = localStorage.getItem("muteButtonSrc")
    if (savedSrc) MuteButton.src = savedSrc
})

// HANDLING THE THEME SONG WHEN FIRST VISIT, on click though :(
window.addEventListener("click", (e) => {
    if (!mainMenu.hasAttribute("hidden")) {
        if (!MuteButton.src.includes("off")) winamp.setAudio("menu.ogg")
    }
})

if (!mainMenu.hasAttribute("hidden")) {
    document.addEventListener("keypress", (e) => {
        if (mainMenu.hasAttribute("hidden")) return
        if (e.key === "s") StartGame()
    })

    document.getElementById("startButton").addEventListener("click", () => {
        playSoundOnce("click.wav")    
        StartGame()
    })

    // äkki teha help buttoniks?
    document.getElementById("creditsButton").addEventListener("click", (e) => {
        // mainMenu.setAttribute("hidden", "")
        // playGround.removeAttribute("hidden")  
    })
}

document.getElementById("backToMenu").addEventListener("click", (e) => ExitGame())



buildMaps()


