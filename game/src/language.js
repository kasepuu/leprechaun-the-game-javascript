/*game translation, in progress?*/

const translations = {
    ENG: {
        startButton: "START GAME",
        creditsButton: "CREDITS",
        continueButton: "CONTINUE",
        restartButton: "RESTART",
        deathMessage: "YOU DIED, WHAT A NOOB!",
        deathLevel: "Level reached: ",
        deathScore: "SCORE: ",
        deathTimer: "TIME: "
    },
    EST: {
        startButton: "ALUSTA MÄNGU",
        creditsButton: "KREDIIDID",
        continueButton: "JÄTKA",
        restartButton: "UUS MÄNG",
        deathMessage: "SA SURID, ÕPI MÄNGIMA!",
        deathLevel: "Kõrgeim tase: ",
        deathScore: "SKOOR: ",
        deathTimer: "AEG: "
    }
}

export function updateLanguage(lang){
    console.log(lang)
    const translation = translations[lang]

    document.getElementById('startButton').textContent = translation.startButton
    document.getElementById('creditsButton').textContent = translation.creditsButton
    document.getElementById('continueButton').textContent = translation.continueButton
    document.getElementById('restartButtonPause').textContent = translation.restartButton
    document.getElementById('deathMessage').textContent = translation.deathMessage
    document.getElementById('deathLevel').textContent = translation.deathLevel
    document.getElementById('deathScore').textContent = translation.deathScore
    document.getElementById('deathTimer').textContent = translation.deathTimer
    document.getElementById('restartButtonDeath').textContent = translation.restartButton
    document.title = "jah"

}