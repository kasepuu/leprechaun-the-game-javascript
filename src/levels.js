let playground = document.getElementById("playground")

function createFloor(width, bottom, left, height = 20) {
    let floor = document.createElement("div")
    floor.style.width = width + "px"
    floor.style.bottom = bottom + "px"
    floor.style.left = left + "px"
    floor.style.height = height + "px"

    return floor
}


export const level1 = () => {
    playground.style.backgroundImage = `url("/images/levels/level1_background.png")`
    let theGame = document.getElementById("theGame")
    let floors = document.getElementById("floors")

    let numberOfFloors = 12 // the amount of floors to be appended

    let floor0 = createFloor(1280, 0, 0)
    floor0.style.backgroundImage = `url("/images/other/level1-floor.png"`

    let floor1 = createFloor(500, 90, 0)
    floor1.style.backgroundImage = `url("/images/other/level1-floor.png"`

    let floor2 = createFloor(300, 110, 500)

    let floor3 = createFloor(350, 90, 800)

    let floor4 = createFloor(80, 90, 1200)
    floor4.style.backgroundColor = "red"

    // vertical floor, blockade for jumpup
    let floor5 = createFloor(20, 90, 1130, 380)

    // parkour
    let floor6 = createFloor(30, 160, 1250)

    let floor7 = createFloor(40, 250, 1240)

    let floor8 = createFloor(30, 340, 1250)

    let floor9 = createFloor(280, 540, 1000) // floor5 enemy

    let floor10 = createFloor(200, 300, 300)

    // vertical floor, blockade for jumpdown
    let floor11 = createFloor(20, 180, 1000, 380)
    let floor12 = createFloor(60, 180, 900)


    for (let f = 0; f <= numberOfFloors; f++) {
        eval(`floor${f}`).id = `floor-${f}` // setting a custom id for each floor
        floors.appendChild(eval(`floor${f}`))
    }


    floors.removeAttribute("hidden")
    theGame.appendChild(floors);
}