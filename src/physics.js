let isMovingLeft = false
let isMovingRight = false
export let isJumping = false
let animationIdRight = null
let animationIdLeft = null
let flyingEnemyIntervalId = null
let flyingEnemyPosition = { left: 0, bottom: 0 };


import { level1_map, level2_map, level3_map } from "../level/levels.js"
import { pause } from "../src/game.js"
import { playGround, Character } from "./main.js"
//let enemiesParent = document.getElementById("enemies")
//export let enemy = enemiesParent.getElementsByTagName('div')

export function setIsJumping(value) {
  isJumping = value
}
export function getIsJumping() {
  return isJumping
}

let tiles = {
  air: " ",
  airBait: "-",
  levelDesign: "r",
  nextLevel: "7",
  previousLevel: "<",
  deathElement: "w", //water,lava...
  droppedElement: "r",
  checkPoint: "*",
  // e => small enemy
  // E => large enemy
  // u => flying saucer
}

let bossHealth = 100

export function resetBossHealth(){
  bossHealth = 100
}

import { removeElements, tileSize } from "../level/tileMap.js"

import { currentLevel, levelUp, levelDown, loseLife, gameIsPaused, levelCompletion, currentAmmo, addAmmo, pausedMenu } from "../src/game.js"

export function updateMovementSpeeds(newAirSpeed, newMovementSpeed, newEnemyMovementSpeed, newProjectileSpeed) {
  airSpeed = newAirSpeed;
  movementSpeed = newMovementSpeed;
  enemyMovementSpeed = newEnemyMovementSpeed;
  projectileSpeed = newProjectileSpeed;
}

export let airSpeed = 10;
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

    currentJumpHeight += airSpeed;

    Character.style.bottom = currentJumpHeight + 'px';
    setTimeout(() => {
      requestAnimationFrame(jumpAnimation);
    }, 1000/72); // 1000 / 72
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
  characterBottom -= airSpeed;
  Character.style.bottom = characterBottom + 'px';
}

export let movementSpeed = 5;

