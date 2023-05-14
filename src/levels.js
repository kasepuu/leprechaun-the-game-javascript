export const level1 = () => {
    let theGame = document.getElementById("theGame")
    let floors = document.getElementById("floors")

    let bottomFloor = document.createElement("div")
    bottomFloor.id = "bottomfloor"
    bottomFloor.style.bottom = 0 + 'px';
    bottomFloor.style.backgroundColor = "blue";
    bottomFloor.style.width = "1080px";
    bottomFloor.style.height = "20px";

    let floor1 = document.createElement("div")
    floor1.id = "floor-1"
    floor1.style.width = "500px"
    floor1.style.bottom = "120px"
    floor1.style.left = "300px"

    let floor2 = document.createElement("div")
    floor2.id = "floor-2"
    floor2.style.width = "200px"
    floor2.style.bottom = "240px"
    floor2.style.left = "100px"

    let floor3 = document.createElement("div")
    floor3.id = "floor-2"
    floor3.style.width = "200px"
    floor3.style.bottom = "360px"
    floor3.style.left = "300px"

    floors.appendChild(bottomFloor)
    floors.appendChild(floor1)
    floors.appendChild(floor2)
    floors.appendChild(floor3)
    floors.removeAttribute("hidden")
    theGame.appendChild(floors);
}