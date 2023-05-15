const path = "../audio/"

let audio = new Audio()

export function playSoundOnce(sound, volume = 0.5) {
    let player = new Audio(path + sound)
    player.volume = volume
    player.play()
}


export function PlayMusic() {

    let loop, audioFileTemp = "menu.ogg", playOnceTemp

    this.setAudio = (audioFile, playOnce) => {
        playOnceTemp = playOnce;
        audioFileTemp = audioFile;
        audio.src = path + audioFile;
        audio.preload = "auto";
        audio.loop = true;
      
        audio.addEventListener('timeupdate', function(){
            var buffer = 0.25
            console.log(this.currentTime, this.duration)
            if(this.currentTime >= this.duration - buffer){
                this.currentTime = 0
                this.play()
            }
        })
        audio.play();
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
