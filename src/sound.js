const path = "../audio/"

let audio = new Audio()

export function playSoundOnce(sound, volume = 1) {
    let player = new Audio(path + sound)
    player.volume = volume
    player.play()
}


export function PlayMusic() {

    let loop, audioFileTemp = "menu.ogg", playOnceTemp

    this.setAudio = (audioFile, playOnce) => {
        playOnceTemp = playOnce
        audioFileTemp = audioFile
        clearInterval(loop)
        audio.src = path + audioFile
        audio.preload = "auto"

        loop = setInterval(() => {
            audio.volume = 0.5
            audio.play()
        }, (audio.duration - 0.2) * 1000)

    }
    this.setVolume = (newVolume) => {
        audio.volume = newVolume
    }
    this.stop = () => {
        console.log("stop")
        clearInterval(loop)
    }
    this.resume = () => {
        this.setAudio(audioFileTemp, false)
    }
    this.unpause = () => {
        if (playOnceTemp) {
            if (!audio.paused) audio.play()
        } else this.resume()
    }
    this.pause = function () {
        audio.pause()
        clearInterval(loop)
    }
}
