let isMovingLeft = false
let isMovingRight = false
export let isJumping = false
let animationIdRight = null
let animationIdLeft = null
import { level1_map, level2_map, level3_map } from "../level/levels.js"

let playGround = document.getElementById('playground')
let character = document.getElementById("character")
//let enemiesParent = document.getElementById("enemies")
//export let enemy = enemiesParent.getElementsByTagName('div')

import { tileSize } from "../level/tileMap.js"

import { currentLevel, levelUp, loseLife } from "../src/game.js"

// function for jumping
export function charJump(startY, currentTime) {
  if (isJumping) return
  //playSoundOnce("jump.ogg", 0.03)
  let lastFrameTime = 0;
  isJumping = true
  let currentJumpHeight = parseInt(character.style.bottom) || 40;

  function jumpAnimation(currentTime) {
    const currentLeft = parseInt(character.style.left) || 40;
    if (currentJumpHeight + character.offsetHeight >= startY + tileSize || checkCollision(currentLeft, character.offsetHeight + currentJumpHeight, 'up')
      || checkCollision(currentLeft + character.offsetWidth, character.offsetHeight + currentJumpHeight, 'up')) {
      isJumping = false;
      return; // Exit the animation loop
    }

    currentJumpHeight += 10;
    character.style.bottom = currentJumpHeight + 'px';
    const elapsed = currentTime - lastFrameTime;
    const delay = Math.max(1000 / 37 - elapsed, 0);
    lastFrameTime =  currentTime;
    setTimeout(() => {
      requestAnimationFrame(jumpAnimation);
    }, delay);
  }
  const elapsed = currentTime - lastFrameTime;
  const delay = Math.max(1000 / 37 - elapsed, 0);
  setTimeout(() => {
    requestAnimationFrame(jumpAnimation);
  }, delay);
}

// function for falling
export function fallAnimation() {
  let currentLeft = parseInt(character.style.left) || 40;
  let characterBottom = parseInt(character.style.bottom) || 40;

  if (checkCollision(currentLeft, characterBottom, 'down') && checkCollision(currentLeft + 35, characterBottom, 'down')) {
    if (!isMovingLeft && !isMovingRight) {
      character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"
    } else if (isMovingLeft && !isMovingRight) {
      character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_LEFT.gif)"
    } else if (!isMovingLeft && isMovingRight) {
      character.style.backgroundImage = "url(/images/characters/main/leprechaun_walking_RIGHT.gif)"
    }
    return;
  }
  characterBottom -= 10;
  character.style.bottom = characterBottom + 'px';
}

export function moveLeft(currentTime) {
  if (isMovingLeft || animationIdLeft) return;
  isMovingLeft = true;
  let lastFrameTime = 0;
  function moveAnimationLeft(currentTime) {
    let currentLeft = parseInt(character.style.left) || 40;
    let currentBottom = parseInt(character.style.bottom) || 40;

    let newX = currentLeft - 5;
    if (!checkCollision(newX, currentBottom, 'left')) {
      character.style.left = newX + "px";
    }

    if (isMovingLeft) {
      const elapsed = currentTime - lastFrameTime;
      const delay = Math.max(1000 / 37 - elapsed, 0);
      lastFrameTime = currentTime;
      setTimeout(() => {
        animationIdLeft = requestAnimationFrame(moveAnimationLeft);
      }, delay);
    } else {
      animationIdLeft = stopAnimationLeft();
    }
  }
  const elapsed = currentTime - lastFrameTime;
  const delay = Math.max(1000 / 37 - elapsed, 0);
  lastFrameTime = currentTime;
  setTimeout(() => {
    animationIdLeft = requestAnimationFrame(moveAnimationLeft);
  }, delay);
}

export function stopAnimationLeft() {
  character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"

  isMovingLeft = false;
  cancelAnimationFrame(animationIdLeft);
  animationIdLeft = null;
}


