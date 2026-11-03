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

  plantImages[0] = await loadImage("assets/plant/plant0.png");
  plantImages[1] = await loadImage("assets/plant/plant1.png");
  plantImages[2] = await loadImage("assets/plant/plant2.png");
  plantImages[3] = await loadImage("assets/plant/plant3.png");
  plantImages[4] = await loadImage("assets/plant/plant4.png");

  canImages[0] = await loadImage("assets/can/can0.png");
  canImages[1] = await loadImage("assets/can/can1.png");
  canImages[2] = await loadImage("assets/can/can2.png");

  dropImage = await loadImage("assets/drop.png");
}

function draw() {
  background(255);

  canX = mouseX;
  canY = mouseY;

  let stage = floor(water / 100);
  if (stage > 4) {
    stage = 4;
  }
  image(plantImages[stage], plantX, plantY, 225, 300);

  if (mouseIsPressed) {
    if (frameCount % 20 < 10) {
      image(canImages[1], canX, canY, 180, 160);
    } else {
      image(canImages[2], canX, canY, 180, 160);
    }

    let spoutX = canX - 66;
    let spoutY = canY + 15;
    dropY = dropY + 5;
    if (dropY > 100) {
      dropY = 0;
    }
    image(dropImage, spoutX, spoutY + dropY, 15, 22);

    if (spoutX > plantX - 60 && spoutX < plantX + 60) {
      water = water + 1;
    }
  } else {
    image(canImages[0], canX, canY, 180, 160);
  }
}
