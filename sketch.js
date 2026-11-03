/*
Project B: Living Sketches
A hand-drawn plant that grows when you water it.
*/

// frames (scanned drawings)
let plantFrames = [];
let canFrames = [];
let dropImg;

// plant
let plantX = 400;
let plantY = 470; // bottom of the pot
let water = 0; // 0 to 4.99, the whole number part is the growth stage
let plantStage = 0;
let growPop = 0; // little bounce when the plant grows

// the top of the soil and half the pot width, measured from plantX / plantY.
// change these to match your own drawing! (press D to see them)
let soilY = -90;
let potHalfWidth = 60;

// watering can
let canX = 600;
let canY = 150;
let pouring = false;

// where the spout is, measured from the center of the tilted can.
// change these to match your own drawing! (press D to see them)
let spoutX = -66;
let spoutY = 15;

// water drops
let dropX = [];
let dropY = [];
let dropSpeed = [];

let debug = false;

async function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  for (let i = 0; i < 5; i++) {
    let img = await loadImage("assets/plant/plant" + i + ".png");
    cleanUp(img, 300);
    plantFrames.push(img);
  }
  for (let i = 0; i < 3; i++) {
    let img = await loadImage("assets/can/can" + i + ".png");
    cleanUp(img, 160);
    canFrames.push(img);
  }
  dropImg = await loadImage("assets/drop.png");
  cleanUp(dropImg, 22);
}

function draw() {
  background(245, 240, 228);
  drawGround();

  updatePlant();
  drawPlant();

  moveCan();
  updateDrops();
  drawDrops();
  drawCan();

  if (debug) {
    drawDebug();
  }
}

function keyPressed() {
  if (key == "d" || key == "D") {
    debug = !debug;
  }
  if (key == "r" || key == "R") {
    water = 0;
  }
}

// scans are big and have a white paper background:
// shrink them to the size we need, then make the white see-through
function cleanUp(img, h) {
  img.resize(0, h);
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];
    if (r > 215 && g > 215 && b > 215) {
      img.pixels[i + 3] = 0;
    }
  }
  img.updatePixels();
}

function drawGround() {
  noStroke();
  fill(225, 215, 195);
  rect(0, plantY - 10, width, height);
}

function updatePlant() {
  water = water - 0.0015; // the plant slowly dries out
  water = constrain(water, 0, 4.99);

  let newStage = floor(water);
  if (newStage > plantStage) {
    growPop = 1;
  }
  plantStage = newStage;
  growPop = growPop * 0.9;
}

function drawPlant() {
  let img = plantFrames[plantStage];
  let sway = sin(frameCount * 0.03) * 0.03;
  let s = 1 + growPop * 0.15;

  push();
  translate(plantX, plantY);
  rotate(sway);
  scale(s);
  image(img, -img.width / 2, -img.height);
  pop();
}

function moveCan() {
  canX = lerp(canX, mouseX, 0.15);
  canY = lerp(canY, mouseY, 0.15);
  pouring = mouseIsPressed;

  if (pouring && frameCount % 4 == 0) {
    makeDrop();
  }
}

function drawCan() {
  let img;
  if (pouring) {
    // flip between the two pouring drawings every 8 frames
    img = canFrames[1 + (floor(frameCount / 8) % 2)];
  } else {
    img = canFrames[0];
  }
  let bob = sin(frameCount * 0.05) * 3;

  push();
  imageMode(CENTER);
  image(img, canX, canY + bob);
  pop();
}

function makeDrop() {
  dropX.push(canX + spoutX + random(-5, 5));
  dropY.push(canY + spoutY);
  dropSpeed.push(random(1, 2));
}

function updateDrops() {
  for (let i = dropX.length - 1; i >= 0; i--) {
    dropSpeed[i] = dropSpeed[i] + 0.3;
    dropY[i] = dropY[i] + dropSpeed[i];

    if (landedInPot(i)) {
      water = water + 0.025;
      removeDrop(i);
    } else if (dropY[i] > plantY) {
      removeDrop(i);
    }
  }
}

function landedInPot(i) {
  let inside = abs(dropX[i] - plantX) < potHalfWidth;
  let reachedSoil = dropY[i] > plantY + soilY;
  return inside && reachedSoil;
}

function removeDrop(i) {
  dropX.splice(i, 1);
  dropY.splice(i, 1);
  dropSpeed.splice(i, 1);
}

function drawDrops() {
  push();
  imageMode(CENTER);
  for (let i = 0; i < dropX.length; i++) {
    image(dropImg, dropX[i], dropY[i]);
  }
  pop();
}

function drawDebug() {
  push();
  noFill();
  stroke(255, 0, 0);
  rect(plantX - potHalfWidth, plantY + soilY, potHalfWidth * 2, -soilY);
  circle(canX + spoutX, canY + spoutY, 10);
  noStroke();
  fill(255, 0, 0);
  text("water: " + nf(water, 1, 2) + "   stage: " + plantStage, 10, 20);
  pop();
}
