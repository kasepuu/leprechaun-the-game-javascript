export let isMovingLeft = false
export let isMovingRight = false
export let isJumping = false
let animationIdRight = null
let animationIdLeft = null
let flyingEnemyIntervalId = null
let flyingEnemyPosition = { left: 0, bottom: 0 };


import { levelMaps } from "../level/levels.js"
import { addAndReturnScore, pause, scoreCounter, levelCompletion } from "../src/game.js"
import { playGround, Character, frameCapping } from "./main.js"
import { tileSize, createElements } from "../level/tileMap.js"
import { currentLevel, levelUp, levelDown, loseLife, gameIsPaused, currentAmmo, addAmmo } from "../src/game.js"
import { playSoundOnce } from "./sound.js"

//let enemiesParent = document.getElementById("enemies")
//export let enemy = enemiesParent.getElementsByTagName('div')

export function setIsJumping(value) {
  isJumping = value
}
export function getIsJumping() {
  return isJumping
}

let bossHealth = 100

export function resetBossHealth() {
  document.getElementById("health-level").style.width = "100%"
  bossHealth = 100
}

let airSpeed = 10
// function for jumping
export function charJump(startY) {
  if (isJumping) return
  playSoundOnce("jump.wav")
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
    }, frameCapping);
  }
  requestAnimationFrame(jumpAnimation);
}

// function for falling
export function fallAnimation() {
  let currentLeft = parseInt(Character.style.left) || 40;
  let characterBottom = parseInt(Character.style.bottom) || 40;

  if (checkCollision(currentLeft, characterBottom, 'down') && checkCollision(currentLeft + 35, characterBottom, 'down')) {
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
      }, frameCapping);
    } else {
      animationIdLeft = stopAnimationLeft();
    }
  }
  animationIdLeft = requestAnimationFrame(moveAnimationLeft);
}

export function stopAnimationLeft() {
  if (currentLevel === 3 && currentAmmo > 0) Character.style.backgroundImage = "url(game/images/characters/main/leprechaun_shooting.gif)"
  else Character.style.backgroundImage = "url(game/images/characters/main/leprechaun.gif)"

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
      }, frameCapping);
    } else {
      animationIdRight = stopAnimationRight();
    }
  }
  animationIdRight = requestAnimationFrame(moveAnimationRight);
}

export function stopAnimationRight() {
  if (currentLevel === 3 && currentAmmo > 0) Character.style.backgroundImage = "url(game/images/characters/main/leprechaun_shooting.gif)"
  else Character.style.backgroundImage = "url(game/images/characters/main/leprechaun.gif)"
  isMovingRight = false;
  cancelAnimationFrame(animationIdRight);
  animationIdRight = null;
}

export function checkCollision(x, y, direction, isCharacter = true) {
  // Calculate the character's tile position
  let characterTileX = Math.floor(x / 20);
  let characterTileY = Math.floor(y / 20);
  if (direction === 'right') characterTileX = Math.floor((x + Character.offsetWidth) / 20)

  // Check if the character's tile is a collision tile
  let currentTile = levelMaps[currentLevel - 1][0][35 - characterTileY][characterTileX];

  //let currentTile = eval(`level${currentLevel}_map`)[35 - characterTileY][characterTileX];

  if ((currentTile === "6") && isCharacter) {
    // levelDown();
    return false; // true;
  }
  if ((currentTile === "7") && isCharacter) {
    levelUp();
    return true;
  }
  if ((currentTile === "w") && isCharacter) {
    loseLife();
    return true;
  }
  if (currentTile === "r" || currentTile === "e" || currentTile === "E" || currentTile === "u" || currentTile === "*" ||
    ((currentTile === "w") && !isCharacter)) {
    return false;
  }

  if (currentTile !== " " &&
    currentTile !== "-") {
    return true;
  } else {
    return false;
  }
}

