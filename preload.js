function preloadImages(folder) {
    const extentions = [".jpg", ".jpeg", ".png", ".gif"]
    console.log(folder)
    fetch(folder)
        .then((response) => response.text())
        .then((html) => {
            let parser = new DOMParser()
            let doc = parser.parseFromString(html, "text/html")
            let images = doc.getElementsByTagName("a")

            for (let i = 0; i < images.length; i++) {
                let imageUrl = images[i].getAttribute("href")

                if (extentions.some((ext) => imageUrl.endsWith(ext))) {
                    const imageLink = document.createElement("link")
                    imageLink.rel = "preload"
                    imageLink.href = imageUrl
                    imageLink.as = "image"

                    document.head.appendChild(imageLink)
                }
            }
        })
}

// // preloading image elements
// preloadImages("game/images")
// preloadImages("game/images/characters/main")
// preloadImages("game/images/characters/villains")

// // preloading map elements
// preloadImages("game/level/sprites/level1")
// preloadImages("game/level/sprites/level2")
// preloadImages("game/level/sprites/level3")


// MANUAL
const imagesToPreload = [
  // root images
  "game/images/ammo.png",
  "game/images/icon.gif",
  "game/images/icon.png",
  "game/images/main_menu_gamename.png",

  // characters - main
  "game/images/characters/main/bullet.png",
  "game/images/characters/main/leprechaun.gif",
  "game/images/characters/main/leprechaun_jumping.png",
  "game/images/characters/main/leprechaun_shooting.gif",
  "game/images/characters/main/leprechaun_walking_LEFT.gif",
  "game/images/characters/main/leprechaun_walking_RIGHT.gif",

  // characters - villains
  "game/images/characters/villains/black_dog.gif",
  "game/images/characters/villains/brown_dog.gif",
  "game/images/characters/villains/dragon_25.gif",
  "game/images/characters/villains/dragon_75.gif",
  "game/images/characters/villains/dragon.gif",
  "game/images/characters/villains/fireball.gif",
  "game/images/characters/villains/werewolf_dark.gif",
  "game/images/characters/villains/werewolf.gif",
  "game/images/characters/villains/werewolf.png",

  // HUD
  "game/images/hud/gun.png",
  "game/images/hud/lives_0.png",
  "game/images/hud/lives_1.png",
  "game/images/hud/lives_2.png",
  "game/images/hud/lives_3.png",
  "game/images/hud/lives_4.png",
  "game/images/hud/settings.png",

  // src/walkingpngs
  "game/images/src/walkingpngs/leprechaun_walking1.png",
  "game/images/src/walkingpngs/leprechaun_walking2.png",
  "game/images/src/walkingpngs/leprechaun_walking3.png",

  // level1 sprites
  "game/level/sprites/level1/ .png",
  "game/level/sprites/level1/(.png",
  "game/level/sprites/level1/).png",
  "game/level/sprites/level1/-.png",
  "game/level/sprites/level1/7.png",
  "game/level/sprites/level1/A.png",
  "game/level/sprites/level1/B.png",
  "game/level/sprites/level1/F.png",
  "game/level/sprites/level1/O.png",
  "game/level/sprites/level1/p.png",
  "game/level/sprites/level1/q.png",
  "game/level/sprites/level1/T.png",
  "game/level/sprites/level1/v.png",
  "game/level/sprites/level1/w.png",
  "game/level/sprites/level1/X.png",
  "game/level/sprites/level1/¤.png",
  "game/level/sprites/level1/background.png",

  // level2 sprites
  "game/level/sprites/level2/ .png",
  "game/level/sprites/level2/-.png",
  "game/level/sprites/level2/6.png",
  "game/level/sprites/level2/7.png",
  "game/level/sprites/level2/B.png",
  "game/level/sprites/level2/F.png",
  "game/level/sprites/level2/f.png",
  "game/level/sprites/level2/v.png",
  "game/level/sprites/level2/w.png",
  "game/level/sprites/level2/x.png",
  "game/level/sprites/level2/X.png",
  "game/level/sprites/level2/¤.png",
  "game/level/sprites/level2/background.png",

  // level3 sprites
  "game/level/sprites/level3/ .png",
  "game/level/sprites/level3/B.png",
  "game/level/sprites/level3/F.png",
  "game/level/sprites/level3/T.png",
  "game/level/sprites/level3/w.png",
  "game/level/sprites/level3/x.png",
  "game/level/sprites/level3/¤.png",
  "game/level/sprites/level3/background.png",
];

// preload all images
imagesToPreload.forEach((imageUrl) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = imageUrl;
  document.head.appendChild(link);
});

console.log(`Preloading ${imagesToPreload.length} images...`);
