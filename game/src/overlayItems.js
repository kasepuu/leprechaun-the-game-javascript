import { gameIsPaused, reduceTimerScore, scoreTimeElapsed } from "../src/game.js"
import { setFrameCapping } from "./main.js"

// this function handles the framerate, displaying it in game
export function frameRate(frameTimes) {
    const now = performance.now() // current performance

    while (frameTimes.length > 0 && frameTimes[0] <= now - 1000) {
        frameTimes.shift()
    }
    frameTimes.push(now)
    let fps = frameTimes.length > 30 ? frameTimes.length.toString() : frameTimes.length.toString()

    if (fps > 62) {
        console.log(fps, "Your refresh rate is too high, your frame rate is capped for this session!")
        setFrameCapping(1000 / 72)
    }
    document.getElementById("fps").innerHTML = "FPS: " + fps
}

// Internal timer state to ensure consistent elapsed time and once-per-second bonus reduction
let timerStartMs = Date.now()
let elapsedMs = 0
let lastWholeSecond = 0

export function resetTimer() {
    timerStartMs = Date.now()
    elapsedMs = 0
    lastWholeSecond = 0
    document.getElementById(("timer")).innerHTML = "00:00"
}

// this function handles the timer, displaying it in game
export function timerCounter() {
    if (!gameIsPaused) {
        const now = Date.now()
        elapsedMs += now - timerStartMs
        timerStartMs = now

        const totalSeconds = Math.floor(elapsedMs / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        const timerHTML = (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds

        document.getElementById(("timer")).innerHTML = timerHTML

        if (totalSeconds !== lastWholeSecond) {
            reduceTimerScore(-1)
            lastWholeSecond = totalSeconds
        }
    } else {
        // prevent time from jumping when unpausing
        timerStartMs = Date.now()
    }
}