import { gameIsPaused } from "../src/game.js"
// this function handles the framerate, displaying it in game

export function frameRate(frameTimes) {
    const now = performance.now() // current performance

    while (frameTimes.length > 0 && frameTimes[0] <= now - 1000) {
        frameTimes.shift()
    }
    frameTimes.push(now)
    let fps = frameTimes.length > 30 ? frameTimes.length.toString() : frameTimes.length.toString()
    document.getElementById("fps").innerHTML = "FPS: " + fps
}


// this function handles the timer, displaying it in game
export function timerCounter(startTime, timeElapsed) {
    if (!gameIsPaused) {
        timeElapsed += Date.now() - startTime
        startTime = Date.now()
        var minutes = Math.floor(timeElapsed / 60000);
        var seconds = ((timeElapsed % 60000) / 1000).toFixed(0);
        let timerHTML = (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds

        document.getElementById(("timer")).innerHTML = timerHTML
    } else {
        startTime = Date.now()
    }
}