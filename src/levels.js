export const level1 = () =>{
    let theGame = document.getElementById("theGame")
    let floors = document.getElementById("floors");
    floors.removeAttribute("hidden")
    floors.style.bottom  = 0 + 'px';
    theGame.appendChild(floors);
}