export function moveRight(currentTime) {
  if (isMovingRight || animationIdRight) return;
  isMovingRight = true;
  let lastFrameTime = 0;
  function moveAnimationRight(currentTime) {
    let currentLeft = parseInt(character.style.left) || 40;
    let currentBottom = parseInt(character.style.bottom) || 40;

    const elapsed = currentTime - lastFrameTime;
    const delay = Math.max(1000 / 37 - elapsed, 0);

    let newX = currentLeft;
    newX += 5;
    // Check if the new position has a collision
    if (!checkCollision(newX, currentBottom, 'right')) {
      character.style.left = newX + "px";
    }

    if (isMovingRight) {
      lastFrameTime = currentTime;
      setTimeout(() => {
        animationIdRight = requestAnimationFrame(moveAnimationRight);
      }, delay);
    } else {
      animationIdRight = stopAnimationRight();
    }
  }
  const elapsed = currentTime - lastFrameTime;
  const delay = Math.max(1000 / 37 - elapsed, 0);
  lastFrameTime = currentTime;
  setTimeout(() => {
    animationIdRight = requestAnimationFrame(moveAnimationRight);
  }, delay);}

export function stopAnimationRight() {
  character.style.backgroundImage = "url(/images/characters/main/leprechaun.gif)"
  isMovingRight = false;
  cancelAnimationFrame(animationIdRight);
  animationIdRight = null;
}


export function checkCollision(x, y, direction, isCharacter = true) {
  // Calculate the character's tile position
  let characterTileX = Math.floor(x / 20);
  let characterTileY = Math.floor(y / 20);

  // Calculate the adjacent tiles based on the movement direction
  let adjacentTileX = characterTileX;
  let adjacentTileY = characterTileY;

  if (direction === "left") {
    adjacentTileX = Math.floor((x) / 20);
  } else if (direction === "right") {
    adjacentTileX = Math.floor((x + character.offsetWidth) / 20);
  } else if (direction === "up") {
    adjacentTileY = Math.floor((y) / 20);
  } else if (direction === "down") {
    adjacentTileY = Math.floor((y) / 20);
  }

  // Check if the adjacent tiles are collision tiles
  let currentTile = eval(`level${currentLevel}_map`)[35 - characterTileY][characterTileX];
  let adjacentTile = eval(`level${currentLevel}_map`)[35 - adjacentTileY][adjacentTileX];

  if ((currentTile === "7" || adjacentTile === "7") && isCharacter) {
    levelUp()
    return true
  }
  if ((currentTile === "w" || adjacentTile === "w") && isCharacter) {
    loseLife()
    return true
  }

  if (currentTile === "r" || adjacentTile === "r") {
    return false
  }

  if ((currentTile !== "E" || adjacentTile !== "E") &&
    (currentTile !== "e" || adjacentTile !== "e") &&
    (currentTile !== "r" || adjacentTile !== "r")) {
    return true;
  } else {
    return false;
  }
}

export function characterEnemyCollision(enemy) {
  let enemyPos = enemy.getBoundingClientRect();
  let characterPos = character.getBoundingClientRect();
  if (
    characterPos.bottom >= enemyPos.top &&
    characterPos.bottom <= enemyPos.top + 5 &&
    enemyPos.left <= characterPos.right &&
    enemyPos.right >= characterPos.left
  ) {
    isJumping = false;
    charJump(parseInt(character.style.bottom) + character.offsetHeight * 2);
    enemy.remove();
    return;
  }
 
  if (
    characterPos.left <= enemyPos.right &&
    characterPos.right >= enemyPos.left &&
    enemyPos.top <= characterPos.bottom &&
    enemyPos.bottom >= characterPos.top
  ) {
    loseLife();
    return;
  }
}

export function moveEnemy(enemiesParent) {
  let enemies = enemiesParent.getElementsByTagName("div");
  Array.from(enemies).forEach(enemy => {
    let currentLeft = parseInt(enemy.style.left);
    let currentBottom = parseInt(enemy.style.bottom);

    let direction = parseInt(enemy.style.transform.match(/-?\d/));
    let newX = currentLeft + (3 * -direction);

    if (!checkCollision(newX, currentBottom, 'left', false) && checkCollision(newX, currentBottom - 10, 'down', false) &&
        !checkCollision(newX + enemy.offsetWidth, currentBottom, 'left', false) && checkCollision(newX + enemy.offsetWidth, currentBottom - 10, 'down', false)) {
      enemy.style.left = newX + "px";
    } else {
      enemy.style.transform = 'scaleX(' + -direction + ')';
    }

    characterEnemyCollision(enemy);
  });
}
export function stopEnemyAnimation(enemy) {
  cancelAnimationFrame(enemy.animationId);
  enemy.animationId = null;
}