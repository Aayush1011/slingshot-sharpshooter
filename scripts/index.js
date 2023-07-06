import Gameloop from "./gameloop.js";

function main() {
  let assets = {};
  const assetsToLoad = [
    "catapult",
    "background",
    "base",
    "pigeon-transparent",
    "pigeon-reverse",
  ];

  let loadAssets = assetsToLoad.map((assetName) => {
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onerror = () => reject(`${assetName} couldn't be loaded`);
      img.onload = () => {
        resolve(img);
      };
      img.src = `assets/${assetName}.png`;
      assets[assetName] = img;
    });
  });

  Promise.all(loadAssets).then(() => {
    const gameloop = new Gameloop(assets);
    gameloop.startScreen();
  });
}

main();
