export const level1 = () =>{
    let theGame = document.getElementById("theGame")
    let floors = document.getElementById("floors")
    let floor = document.createElement("div")
    floor.id = "floor-1"
    floor.style.backgroundColor = "cyan"
    floor.style.height= "20px"
    floor.style.width = "500px"
    floor.style.position = "absolute"
    floor.style.bottom = "120"
    floor.style.left = "300"
    floor.style.borderRadius = "5px"

    floors.appendChild(floor)
    floors.style.bottom  = 0 + 'px';
    floors.removeAttribute("hidden")
    theGame.appendChild(floors);
}