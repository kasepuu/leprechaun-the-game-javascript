import { level1_map, level2_map, level3_map } from "./levels.js"
import { currentLevel, levelCompletion } from "../src/game.js"
export const tileSize = 20

let screenHeigth = 720 - 20
let enemyTile1 = "e"
let enemyTile2 = "E"
let enemyTile3 = "u"
let ammoTile = "r"

export let currentElements = 0

export function getElements(){
    return currentElements
}

export function removeElements(){
    currentElements = 0
}
export function setElements(amount = 1){
    currentElements = amount
}

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

// fetching the checkpoints, to enable going back to the previous level
export function fetchCheckpoints() {
    let checkPoints = {
        level1: [0, 0],
        level2: [0, 0],
        level3: [0, 0],
    }

    // looping all the maps
    for (let m = 1; m <= 3; m++) {
        let currentLevelMap = eval(`level${m}_map`)
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


function fetchEnemyLocations(currentLevel) {
    console.log(currentLevel, "new enemieS!")
    resetPostitions()
    deleteEnemies()
    deleteElements()
    deleteFlyingEnemies()
    //    createFlyingEnemies()
    let currentLevelMap = eval(`level${currentLevel}_map`)
    for (let y = 0; y < currentLevelMap.length; y++) {
        for (let x = 0; x < currentLevelMap[y].length; x++) {
            if (currentLevelMap[y][x] === enemyTile1) {
                smallEnemyPositionsX.push(x * tileSize)
                smallEnemyPositionsY.push(screenHeigth - y * tileSize)
            }
            if (currentLevelMap[y][x] === enemyTile2) {
                largeEnemyPositionsX.push(x * tileSize)
                largeEnemyPositionsY.push(screenHeigth - y * tileSize)
            }
            if (currentLevelMap[y][x] === enemyTile3) {
                flyingSaucerPositionsX.push(x * tileSize)
                flyingSaucerPositionsY.push(screenHeigth - y * tileSize)
            }
            if (currentLevelMap[y][x] === ammoTile) {
                ammoPositionsX.push(x * tileSize)
                ammoPositionsY.push(screenHeigth - y * tileSize)
            }
        }
    }
}

export function createEnemies() {
    let enemiesParent = document.getElementById("enemies");
    let amountOfEnemiesS = smallEnemyPositionsX.length;
    let amountOfEnemiesL = largeEnemyPositionsX.length;

    // create small enemies (dogs)
    for (let e = 0; e < amountOfEnemiesS; e++) {
        if (eval(`levelCompletion.level${currentLevel}`).includes(`dog-${e + 1}`)) {
            continue
        }
        const randomNumber = Math.floor(Math.random() * 3) + 1

        let enemy = document.createElement("div");
        enemy.id = "tinyAttacker";
        enemy.style.left = smallEnemyPositionsX[e] + "px";
        enemy.style.bottom = smallEnemyPositionsY[e] + "px";
        enemy.className = `dog-${e + 1}`
        if (Math.random() <= 0.5) enemy.style.backgroundImage = `url("images/characters/villains/black_dog.gif")`
        //if (e % 2 == 1) enemy.style.backgroundImage = `url("images/characters/villains/black_dog.gif")`
        else enemy.style.backgroundImage = `url("images/characters/villains/brown_dog.gif")`

        enemy.style.transform = 'scaleX(1)';
        enemiesParent.appendChild(enemy);
    }

    // create larger enemies (stormtroopers)
    for (let E = 0; E < amountOfEnemiesL; E++) {
        if (eval(`levelCompletion.level${currentLevel}`).includes(`stormtrooper-${E + 1}`)) {
            continue
        }
        const randomNumber = Math.floor(Math.random() * 3) + 1

        let enemy = document.createElement("div");
        enemy.id = "largeAttacker";
        enemy.style.left = largeEnemyPositionsX[E] + "px";
        enemy.style.bottom = largeEnemyPositionsY[E] + "px";
        enemy.className = `stormtrooper-${E + 1}`
        if (Math.random() <= 0.5) enemy.style.backgroundImage = `url("images/characters/villains/villain.gif")`
        else enemy.style.backgroundImage = `url("images/characters/villains/villain.gif")`

        enemy.style.transform = 'scaleX(1)';
        enemiesParent.appendChild(enemy);
    }

    // create flying saucers (ufos)
    let amountOfSaucers = flyingSaucerPositionsX.length
    let ufoParent = document.getElementById("flyingEnemies");
    for (let u = 0; u < amountOfSaucers; u++) {
        let enemy = document.createElement("div")
        enemy.id = "flyingSaucer"
        enemy.style.left = flyingSaucerPositionsX[u] + "px"
        enemy.style.bottom = flyingSaucerPositionsY[u] + "px"
        enemy.className = "saucer"

        ufoParent.appendChild(enemy)
    }
}

export function createElements(){
    let parent = document.getElementById("elements")
    let amountOfAmmo = ammoPositionsX.length

    let randomAmmo = Math.floor(Math.random() * (amountOfAmmo - 1));

    console.log(randomAmmo)
    for (let r = 0; r < amountOfAmmo; r++){
        if (r != randomAmmo) continue
    
        currentElements += 1
        let ammo = document.createElement("div");
        ammo.id = "ammo";
        ammo.style.left = ammoPositionsX[r] + "px";
        ammo.style.bottom = ammoPositionsY[r] + "px";
        ammo.className = `shroom-${r + 1}`
        ammo.style.backgroundImage = `url("images/ammo.png")`

        ammo.style.transform = 'scaleX(1)';
        parent.appendChild(ammo);
    }
}


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
    for (let i = 0; i < map.length; i++) {
        let row = document.createElement("div")
        row.classList.add("tile-row")
        for (let j = 0; j < map[i].length; j++) {
            let elem = map[i][j]
            let img = document.createElement("img")
            if (elem === enemyTile1 || elem === enemyTile2 || elem === enemyTile3 || elem === "*" || elem === "r") elem = " "
            img.src = "../level/sprites/level" + currentLevel + "/" + elem + ".png"
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
export function deleteElements(){
    let elementsParen = document.getElementById("elements")
    elementsParen.innerHTML = ""
}

export function deleteFlyingEnemies() {
    let ufoParent = document.getElementById("flyingEnemies")
    ufoParent.innerHTML = ""
}
