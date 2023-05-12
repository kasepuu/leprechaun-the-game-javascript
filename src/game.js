
let jumpActive = false
let start, previousTimeStamp;

// main menu
export const main = () => {
    let body = document.getElementById("playground")
    let Character = document.getElementById("character")

    var currrent = Character.getBoundingClientRect();
    console.log(currrent.y, body.offsetHeight + body.getBoundingClientRect().y - 39)

    function movediv(timestamp) {
        if (start === undefined) {
            start = timestamp;
        }
        const elapsed = timestamp - start;

        if (currrent.y <= body.offsetHeight + body.getBoundingClientRect().y - 39) {
    
            if (previousTimeStamp !== timestamp) {
                const count = Math.min(0.1 * elapsed, 100);
                Character.style.transform = `translateY(${count}px)`;
            }
            requestAnimationFrame(movediv);
        }
    }
    if (!jumpActive) {
        requestAnimationFrame(movediv)
    }
    function charJump(timestamp) {
        if (start === undefined) {
            start = timestamp;
        }
        const elapsed = timestamp - start;

        if (previousTimeStamp !== timestamp) {
            const count = Math.min(0.1 * elapsed, 100);
            Character.style.transform = `translateY(${-count}px)`;
            if (count === 100) jumpActive = false;
        }
        if (elapsed < 2000) { 
            previousTimeStamp = timestamp;
            if (jumpActive) {
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

        if (event.code === 'Space') {
            jumpActive = true
            requestAnimationFrame(charJump)
        }

    });

    body.appendChild(Character)
    requestAnimationFrame(main)
}
