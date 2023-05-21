import { level1_map, level2_map, level3_map } from "./levels.js"
export const tileSize = 20

let screenHeigth = 720 - 20
let enemyTile1 = "e"
let enemyTile2 = "E"
let enemyTile3 = "u"

let smallEnemyPositionsX = [];
let smallEnemyPositionsY = [];
let largeEnemyPositionsX = [];
let largeEnemyPositionsY = [];
let flyingSaucerPositionsX = [];
let flyingSaucerPositionsY = [];

export function resetPostitions() {
    smallEnemyPositionsX = [];
    smallEnemyPositionsY = [];
    largeEnemyPositionsX = [];
    largeEnemyPositionsY = [];
    flyingSaucerPositionsX = [];
    flyingSaucerPositionsY = [];
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
    createEnemies()
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
        }
    }
}

export function createEnemies() {
    let enemiesParent = document.getElementById("enemies");
    let amountOfEnemiesS = smallEnemyPositionsX.length;
    let amountOfEnemiesL = largeEnemyPositionsX.length;

    // create small enemies (dogs)
    for (let e = 0; e < amountOfEnemiesS; e++) {
        const randomNumber = Math.floor(Math.random() * 3) + 1

        let enemy = document.createElement("div");
        enemy.id = "tinyAttacker";
        enemy.style.left = smallEnemyPositionsX[e] + "px";
        enemy.style.bottom = smallEnemyPositionsY[e] + "px";
        enemy.className = "dog"
        if (Math.random() <= 0.5)  enemy.style.backgroundImage = `url("images/characters/villains/black_dog.gif")`
        //if (e % 2 == 1) enemy.style.backgroundImage = `url("images/characters/villains/black_dog.gif")`
        else enemy.style.backgroundImage = `url("images/characters/villains/brown_dog.gif")`

        enemy.style.transform = 'scaleX(1)';
        enemiesParent.appendChild(enemy);
    }

    // create larger enemies (stormtroopers)
    for (let E = 0; E < amountOfEnemiesL; E++) {
        const randomNumber = Math.floor(Math.random() * 3) + 1

        let enemy = document.createElement("div");
        enemy.id = "largeAttacker";
        enemy.style.left = largeEnemyPositionsX[E] + "px";
        enemy.style.bottom = largeEnemyPositionsY[E] + "px";
        enemy.className = "stormtrooper"
        if (Math.random() <= 0.5) enemy.style.backgroundImage = `url("images/characters/villains/villain.gif")`
        else enemy.style.backgroundImage = `url("images/characters/villains/villain.gif")`

        enemy.style.transform = 'scaleX(1)';
        enemiesParent.appendChild(enemy);
    }

    // create flying saucers (ufos)
    let amountOfSaucers =flyingSaucerPositionsX.length 
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

export function createFlyingEnemies(level) {
    let parent = document.getElementById("flyingEnemies");
    let amountOfEnemies = 1;

    let positionX = [400]
    let positionY = [450]
    if (level === 1) {
        for (let e = 0; e < amountOfEnemies; e++) {
            let ufo = document.createElement("div");
            ufo.id = "theFlyingSaucer";
            ufo.style.left = positionX[e] + "px";
            ufo.style.bottom = positionY[e] + "px";
            parent.appendChild(ufo);
        }
    }
}


export function drawTiles(map, currentLevel) {
    deleteTiles()
    fetchEnemyLocations(currentLevel)
    createEnemies()
    createFlyingEnemies(currentLevel)
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
            if (elem === enemyTile1 || elem === enemyTile2 || elem === enemyTile3 || elem == "*") elem = " "
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
export function deleteFlyingEnemies() {
    let ufoParent = document.getElementById("flyingEnemies")
    ufoParent.innerHTML = ""
}
