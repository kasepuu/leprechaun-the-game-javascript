import { StartGame, ExitGame, currentAmmo, scoreCounter } from "./game.js"
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

let ws = new WebSocket(`ws://localhost:8080/ws`)
let sbData = null

ws.addEventListener('open', function () {
    console.log('WebSocket connected')
})

ws.addEventListener("message", async (e) => {
    sbData = await JSON.parse(e.data)
    if (sbData !== null) {
        displayScoreBoard(sbData)
    }
})

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

document.getElementById("backToMenu").addEventListener("click", (e) => ExitGame())



//<tr class="list" id="pink">
//<td class="row_cell" id="rank">1</td>
//<td class="row_cell" id="name">Joel</td>
//<td class="row_cell" id="scorepoints">664</td>
//<td class="row_cell" id="time">00:23</td>
//</tr>






function displayScoreBoard(sbData) {
    for (let i = 0; i < sbData.length; i++) {

        let ranking = i + 1
        let scorepoints = sbData[i].score
        let name = sbData[i].player
        let time = sbData[i].time

        let body = document.querySelector("table")
        let row = document.createElement("tr")
        row.className = "list"


        let rankingCell = document.createElement("td")
        rankingCell.className = "row_cell"
        rankingCell.id = "rank"
        rankingCell.innerHTML = ranking
        row.appendChild(rankingCell)

        let nameCell = document.createElement("td")
        nameCell.className = "row_cell"
        nameCell.id = "name"
        nameCell.innerHTML = name
        row.appendChild(nameCell)

        let scoreCell = document.createElement("td")
        scoreCell.className = "row_cell"
        scoreCell.id = "scorepoints"
        scoreCell.innerHTML = scorepoints
        row.appendChild(scoreCell)

        let timeCell = document.createElement("td")
        timeCell.className = "row_cell"
        timeCell.id = "time"
        timeCell.innerHTML = time
        row.appendChild(timeCell)

        body.appendChild(row)
    }
}

buildMaps()


