let playground = document.getElementById("playground")

export const level1 = () => {
    playground.style.backgroundImage = `url("/images/levels/level1_background.png")`
    let theGame = document.getElementById("theGame")
    let floors = document.getElementById("floors")

    let bottomFloor = document.createElement("div")
    bottomFloor.style.bottom = 0 + 'px';
    bottomFloor.style.backgroundColor = "blue";
    bottomFloor.style.width = "1280px";
    bottomFloor.style.height = "20px";
    bottomFloor.style.backgroundImage = `url("/images/other/level1-floor.png"`

    let floor1 = document.createElement("div")
    floor1.style.width = "500px"
    floor1.style.bottom = "90px"
    floor1.style.left = "0px"
    floor1.style.backgroundImage = `url("/images/other/level1-floor.png"`

    let floor2 = document.createElement("div")
    floor2.style.width = "300px"
    floor2.style.bottom = "110px"
    floor2.style.left = "500px"

    let floor3 = document.createElement("div")
    floor3.style.width = "350px"
    floor3.style.bottom = "90px"
    floor3.style.left = "800px"

    let floor4 = document.createElement("div")
    floor4.style.width = "80px"
    floor4.style.bottom = "90px"
    floor4.style.left = "1200px"

    let floor5 = document.createElement("div")
    floor5.style.width = "20px"
    floor5.style.bottom = "120px"
    floor5.style.height = "500px"
    floor5.style.left = "1150px"


    let floor10 = document.createElement("div")
    floor10.style.width = "200px"
    floor10.style.bottom = "300px"
    floor10.style.left = "300px"

    floors.appendChild(bottomFloor)
    floors.appendChild(floor1)
    floors.appendChild(floor2)
    floors.appendChild(floor3)
    floors.appendChild(floor4)   
    floors.appendChild(floor5)

    floors.removeAttribute("hidden")
    theGame.appendChild(floors);
}