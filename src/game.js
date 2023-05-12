let isMovingLeft = false;
let isMovingRight = false;
let isJumping = false;
let animationId = null;
// main menu
export const main = () => {
    let body = document.getElementById("playground")
    let Character = document.getElementById("character")
  
    document.addEventListener("keydown", (event) => {
        let currentPos = Character.getBoundingClientRect()
        let bodyPos = body.getBoundingClientRect()

        if ((event.code === 'ArrowRight' || event.code === 'KeyD') && currentPos.x <= body.offsetWidth + bodyPos.x - 30) moveRight();
        if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && currentPos.x - 10 >= bodyPos.x) moveLeft();
        if (event.code === 'Space') charJump();
    });
    document.addEventListener("keyup", (event) => {
        if (event.code === 'ArrowRight' || event.code === 'KeyD' || event.code === 'ArrowLeft' || event.code === 'KeyA')  stopAnimation();
    });

    body.appendChild(Character)
    requestAnimationFrame(main)
}


function moveLeft() {
    if (isMovingLeft) return;

    isMovingLeft = true;
  
    function moveAnimation() {
      const currentLeft = parseInt(character.style.left, 10) || 0;
      const newLeft = currentLeft - 10;
      character.style.left = newLeft + 'px';
  
      if (newLeft % 10 === 0) {
        stopAnimation();
      } else {
        animationId = requestAnimationFrame(moveAnimation);
      }
    }
  
    animationId = requestAnimationFrame(moveAnimation);
  }
  
  function stopAnimation() {
    isMovingLeft = false;
    isMovingRight = false;
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  function moveRight() {
    if (isMovingRight) return;

    isMovingRight = true;
  
    function moveAnimation() {
      const currentLeft = parseInt(character.style.left, 10) || 0;
      const newLeft = currentLeft + 10;
      character.style.left = newLeft + 'px';
  
      if (newLeft % 10 === 0) {
        stopAnimation();
      } else {
        animationId = requestAnimationFrame(moveAnimation);
      }
    }
  
    animationId = requestAnimationFrame(moveAnimation);
  }

  function charJump() {
    if (isJumping) return;

    isJumping = true;
    let currentJumpHeight = 0;

    function jumpAnimation() {
        currentJumpHeight += 10;
        character.style.bottom = currentJumpHeight + 'px';

        if (currentJumpHeight >= 100) {
            fallAnimation();
        } else {
            requestAnimationFrame(jumpAnimation);
        }
    }

    function fallAnimation() {
        currentJumpHeight -= 10;
        character.style.bottom = currentJumpHeight + 'px';

        if (currentJumpHeight <= 0) {
            isJumping = false;
        } else {
            requestAnimationFrame(fallAnimation);
        }
    }
    requestAnimationFrame(jumpAnimation);
}