export function moveLeft() {
  if (isMovingLeft || animationIdLeft) return;
   isMovingLeft = true;
  function moveAnimationLeft() {
    let currentLeft = parseInt(Character.style.left) || 40;
    let currentBottom = parseInt(Character.style.bottom) || 40;

    let newX = currentLeft - movementSpeed;

    if (!checkCollision(newX, currentBottom, 'left')) {
      Character.style.left = newX + "px";
    }

    if (isMovingLeft) {
      setTimeout(() => {
        animationIdLeft = requestAnimationFrame(moveAnimationLeft);
      }, 1000 / 72);
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

    newX += movementSpeed;
    // Check if the new position has a collision
    if (!checkCollision(newX, currentBottom, 'right')) {
      Character.style.left = newX + "px";
    }

    if (isMovingRight) {
      setTimeout(() => {
        animationIdRight = requestAnimationFrame(moveAnimationRight);
      }, 1000 / 72);
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
    adjacentTileX = Math.floor((x + Character.offsetWidth) / 20);
  } else if (direction === "up") {
    adjacentTileY = Math.floor((y) / 20);
  } else if (direction === "down") {
    adjacentTileY = Math.floor((y) / 20);
  }

  // Check if the adjacent tiles are collision tiles
  let currentTile = eval(`level${currentLevel}_map`)[35 - characterTileY][characterTileX];
  let adjacentTile = eval(`level${currentLevel}_map`)[35 - adjacentTileY][adjacentTileX];

  if ((currentTile === tiles.previousLevel || adjacentTile === tiles.previousLevel) && isCharacter) {
    levelDown()
    return true
  }

  if ((currentTile === tiles.nextLevel || adjacentTile === tiles.nextLevel) && isCharacter) {
    levelUp()
    return true
  }
  if ((currentTile === tiles.deathElement || adjacentTile === tiles.deathElement) && isCharacter) {
    loseLife()
    return true
  }
  if (currentTile === tiles.deathElement || adjacentTile === tiles.deathElement && !isCharacter) {
    return false
  }
  if (currentTile === tiles.droppedElement || adjacentTile === tiles.droppedElement && !isCharacter) {
    return false
  }

  if (currentTile === tiles.levelDesign || adjacentTile === tiles.levelDesign
    || currentTile === "e" || adjacentTile === "e"
    || currentTile === "E" || adjacentTile === "E"
    || currentTile === "u" || adjacentTile === "u"
    || currentTile === tiles.checkPoint || adjacentTile === tiles.checkPoint) {
    return false
  }

  if ((currentTile !== tiles.air || adjacentTile !== tiles.air) &&
    (currentTile !== tiles.airBait || adjacentTile !== tiles.airBait)) {
    return true;
  } else {
    return false;
  }
}

export function characterEnemyCollision(enemy, isProjectile = false) {
  let enemyPos = enemy.getBoundingClientRect();
  let characterPos = Character.getBoundingClientRect();
  if (
    characterPos.bottom >= enemyPos.top &&
    characterPos.bottom <= enemyPos.top + 5 &&
    enemyPos.left <= characterPos.right &&
    enemyPos.right >= characterPos.left && !isProjectile
  ) {
    isJumping = false;
    charJump(parseInt(Character.style.bottom) + Character.offsetHeight * 2);
    let score = document.getElementById("score")
    let prevScore = parseInt(score.innerHTML.replace(/[^-\d]/g, ""));// fetching the current score value

    let newScore = enemy.id === "largeAttacker" ? prevScore + 200 : prevScore + 100; // largeattacker gives more score :)

    eval(`levelCompletion.level${currentLevel}`).push(enemy.className)

    score.innerHTML = "SCORE: " + newScore
    enemy.remove();
    return;
  }

  if (
    characterPos.left <= enemyPos.right &&
    characterPos.right >= enemyPos.left &&
    enemyPos.top <= characterPos.bottom &&
    enemyPos.bottom >= characterPos.top
  ) {
    if (isProjectile) enemy.remove()
    isJumping = false
    loseLife();
    return;
  }
}

function getRandomInterval() {
  // Generate a random interval between 1 and 3 seconds (2000 - 6000 milliseconds)
  return Math.floor(Math.random() * 100) + 500;
}

export function moveEnemy(enemiesParent, isFlying = false, userProjectile = false) {
  let enemies = enemiesParent.getElementsByTagName("div");
  if (userProjectile) createProjectile(enemiesParent, Character, true)

  Array.from(enemies).forEach(enemy => {
    if (isFlying && flyingEnemyIntervalId === null) {
      flyingEnemyIntervalId = setInterval(() => {
        if (gameIsPaused) return
        createProjectile(enemiesParent, enemy);
      }, getRandomInterval())
    } else if (enemy.id === 'projectile' || enemy.id === 'userProjectile') {
      moveProjectile(enemy)
    } else {
      if (isFlying) {
        flyingEnemyPosition.left = parseInt(enemy.style.left) + enemy.offsetWidth / 2;
        flyingEnemyPosition.bottom = parseInt(enemy.style.bottom);
      }
      enemyMovement(enemy, isFlying)
    }
  })
}

export let enemyMovementSpeed = 3;

function enemyMovement(enemy, isFlying) {
  let currentLeft = parseInt(enemy.style.left);
  let currentBottom = parseInt(enemy.style.bottom);
  let direction = parseInt(enemy.style.transform.match(/-?\d/)) || 1;

  let newX = currentLeft + (enemyMovementSpeed * -direction) ;

  if (isFlying && Math.random() < 0.005) {
    enemy.style.transform = 'scaleX(' + -direction + ')';
  }

  if (!checkCollision(newX, currentBottom, 'left', false) && (checkCollision(newX, currentBottom - enemyMovementSpeed, 'down', false) || isFlying) &&
    !checkCollision(newX + enemy.offsetWidth, currentBottom, 'left', false) && (checkCollision(newX + enemy.offsetWidth, currentBottom -  enemyMovementSpeed, 'down', false) || isFlying)) {
    enemy.style.left = newX + "px";
  } else {
    enemy.style.transform = 'scaleX(' + -direction + ')';
  }

  if (!isFlying) characterEnemyCollision(enemy);
}

export function createProjectile(flyingEnemiesParent, enemy, charBool = false) {
  if (!document.getElementById("flyingSaucer")) return
  let projectile = document.createElement('div');

  if (!charBool) {
    projectile.className = 'projectile';
    projectile.id = 'projectile'
    projectile.style.left = flyingEnemyPosition.left + "px";
    projectile.style.bottom = flyingEnemyPosition.bottom + "px";
  } else {
    projectile.className = 'userProjectile';
    projectile.id = 'userProjectile';
    projectile.style.left = parseInt(enemy.style.left) + Character.offsetWidth / 2 + "px";
    projectile.style.bottom = parseInt(enemy.style.bottom) + Character.offsetHeight + "px";
  }
  flyingEnemiesParent.appendChild(projectile);
}

export let projectileSpeed = 8;

function moveProjectile(enemy) {
  let currentLeft = parseInt(enemy.style.left);
  let currentBottom = parseInt(enemy.style.bottom); // Set the initial position below the enemy

  if (enemy.id === 'projectile') {
    currentBottom -= projectileSpeed;
    if ((checkCollision(currentLeft + enemy.offsetWidth, currentBottom, 'down', false))) {
      enemy.remove();
    }
    enemy.style.bottom = currentBottom + 'px';
    characterEnemyCollision(enemy, true);
  }
  else {
    currentBottom += projectileSpeed;
    if ((checkCollision(currentLeft + enemy.offsetWidth, currentBottom + enemy.offsetHeight, 'up', false)) ||
      currentBottom + enemy.offsetHeight + projectileSpeed >= playGround.offsetHeight) {
      enemy.remove();
    }
    enemy.style.bottom = currentBottom + 'px';
    projectileEnemyCollision(enemy);
  }
}


export function projectileEnemyCollision(projectile) {
  let enemy = document.getElementById("flyingSaucer")
  let projectilePos = projectile.getBoundingClientRect();
  let enemyCharacterPos = enemy.getBoundingClientRect();

  if (
    enemyCharacterPos.left <= projectilePos.right &&
    enemyCharacterPos.right >= projectilePos.left &&
    projectilePos.top <= enemyCharacterPos.bottom &&
    projectilePos.bottom >= enemyCharacterPos.top
  ) {
    projectile.remove()
    damageEnemy();
    return;
  }
}

export function damageEnemy() {
  console.log("PIHTAS PÕHJAS!")
  if (bossHealth <= 0) {
    console.log("game finished, you are a very good player!")
    pause(true)
    document.getElementById("deathMessage").innerHTML = "game finished, you are a very good player!"
    document.getElementById("currentLevel").innerHTML = "Level reached: " + currentLevel
    document.getElementById("finalScore").innerHTML = "Your final score: " + score.innerHTML
    document.getElementById("finalTimer").innerHTML = "Time survived: " + timer.innerHTML
    document.getElementById("death-screen").removeAttribute("hidden")
  }

  bossHealth -= 20 //boss damage per bullet
  document.getElementById("health-level").style.width = bossHealth + "%"
}

export function characterMushroomCollision(mushRooms) {
  Array.from(mushRooms).forEach(mushRoom => {
    let mushRoomPos = mushRoom.getBoundingClientRect();
    let characterPos = Character.getBoundingClientRect();
  
    if (
      characterPos.left <= mushRoomPos.right &&
      characterPos.right >= mushRoomPos.left &&
      mushRoomPos.top <= characterPos.bottom &&
      mushRoomPos.bottom >= characterPos.top
    ) {
      mushRoom.remove()
      removeElements()
      isJumping = false
      addAmmo(3)
      return;
    }
  });
}