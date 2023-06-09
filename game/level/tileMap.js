import { level1_map, level2_map, level3_map, levelMaps } from "./levels.js"
import { currentLevel, levelCompletion } from "../src/game.js"
import { Character } from "../src/main.js"
export const tileSize = 20

let screenHeigth = 720 - 20

// coordinates for interactable objects
let smallEnemyPositionsX = [];
let smallEnemyPositionsY = [];
let largeEnemyPositionsX = [];
let largeEnemyPositionsY = [];
let flyingSaucerPositionsX = [];
let flyingSaucerPositionsY = [];
let ammoPositionsX = [];
let ammoPositionsY = [];

export function resetPostitions() {
    smallEnemyPositionsX = [];
    smallEnemyPositionsY = [];
    largeEnemyPositionsX = [];
    largeEnemyPositionsY = [];
    flyingSaucerPositionsX = [];
    flyingSaucerPositionsY = [];
    ammoPositionsX = [];
    ammoPositionsY = [];
}

// amount of visible elements
export let currentElements = 0

export function getElements() {
    return currentElements
}
export function removeElements() {
    currentElements = 0
}
export function setElements(amount = 1) {
    currentElements = amount
}

// fetching the checkpoints, to enable going back to the previous level
export function fetchCheckpoints() {
    let checkPoints = {
        level1: [0, 0],
        level2: [0, 0],
        level3: [0, 0],
    }

    // looping all the maps
    for (let m = 1; m <= 3; m++) {
        let currentLevelMap = levelMaps[m-1]
        for (let y = 0; y < currentLevelMap.length; y++) {
            for (let x = 0; x < currentLevelMap[y].length; x++) {
                if (currentLevelMap[y][x] === "*") {
                    checkPoints[`level${m}`][0] = (x * tileSize)
                    checkPoints[`level${m}`][1] = screenHeigth - (y * tileSize)
                }
            }
        }
    }

    return checkPoints
}

// fetching the coordinates for elements & enemies
function fetchEnemyLocations(currentLevel) {
    resetPostitions()
    deleteEnemies()
    deleteElements()
    deleteFlyingEnemies()
    let currentLevelMap = levelMaps[currentLevel-1][0]
    for (let y = 0; y < currentLevelMap.length; y++) {
        for (let x = 0; x < currentLevelMap[y].length; x++) {
            if (currentLevelMap[y][x] === "e") {
                smallEnemyPositionsX.push(x * tileSize)
                smallEnemyPositionsY.push(screenHeigth - y * tileSize)
            }
            if (currentLevelMap[y][x] === "E") {
                largeEnemyPositionsX.push(x * tileSize)
                largeEnemyPositionsY.push(screenHeigth - y * tileSize)
            }
            if (currentLevelMap[y][x] === "u") {
                flyingSaucerPositionsX.push(x * tileSize)
                flyingSaucerPositionsY.push(screenHeigth - y * tileSize)
            }
            if (currentLevelMap[y][x] === "r") {
                ammoPositionsX.push(x * tileSize)
                ammoPositionsY.push(screenHeigth - y * tileSize)
            }
        }
    }
}

