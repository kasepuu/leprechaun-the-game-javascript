import { StartGame, ExitGame } from "./game.js"
import { buildMaps } from "../level/levels.js"
import { PlayMusic } from "./sound.js"

// element variables
export const mainMenu = document.getElementById("start-menu") // LOBBY
export const Character = document.getElementById("character")
export const playGround = document.getElementById("playground")
const MuteButton = document.getElementById("toggleMute")
const PauseButton = document.getElementById("togglePause")
export const healthBar = document.getElementById("lives")
export const backToMenu = document.getElementById("backToMenu") // RETURN TO LOBBY

export let language = ""

let winamp = new PlayMusic()

let lang_EST = document.getElementById("EST")
let lang_ENG = document.getElementById("ENG")
let welcomeScreen = document.getElementById("welcome-screen")

// FETCHING THE PREVIOUS STATE OF MUTEBUTTON STATUS
window.addEventListener("load", (e) => {
    const savedSrc = localStorage.getItem("muteButtonSrc")
    if (savedSrc) MuteButton.src = savedSrc
    const savedSrc2 = localStorage.getItem("languageSrc")
    if (savedSrc2 === "est"){
        language = "EST"
    } else if (savedSrc2 === "eng"){
        language = "ENG"
    } else {
        welcomeScreen.removeAttribute("hidden")

        lang_ENG.addEventListener("click", ()=>{
            console.log("eng")
            welcomeScreen.setAttribute("hidden", "")
            mainMenu.removeAttribute("hidden")
            MuteButton.removeAttribute("hidden")
            localStorage.setItem("languageSrc", "eng")
        })
        lang_EST.addEventListener("click", ()=>{
            console.log("est")
            welcomeScreen.setAttribute("hidden", "")
            mainMenu.removeAttribute("hidden")
            MuteButton.removeAttribute("hidden")
            localStorage.setItem("languageSrc", "est")
        })
    }

    console.log("language: ",language, "\nto change this you must do it manually in F12->applications->storage->local storage")
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

    document.getElementById("startButton").addEventListener("click", () => StartGame())

    document.getElementById("creditsButton").addEventListener("click", (e) => {
        // mainMenu.setAttribute("hidden", "")
        // playGround.removeAttribute("hidden")  
    })
}

document.getElementById("backToMenu").addEventListener("click", (e) => ExitGame())



buildMaps()


