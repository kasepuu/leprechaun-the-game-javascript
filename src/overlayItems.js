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

// fps limit (vsync ;=))
export function getFpsDelay() {
    const refreshRate = 240
    const maxFPS = refreshRate / 4 // Maximum FPS considering the 60 gap

    if (maxFPS >= 61) {
        return 0
    } else {
        const targetFrameTime = 1000 / 61
        const maxFrameTime = 1000 / maxFPS
        const delay = Math.max(targetFrameTime - maxFrameTime, 0) // target-max
        return delay;
    }
}

// this function handles the timer, displaying it in game
export function timer(startTime, timeElapsed) {
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