function createEnemies() {
    let enemiesParent = document.getElementById("enemies")
    let amountOfSmallEnemies = smallEnemyPositionsX.length
    let amountOfLargeEnemies = largeEnemyPositionsX.length

    // create small enemies (dogs)
    for (let e = 0; e < amountOfSmallEnemies; e++) {
        if (eval(`levelCompletion.level${currentLevel}`).includes(`dog-${e + 1}`)) continue

        const randomNumber = Math.floor(Math.random() * 3) + 1

        let enemy = document.createElement("div")
        enemy.id = "tinyAttacker"
        enemy.style.left = smallEnemyPositionsX[e] + "px"
        enemy.style.bottom = smallEnemyPositionsY[e] + "px"
        enemy.className = `dog-${e + 1}`
        if (Math.random() <= 0.5) enemy.style.backgroundImage = `url("game/images/characters/villains/black_dog.gif")`
        else enemy.style.backgroundImage = `url("game/images/characters/villains/brown_dog.gif")`

        enemy.style.transform = 'scaleX(1)';
        enemiesParent.appendChild(enemy);
    }

    // create larger enemies (werewolves)
    for (let E = 0; E < amountOfLargeEnemies; E++) {
        if (eval(`levelCompletion.level${currentLevel}`).includes(`werewolf-${E + 1}`)) continue

        const randomNumber = Math.floor(Math.random() * 3) + 1

        let enemy = document.createElement("div")
        enemy.id = "largeAttacker"
        enemy.style.left = largeEnemyPositionsX[E] + "px"
        enemy.style.bottom = largeEnemyPositionsY[E] + "px"
        enemy.className = `werewolf-${E + 1}`
        if (Math.random() <= 0.5) enemy.style.backgroundImage = `url("game/images/characters/villains/werewolf.gif")`
        else enemy.style.backgroundImage = `url("game/images/characters/villains/werewolf_dark.gif")`

        enemy.style.transform = 'scaleX(1)'
        enemiesParent.appendChild(enemy)
    }

    // create flying saucers (ufos -> dragons nowadays)
    let amountOfSaucers = flyingSaucerPositionsX.length
    let ufoParent = document.getElementById("flyingEnemies");
    for (let u = 0; u < amountOfSaucers; u++) {
        let enemy = document.createElement("div")
        enemy.id = "flyingSaucer"
        enemy.style.left = flyingSaucerPositionsX[u] + "px"
        enemy.style.bottom = flyingSaucerPositionsY[u] + "px"
        enemy.className = "dragon"
        enemy.style.backgroundImage = `url("game/images/characters/villains/dragon.gif")`

        ufoParent.appendChild(enemy)
    }
}

export function createElements() {
    let parent = document.getElementById("elements")
    let amountOfAmmo = ammoPositionsX.length

    let randomAmmo = Math.floor(Math.random() * (amountOfAmmo - 1));

    for (let r = 0; r < amountOfAmmo; r++) {
        if (r != randomAmmo) continue

        currentElements += 1
        let ammo = document.createElement("div");
        ammo.id = "ammo";
        ammo.style.left = ammoPositionsX[r] + "px";
        ammo.style.bottom = ammoPositionsY[r] + "px";
        ammo.className = `shroom-${r + 1}`
        ammo.style.backgroundImage = `url("game/images/ammo.png")`

        ammo.style.transform = 'scaleX(1)';
        parent.appendChild(ammo);
    }
}

export function resetCharacter(xPosValue = 40, yPosValue = 50) {
    Character.style.left = xPosValue + "px"
    Character.style.bottom = yPosValue + "px"
}

// generating/creating tile map
export function drawTiles(map, currentLevel) {
    deleteTiles()
    fetchEnemyLocations(currentLevel)
    createEnemies()
    createElements()
    let parent = document.getElementById("tileMap")
    parent.innerHTML = ""
    let mapDiv = document.createElement("div")
    mapDiv.classList.add("tile-map")
    mapDiv.id = "tileMap";
    for (let i = 0; i < map[0].length; i++) {
        let row = document.createElement("div")
        row.classList.add("tile-row")
        for (let j = 0; j < map[0][i].length; j++) {
            let elem = map[0][i][j]
            let img = document.createElement("img")
            if (elem === "e" || elem === "E" || elem === "u" || elem === "*" || elem === "r") elem = " "
            img.src = "/game/level/sprites/level" + currentLevel + "/" + elem + ".png"
            row.appendChild(img)
        }
        mapDiv.appendChild(row)
    }
    parent.appendChild(mapDiv)
}

export function deleteTiles() {
    let parent = document.getElementById("tileMap")
    parent.innerHTML = ""
}
export function deleteEnemies() {
    let enemiesParent = document.getElementById("enemies")
    enemiesParent.innerHTML = ""
}
export function deleteElements() {
    let elementsParen = document.getElementById("elements")
    elementsParen.innerHTML = ""
}

export function deleteFlyingEnemies() {
    let ufoParent = document.getElementById("flyingEnemies")
    ufoParent.innerHTML = ""
}
