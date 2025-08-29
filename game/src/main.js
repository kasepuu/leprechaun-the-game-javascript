import { StartGame, ExitGame, currentAmmo, pause, gameRunning } from "./game.js"
import { buildMaps } from "../level/levels.js"

export let frameCapping = 0
export const setFrameCapping = (value) => { frameCapping = value }

// element variable
export const mainMenu = document.getElementById("start-menu")
export const Character = document.getElementById("character")
export const playGround = document.getElementById("playground")
const MuteButton = document.getElementById("musicButton")
export const healthBar = document.getElementById("lives")
export let language = ""

// FETCHING THE PREVIOUS STATE OF MUTEBUTTON STATUS
window.addEventListener("load", (e) => {
    const savedSrc = localStorage.getItem("muteButtonSrc")
    if (savedSrc) MuteButton.innerHTML = "MUSIC " + savedSrc
})

//game
document.getElementById("gun").innerText = currentAmmo
document.getElementById("settings").addEventListener("click", (e) => {
    document.getElementById("settingMenu").removeAttribute("hidden")
    pause(true)
})

if (!mainMenu.hasAttribute("hidden")) {
    document.addEventListener("keypress", (e) => {
        if (e.code === "KeyS" && !gameRunning) StartGame()
    })

    document.getElementById("startButton1").addEventListener("click", () => StartGame())

    // update scoreboard to show bests instead of pagination
    const boardBody = document.getElementById("board")
    if (boardBody) {
        const prev = document.getElementById("prev"); if (prev) prev.setAttribute("hidden", "")
        const next = document.getElementById("next"); if (next) next.setAttribute("hidden", "")
        // clear existing rows
        boardBody.innerHTML = ""
        const bestTotal = parseInt(localStorage.getItem("bestTotalScore") || "0", 10)
        const bestTimeSec = parseInt(localStorage.getItem("bestTimeSec") || "0", 10)
        const mm = Math.floor(bestTimeSec / 60)
        const ss = bestTimeSec % 60
        const bestTimeFmt = (mm < 10 ? '0' : '') + mm + ":" + (ss < 10 ? '0' : '') + ss

        const rows = [
            { type: "TIME RECORD", value: bestTimeFmt },
            { type: "BEST TOTAL SCORE", value: String(bestTotal) },
        ]

        rows.forEach(r => {
            const tr = document.createElement("tr")
            tr.className = "row"
            const tdType = document.createElement("td"); tdType.className = "row__cell"; tdType.textContent = r.type
            const tdValue = document.createElement("td"); tdValue.className = "row__cell"; tdValue.textContent = r.value
            tr.appendChild(tdType)
            tr.appendChild(tdValue)
            boardBody.appendChild(tr)
        })

        const resetBtn = document.getElementById("resetHighscores")
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                localStorage.removeItem("bestTotalScore")
                localStorage.removeItem("bestTimeSec")
                // refresh view
                const zeroRows = [
                    { type: "TIME", value: "00:00" },
                    { type: "GAME", value: "0" },
                ]
                boardBody.innerHTML = ""
                zeroRows.forEach(r => {
                    const tr = document.createElement("tr")
                    tr.className = "row"
                    const tdType = document.createElement("td"); tdType.className = "row__cell"; tdType.textContent = r.type
                    const tdValue = document.createElement("td"); tdValue.className = "row__cell"; tdValue.textContent = r.value
                    tr.appendChild(tdType)
                    tr.appendChild(tdValue)
                    boardBody.appendChild(tr)
                })
            })
        }
    }
}

document.getElementById("backToMenuDeath").addEventListener("click", () => ExitGame())
document.getElementById("backToMenuPause").addEventListener("click", () => ExitGame())

buildMaps() // building maps from text files


