import { currentLevel } from "../src/game.js"
export const tileSize = 20


export function drawTiles(map, color) {
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
            img.src = "../level/sprites/level"+ currentLevel+"/" + elem + ".png"
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