export function characterEnemyCollision(enemy, isProjectile = false) {
  // let enemyPos = { 
  //   top: enemy.offsetTop + enemy.offsetHeight, 
  //   left: enemy.offsetLeft, 
  //   bottom: enemy.offsetTop, 
  //   right: enemy.offsetLeft + enemy.offsetWidth
  // }

  // console.log(enemy.offsetLeft, enemy.offsetTop, enemy.offsetHeight, enemy.offsetWidth)
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


    eval(`levelCompletion.level${currentLevel}`).push(enemy.className)

    enemy.id === "largeAttacker" ? playSoundOnce("explosion.wav") : playSoundOnce("explosion2.wav")
    score.innerHTML = "SCORE: " + (enemy.id === "largeAttacker" ? addAndReturnScore(200) : addAndReturnScore(100))
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



export function moveEnemy(enemiesParent, isFlying = false, userProjectile = false) {
  let enemies = enemiesParent.getElementsByTagName("div");
  if (userProjectile) createProjectile(enemiesParent, Character, true)

  Array.from(enemies).forEach(enemy => {
    if (isFlying && flyingEnemyIntervalId === null) {
      flyingEnemyIntervalId = setInterval(() => {
        if (gameIsPaused) return

        createProjectile(enemiesParent, enemy);
      }, Math.floor(Math.random() * 100) + 500)
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

  let newX = currentLeft + (enemyMovementSpeed * -direction);

  if (isFlying && Math.random() < 0.005) {
    enemy.style.transform = 'scaleX(' + -direction + ')';
  }

  if (!checkCollision(newX, currentBottom, 'left', false) && (checkCollision(newX, currentBottom - enemyMovementSpeed, 'down', false) || isFlying) &&
    !checkCollision(newX + enemy.offsetWidth, currentBottom, 'left', false) && (checkCollision(newX + enemy.offsetWidth, currentBottom - enemyMovementSpeed, 'down', false) || isFlying)) {
    enemy.style.left = newX + "px";
  } else {
    enemy.style.transform = 'scaleX(' + -direction + ')';
  }

  if (!isFlying) characterEnemyCollision(enemy);
}

export function createProjectile(flyingEnemiesParent, enemy, characterBool = false) {
  if (!document.getElementById("flyingSaucer")) return
  let projectile = document.createElement('div');

  if (!characterBool) {
    let direction = parseInt(enemy.style.transform.match(/-?\d/)) || 1
    projectile.className = 'projectile';
    projectile.id = 'projectile'
    projectile.style.left = flyingEnemyPosition.left - (55 * direction) + "px";
    projectile.style.bottom = flyingEnemyPosition.bottom + 20 + "px";
  } else {
    projectile.className = 'userProjectile';
    projectile.id = 'userProjectile';
    projectile.style.left = parseInt(enemy.style.left) + Character.offsetWidth / 2 + "px";
    projectile.style.bottom = parseInt(enemy.style.bottom) + Character.offsetHeight + "px";
  }
  flyingEnemiesParent.appendChild(projectile);
}

function moveProjectile(enemy) {
  let currentLeft = parseInt(enemy.style.left);
  let currentBottom = parseInt(enemy.style.bottom); // Set the initial position below the enemy

  if (enemy.id === 'projectile') {
    let projectileSpeed = (bossHealth <= 60 ? 16 : 8);
    currentBottom -= projectileSpeed;
    if ((checkCollision(currentLeft + enemy.offsetWidth, currentBottom, 'down', false))) {
      enemy.remove();
    }
    enemy.style.bottom = currentBottom + 'px';
    characterEnemyCollision(enemy, true);
  }
  else {
    currentBottom += 8; // character projectile speed
    if ((checkCollision(currentLeft + enemy.offsetWidth, currentBottom + enemy.offsetHeight, 'up', false)) ||
      currentBottom + enemy.offsetHeight + 8 >= playGround.offsetHeight) {
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
  const damage = 20 // damage each bullet makes
  playSoundOnce("hitHurt.wav")

  score.innerHTML = "SCORE: " + addAndReturnScore(1000)
  if (bossHealth <= 80 && bossHealth > 40) document.getElementById("flyingSaucer").style.backgroundImage = `url("game/images/characters/villains/dragon_75.gif")` 
  else if (bossHealth <= 40) document.getElementById("flyingSaucer").style.backgroundImage = `url("game/images/characters/villains/dragon_25.gif")`

  if (bossHealth <= damage) {
    playSoundOnce("explosion_dragon.wav")
    console.log("game finished, you are a very good player!")
    pause(true)
    document.getElementById("deathMessage").innerHTML = "game finished, you are a very good player!"
    document.getElementById("currentLevel").innerHTML = "Level reached: " + currentLevel
    document.getElementById("finalScore").innerHTML = "Your final score: " + scoreCounter
    document.getElementById("finalTimer").innerHTML = "Time survived: " + timer.innerHTML
    document.getElementById("death-screen").removeAttribute("hidden")

    document.getElementById("final_score").value = addAndReturnScore(0)
    document.getElementById("final_timer").value = timer.innerHTML
  }

  bossHealth -= damage //boss damage per bullet
  document.getElementById("health-level").style.width = bossHealth + "%"
}


let mushRoomInterval = false
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
      isJumping = false
      playSoundOnce("pickupCoin.wav", 0.8)
      addAmmo(3)
      addMushRoomDelay()
    }
  });
}

function addMushRoomDelay() {
  if (mushRoomInterval) {
    return;
  }
  mushRoomInterval = true

  setTimeout(() => {
    mushRoomInterval = false
    createElements()
  }, 10000)
}