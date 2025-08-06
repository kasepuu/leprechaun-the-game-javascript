import { StartGame, ExitGame, currentAmmo, scoreCounter, pause, unPause, gameRunning } from "./game.js"
import { buildMaps } from "../level/levels.js"
import { PlayMusic, playSoundOnce } from "./sound.js"

export let frameCapping = 0
export const setFrameCapping = (value) => { frameCapping = value }

// element variable
export const mainMenu = document.getElementById("start-menu")
export const Character = document.getElementById("character")
export const playGround = document.getElementById("playground")
const MuteButton = document.getElementById("musicButton")
export const healthBar = document.getElementById("lives")
export let language = ""

// websocket
let port
let sbData = null
fetch("game/templates/port.txt")
    .then(resp => {
        if (!resp.ok) {
            throw new Error("Failed to fetch the file");
        }
        return resp.text()
    })
    .then(fileData => {
        port = fileData

        let ws = new WebSocket(`ws://localhost:${port}/ws`)
        ws.addEventListener('open', function () {
            console.log('WebSocket connected')
        })

        ws.addEventListener("message", async (e) => {
            sbData = await JSON.parse(e.data)
            if (sbData !== null) {
                displayScoreBoard(sbData)
            }
        })
    })

// FETCHING THE PREVIOUS STATE OF MUTEBUTTON STATUS
window.addEventListener("load", (e) => {
    const savedSrc = localStorage.getItem("muteButtonSrc")
    if (savedSrc) MuteButton.innerHTML = "MUSIC " + savedSrc
})


//game
let gameFullscreen = false
document.getElementById("gun").innerText = currentAmmo
document.getElementById("settings").addEventListener("click", (e) => {
    document.getElementById("settingMenu").removeAttribute("hidden")
    pause(true)
    // mostly working fullscreen, disabled for now
    /*        document.getElementById("fullscreenButton").addEventListener("click", (e) => {
                gameFullscreen = !gameFullscreen
                if (gameFullscreen) {
                    enterFullscreen()
                }
                else {
                    exitFullscreen()
                }
    
                document.getElementById("fullscreenButton").innerHTML = gameFullscreen ? "FULLSCREEN ON" : "FULLSCREEN OFF"
            })*/
})

function enterFullscreen() {
    document.body.style.transform = "scale(1.5)"
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
}

function exitFullscreen() {
    document.body.style.zoom = "scale(1.0)"
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

if (!mainMenu.hasAttribute("hidden")) {
    document.addEventListener("keypress", (e) => {
        if (e.code === "KeyS" && !gameRunning) StartGame()
    })

    document.getElementById("startButton1").addEventListener("click", () => StartGame())
    document.getElementById("startButton2").addEventListener("click", () => StartGame(true))
}

document.getElementById("backToMenuDeath").addEventListener("click", () => ExitGame())
document.getElementById("backToMenuPause").addEventListener("click", () => ExitGame())


// highscores

let startingIndex = 0
const pageInfo = 5 // lines of info each sb page has
let currentPage = 0

document.getElementById("next").addEventListener("click", () => {
    if (currentPage < (sbData.length / pageInfo) - 1) {
        currentPage += 1
        startingIndex += pageInfo
        displayScoreBoard(sbData)
    }
})

document.getElementById("prev").addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage -= 1
        startingIndex -= pageInfo
        displayScoreBoard(sbData)
    }
})

function createCell(body, className, innerHTML, element = "th") {
    let cell = document.createElement(element)
    cell.className = className
    cell.innerHTML = innerHTML
    body.appendChild(cell)
}

function displayScoreBoard(sbData) {
    const tbody = document.getElementById("board")
    tbody.innerHTML = ""

    let showAmount = sbData.length < pageInfo || startingIndex + pageInfo > sbData.length
        ? sbData.length
        : pageInfo + startingIndex

    for (let i = startingIndex; i < showAmount; i++) {
        let ranking = getNumberEnding(i + 1)
        let scorepoints = sbData[i].score
        let name = sbData[i].player
        let time = sbData[i].time

        let row = document.createElement("tr")
        row.className = "list"

        createCell(row, "row_cell", ranking, "td")
        createCell(row, "row_cell", name, "td")
        createCell(row, "row_cell", scorepoints, "td")
        createCell(row, "row_cell", time, "td")

        tbody.appendChild(row)
    }
}

function getNumberEnding(nr) {
    if (nr === 1) return nr + "st"
    else if (nr === 2) return nr + "nd"
    else if (nr === 3) return nr + "rd"
    else return nr + "th"
}

buildMaps() // building maps from text files


