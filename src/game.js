
let jumpDone = false
let start, previousTimeStamp;
// main menu
export const main = () => {
    let body = document.getElementById("playground")
    let Character = document.getElementById("character")
    //     let gameMenu = document.createElement("div")
    //     let gameMenuBTN = document.createElement("button")
    //     let gameMenuBTN2 = document.createElement("button")


    //     body.style.background = "url(../images/main_menu_gamename.png)"
    //     body.style.backgroundRepeat = "no-repeat"
    //     body.style.backgroundSize = "cover"
    //    // background-image: url("images/main_menu_gamename.png");
    //     gameMenu.id = `mainMenu`

    //     gameMenuBTN.textContent = "PLAY"
    //     gameMenuBTN.id = "playButton"
    //     gameMenuBTN2.textContent = "CREDITS"
    //     gameMenuBTN2.id = "creditsButton"

    //     gameMenu.classList.add("main")
    //     gameMenu.style.color = "red"
    //     gameMenu.textContent = "asad"

    //     gameMenu.appendChild(gameMenuBTN)
    //     gameMenu.appendChild(gameMenuBTN2)
    //body.appendChild(Character)
    var currrent = Character.getBoundingClientRect();
    console.log(currrent.y, body.offsetHeight - body.getBoundingClientRect().y)

    function movediv(timestamp) {
        if (currrent.y <= body.offsetHeight - body.getBoundingClientRect().y && currrent.y >= body.getBoundingClientRect().y) {
            currrent.y--
            console.log(currrent.y, body.getBoundingClientRect().y)
            Character.style.bottom = currrent.y + 'px';     
            requestAnimationFrame(movediv);
        }
    }
    requestAnimationFrame(movediv);

    function charJump(timestamp) {
        if (start === undefined) {
            start = timestamp;
          }
          const elapsed = timestamp - start;
        
          if (previousTimeStamp !== timestamp) {
            const count = Math.min(0.1 * elapsed, 100);
            Character.style.transform = `translateY(${-count}px)`;
            if (count === 200) jumpDone = true;
          }
          if (elapsed < 2000) {
            // Stop the animation after 2 seconds
            previousTimeStamp = timestamp;
            if (!jumpDone) {
              window.requestAnimationFrame(charJump);
            }
          }
    }
    document.addEventListener("keydown", (event) => {
        let currentPos = Character.getBoundingClientRect()
        let bodyPos = body.getBoundingClientRect()
        

        if ((event.code === 'ArrowRight' || event.code === 'KeyD') && currentPos.x <= body.offsetWidth + bodyPos.x - 30) Character.style.left = currentPos.x + 10 + 'px'
        else if ((event.code === 'ArrowRight' || event.code === 'KeyD')) Character.style.left = body.offsetWidth + bodyPos.x - 20

        if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && currentPos.x - 10 >= bodyPos.x) Character.style.left = currentPos.x - 10 + 'px'
        else if ((event.code === 'ArrowLeft' || event.code === 'KeyA')) Character.style.left = bodyPos.x

        if (event.code === 'Space') requestAnimationFrame(charJump)

    });

    body.appendChild(Character)
    return body
}
