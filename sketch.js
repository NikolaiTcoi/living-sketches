/*
Living Sketches: Thirsty Sprout
Move the watering can with the mouse.
Hold the mouse button over the pot to water the plant and make it grow.
*/

let plantImages = [];
let canImages = [];
let dropImage;

let plantX = 400;
let plantY = 320;

let canX = 0;
let canY = 0;

let water = 0;
let dropY = 0;

async function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  imageMode(CENTER);

  // the plant: 5 drawings, from seed to flower
  plantImages[0] = await loadImage("assets/plant/plant0.png");
  plantImages[1] = await loadImage("assets/plant/plant1.png");
  plantImages[2] = await loadImage("assets/plant/plant2.png");
  plantImages[3] = await loadImage("assets/plant/plant3.png");
  plantImages[4] = await loadImage("assets/plant/plant4.png");

  // the watering can: 1 standing drawing, 2 pouring drawings
  canImages[0] = await loadImage("assets/can/can0.png");
  canImages[1] = await loadImage("assets/can/can1.png");
  canImages[2] = await loadImage("assets/can/can2.png");

  dropImage = await loadImage("assets/drop.png");
}

function draw() {
  background(255);

  // the can follows the mouse
  canX = mouseX;
  canY = mouseY;

  // more water = bigger plant (every 100 water is one new drawing)
  let stage = floor(water / 100);
  if (stage > 4) {
    stage = 4;
  }
  image(plantImages[stage], plantX, plantY, 225, 300);

  if (mouseIsPressed) {
    // pouring: switch between the two pouring drawings
    if (frameCount % 20 < 10) {
      image(canImages[1], canX, canY, 180, 160);
    } else {
      image(canImages[2], canX, canY, 180, 160);
    }

    // a drop falls from the spout, then starts again
    let spoutX = canX - 66;
    let spoutY = canY + 15;
    dropY = dropY + 5;
    if (dropY > 100) {
      dropY = 0;
    }
    image(dropImage, spoutX, spoutY + dropY, 15, 22);

    // the plant only gets water if the spout is above the pot
    if (spoutX > plantX - 60 && spoutX < plantX + 60) {
      water = water + 1;
    }
  } else {
    // not pouring: the can stands up straight
    image(canImages[0], canX, canY, 180, 160);
  }
}
