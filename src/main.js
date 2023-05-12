import { startGame, stopGame, resetGame } from "./game.js"

var playground = document.querySelector("#playground")
var buttons = document.querySelectorAll("button")
var divs = document.querySelectorAll("div")
var creditsInfo = document.querySelector("h3")



// START THE GAME!
document.getElementById("startButton").addEventListener("click", (e) => {
    console.log("game started")
    // hiding buttons
    for (let b = 0; b < buttons.length; b++) {
        if (buttons[b].id != "backToMenu") {
            buttons[b].setAttribute("hidden", "hidden")
        } else {
            buttons[b].removeAttribute("hidden")
        }
    }
    // hiding game title
    for (let gT = 0; gT < divs.length; gT++) {
        if (divs[gT].id === "playground") {
            divs[gT].style.backgroundImage = "url(../images/main_menu_noname.png)"
            //  divs[gT].setAttribute("hidden", "hidden")
        }
    }

    if (!creditsInfo.hasAttribute("hidden")) creditsInfo.setAttribute("hidden", "hidden") // hide credits


    let gameStart = document.querySelector(".theGame")
    if (gameStart.hasAttribute("hidden")) {
        gameStart.removeAttribute("hidden")
        startGame()
    }
})

// RETURN BACK TO MENU
document.getElementById("backToMenu").addEventListener("click", () => {
    console.log("game exited:")
    let buttons = document.querySelectorAll("button")
    let divs = document.querySelectorAll("div")

    // unhiding buttons
    for (let b = 0; b < buttons.length; b++) {
        if (buttons[b].id === "backToMenu") {
            buttons[b].setAttribute("hidden", "hidden")
        } else {
            buttons[b].removeAttribute("hidden")
        }
    }

    // unhiding game title
    for (let gT = 0; gT < divs.length; gT++) {
        if (divs[gT].id === "playground") {
            // divs[gT].removeAttribute("hidden")
            divs[gT].style.backgroundImage = "url(../images/main_menu_gamename.png)"
        }
    }
    let gameStart = document.querySelector(".theGame")

    if (!gameStart.hasAttribute("hidden")) {
        gameStart.setAttribute("hidden", "hidden")
        stopGame()
        resetGame()
    }
})

// SHOW CREDITS
document.getElementById("creditsButton").addEventListener("click", () => {
    console.log("credits shown:")

    let creditsInfo = document.querySelector("h3")

    if (creditsInfo.hasAttribute("hidden")) {
        creditsInfo.removeAttribute("hidden")
    } else {
        creditsInfo.setAttribute("hidden", "hidden")
    }
})
