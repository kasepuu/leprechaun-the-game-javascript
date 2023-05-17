let isMovingLeft = false
let isMovingRight = false
export let isJumping = false
let animationIdRight = null
let animationIdLeft = null
import { level1_map, level2_map, level3_map } from "../level/levels.js"

let Character = document.getElementById("character")

import { tileSize } from "../level/tileMap.js"

import { currentLevel, levelUp, loseLife} from "../src/game.js"

// function for jumping
export function charJump(startY) {
  if (isJumping) return
  //playSoundOnce("jump.ogg", 0.03)

  isJumping = true
  let currentJumpHeight = parseInt(Character.style.bottom) || 40;

  function jumpAnimation() {
    const currentLeft = parseInt(Character.style.left) || 40;
    if (currentJumpHeight + Character.offsetHeight >= startY + tileSize || checkCollision(currentLeft, Character.offsetHeight + currentJumpHeight, 'up')
    || checkCollision(currentLeft + Character.offsetWidth, Character.offsetHeight + currentJumpHeight, 'up')) {
      isJumping = false;
      return; // Exit the animation loop
    }

    currentJumpHeight += 10;
    Character.style.bottom = currentJumpHeight + 'px';

    requestAnimationFrame(jumpAnimation);
  }

  requestAnimationFrame(jumpAnimation);
}

// function for falling
export function fallAnimation() {
  let currentLeft = parseInt(Character.style.left) || 40;
  let characterBottom = parseInt(Character.style.bottom) || 40;

  if (checkCollision(currentLeft, characterBottom, 'down') && checkCollision(currentLeft + 35, characterBottom, 'down')) {
    if (!isMovingLeft && !isMovingRight) {
      Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"
    } else if (isMovingLeft && !isMovingRight) {
      Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_LEFT.gif)"
    } else if (!isMovingLeft && isMovingRight) {
      Character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_RIGHT.gif)"
    }
    return;
  }
  characterBottom -= 10;
  Character.style.bottom = characterBottom + 'px';
}

export function moveLeft() {
  if (isMovingLeft || animationIdLeft) return;
  isMovingLeft = true;

  function moveAnimationLeft() {
    let currentLeft = parseInt(Character.style.left) || 40;
    let currentBottom = parseInt(Character.style.bottom) || 40;

    let newX = currentLeft - 5;
    if (!checkCollision(newX, currentBottom, 'left')) {
      Character.style.left = newX + "px";
    }

    if (isMovingLeft) {
      animationIdLeft = requestAnimationFrame(moveAnimationLeft);
    } else {
      animationIdLeft = stopAnimationLeft();
    }
  }

  animationIdLeft = requestAnimationFrame(moveAnimationLeft);
}

export function stopAnimationLeft() {
  Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"

  isMovingLeft = false;
  cancelAnimationFrame(animationIdLeft);
  animationIdLeft = null;
}


export function moveRight() {
  if (isMovingRight || animationIdRight) return;
  isMovingRight = true;

  function moveAnimationRight() {
    let currentLeft = parseInt(Character.style.left) || 40;
    let currentBottom = parseInt(Character.style.bottom) || 40;

    let newX = currentLeft;
    newX += 5;
    // Check if the new position has a collision
    if (!checkCollision(newX, currentBottom, 'right')) {
      Character.style.left = newX + "px";
    }

    if (isMovingRight) {
      animationIdRight = requestAnimationFrame(moveAnimationRight);
    } else {
      animationIdRight = stopAnimationRight();
    }
  }
  animationIdRight = requestAnimationFrame(moveAnimationRight);
}

export function stopAnimationRight() {
  Character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"
  isMovingRight = false;
  cancelAnimationFrame(animationIdRight);
  animationIdRight = null;
}


export function checkCollision(x, y, direction) {
  // Calculate the character's tile position
  let characterTileX = Math.floor(x / 20);
  let characterTileY = Math.floor(y / 20);

  // Calculate the adjacent tiles based on the movement direction
  let adjacentTileX = characterTileX;
  let adjacentTileY = characterTileY;

  if (direction === "left") {
    adjacentTileX = Math.floor((x) / 20);
  } else if (direction === "right") {
    adjacentTileX = Math.floor((x + Character.offsetWidth) / 20);
  } else if (direction === "up") {
    adjacentTileY = Math.floor((y) / 20);
  } else if (direction === "down") {
    adjacentTileY = Math.floor((y) / 20);
  }

  // Check if the adjacent tiles are collision tiles
  let currentTile = eval(`level${currentLevel}_map`)[35 - characterTileY][characterTileX];
  let adjacentTile = eval(`level${currentLevel}_map`)[35 - adjacentTileY][adjacentTileX];
  
  if (currentTile === "7" || adjacentTile === "7"){
    levelUp()
    return true
  } 
  if (currentTile === "w" || adjacentTile === "w"){
    loseLife()
    return true
  }

  if ((currentTile !== "E" || adjacentTile !== "E") &&
   (currentTile !== "e" || adjacentTile !== "e")) {
    return true;
  } else {
    return false;
  }
}
