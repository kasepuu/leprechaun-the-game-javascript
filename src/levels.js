export const level1 = () =>{
    let theGame = document.getElementById("theGame")
    let floors = document.createElement("floors")
    floors.removeAttribute("hidden")

    let floor = document.createElement("div")
    floor.id = "floor-1"
    floor.style.backgroundColor = "cyan"
    floor.style.height= "20px"
    floor.style.width = "500px"
    floor.style.position = "absolute"
    floor.style.left = "50%"
    floor.style.bottom = "60px"


    floors.appendChild(floor)
    floors.style.bottom  = 0 + 'px';
    theGame.appendChild(floors);
}