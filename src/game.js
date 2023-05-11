

// main menu
export const main = () => {
    let body = document.querySelector("body")
    let gameMenu = document.createElement("div")
    let gameMenuBTN = document.createElement("button")
    let gameMenuBTN2 = document.createElement("button")

    body.style.background = "url(../images/main_menu_gamename.png)"
    body.style.backgroundRepeat = "no-repeat"
    body.style.backgroundSize = "cover"
   // background-image: url("images/main_menu_gamename.png");
    gameMenu.id = `mainMenu`
    
    gameMenuBTN.textContent = "PLAY"
    gameMenuBTN.id = "playButton"
    gameMenuBTN2.textContent = "CREDITS"
    gameMenuBTN2.id = "creditsButton"
    
    gameMenu.classList.add("main")
    gameMenu.style.color = "red"
    gameMenu.textContent = "asad"

    gameMenu.appendChild(gameMenuBTN)
    gameMenu.appendChild(gameMenuBTN2)

    body.appendChild(gameMenu)
    return body
}
