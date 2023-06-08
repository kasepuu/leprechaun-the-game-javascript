import { StartGame, ExitGame, currentAmmo, scoreCounter } from "./game.js"
import { buildMaps } from "../level/levels.js"
import { PlayMusic, playSoundOnce } from "./sound.js"

export let frameCapping = 0
// element variable
export const mainMenu = document.getElementById("start-menu") // LOBBY
export const Character = document.getElementById("character")
export const playGround = document.getElementById("playground")
const MuteButton = document.getElementById("toggleMute")
const PauseButton = document.getElementById("togglePause")
export const healthBar = document.getElementById("lives")
export let language = ""

let winamp = new PlayMusic()


function measureRefreshRate() {
    let frameTimes = [];
    let lastFrameTime = performance.now()
    
    function calculateRefreshRate() {
      const now = performance.now()
      const frameDuration = now - lastFrameTime
      lastFrameTime = now
      
      while (frameTimes.length > 0 && frameTimes[0] <= now - 1000) {
        frameTimes.shift()
      }
      frameTimes.push(frameDuration)
      const frameCount = frameTimes.length
      const refreshRate = frameCount > 0 ? 1000 / (frameTimes.reduce((sum, t) => sum + t) / frameCount) : 0
      
      // Use the refreshRate value as needed
      frameCapping = refreshRate > 60 ? 1000 / 72 : 0
      
      window.requestAnimationFrame(calculateRefreshRate)
    }
    
    calculateRefreshRate()
  }
  
  measureRefreshRate() // get current refresh rate

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

//game

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
        //playSoundOnce("click.wav")
        StartGame()
    })

    // äkki teha help buttoniks?
    document.getElementById("creditsButton").addEventListener("click", (e) => {
        // mainMenu.setAttribute("hidden", "")
        // playGround.removeAttribute("hidden")  
    })
}

document.getElementById("backToMenuDeath").addEventListener("click", (e) => ExitGame())
document.getElementById("backToMenuPause").addEventListener("click", (e) => ExitGame())



//<tr class="list" id="pink">
//<td class="row_cell" id="rank">1</td>
//<td class="row_cell" id="name">Joel</td>
//<td class="row_cell" id="scorepoints">664</td>
//<td class="row_cell" id="time">00:23</td>
//</tr>




// highscores here

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

    let showAmount = sbData.length < pageInfo || startingIndex + pageInfo > sbData.length ? sbData.length : pageInfo + startingIndex
    let body = document.querySelector("table")
    body.innerHTML = ""


    let navbar = document.createElement("tr")
    navbar.className = "navbar"
    navbar.style.color = "salmon"

    createCell(navbar, "row__cell", "Rank")
    createCell(navbar, "row__cell", "Name")
    createCell(navbar, "row__cell", "Score")
    createCell(navbar, "row__cell", "Time")

    body.appendChild(navbar)

    for (let i = startingIndex; i < showAmount; i++) {

        let ranking = numberEnding(i+1)
        let scorepoints = sbData[i].score
        let name = sbData[i].player
        let time = sbData[i].time


        let row = document.createElement("tr")
        row.className = "list"

        createCell(row, "row_cell", ranking, "td")
        createCell(row, "row_cell", name, "td")
        createCell(row, "row_cell", scorepoints)
        createCell(row, "row_cell", time, "td")

        body.appendChild(row)
    }
}

function numberEnding(nr){
    if (nr === 1) return nr + "st"
    else if (nr === 2) return nr + "nd"
    else if (nr === 3) return nr + "rd"
    else return nr + "th"
}

buildMaps()


