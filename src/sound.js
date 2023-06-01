const path = "../audio/"

let audio = new Audio()

export function playSoundOnce(sound, volume = 0.3, startTime = 0) {
    let player = new Audio(path + sound)
    player.currentTime = startTime
    player.preload = "auto"
    player.volume = volume
    player.play()

}


export function PlayMusic() {

    let loop, audioFileTemp = "menu.ogg", playOnceTemp
    let loading = false;

    this.setAudio = (audioFile, playOnce) => {
        playOnceTemp = playOnce;
        audioFileTemp = audioFile;
        audio.src = path + audioFile;
        audio.preload = "auto";
        audio.loop = true;

        audio.addEventListener('timeupdate', function () {
            var buffer = 0.25
            if (this.currentTime >= this.duration - buffer) {
                this.currentTime = 0
                this.play()
            }
        })
        audio.addEventListener('canplaythrough', () => {
            loading = false;
            audio.play()
        })

        if (!loading) {
            audio.load()
            loading = true
        }
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
 