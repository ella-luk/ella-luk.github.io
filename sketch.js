let shapes = [];
let bgElements = [];
let sparkles = [];
let rainbowArcs = [];
let bubbles = [];
let grainGraphics;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255);
  background(280, 30, 95);
  noFill();

  // Grain texture
  grainGraphics = createGraphics(width, height);
  grainGraphics.loadPixels();
  for (let i = 0; i < 15000; i++) {
    let x = floor(random(width));
    let y = floor(random(height));
    let index = 4 * (x + y * width);
    grainGraphics.pixels[index] = 255;
    grainGraphics.pixels[index + 1] = 255;
    grainGraphics.pixels[index + 2] = 255;
    grainGraphics.pixels[index + 3] = random(3, 12);
  }
  grainGraphics.updatePixels();

  // Background elements
  for (let i = 0; i < 40; i++) {
    bgElements.push(new BackgroundElement());
  }

  // Foreground shapes
  for (let i = 0; i < 80; i++) {
    shapes.push(new KandinskyShape());
  }

  // Sparkles
  for (let i = 0; i < 100; i++) {
    sparkles.push(new Sparkle());
  }

  // Rainbow arcs
  for (let i = 0; i < 10; i++) {
    rainbowArcs.push(new RainbowArc());
  }

  // Bubbles
  for (let i = 0; i < 20; i++) {
    bubbles.push(new Bubble());
  }
}

function draw() {
  background(280, 30, 95, 8);

  for (let b of bgElements) b.update(), b.display();
  for (let s of sparkles) s.update(), s.display();
  for (let r of rainbowArcs) r.display();
  for (let b of bubbles) b.update(), b.display();
  for (let s of shapes) s.update(), s.display();

  image(grainGraphics, 0, 0);
}

function getWhimsicalColor(alpha = 200) {
  let hue = random([210, 240, 270, 290, 310]);
  let sat = random(30, 70);
  let bri = random(80, 100);
  return color(hue, sat, bri, alpha);
}

// --- Background Elements (same) ---
class BackgroundElement {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.tx = this.x;
    this.ty = this.y;
    this.size = random(100, 400);
    this.alpha = random(10, 25);
    this.color = getWhimsicalColor(this.alpha);
    this.type = random(['circle', 'line']);
  }

  update() {
    this.tx += random(-0.5, 0.5);
    this.ty += random(-0.5, 0.5);
    this.x = lerp(this.x, this.tx, 0.01);
    this.y = lerp(this.y, this.ty, 0.01);
  }

  display() {
    stroke(this.color);
    strokeWeight(1);
    if (this.type === 'circle') {
      noFill();
      ellipse(this.x, this.y, this.size);
    } else {
      line(this.x, this.y, this.x + this.size * 0.5, this.y + this.size * 0.3);
    }
  }
}

// --- Kandinsky Foreground Shapes (updated with mouse interactivity) ---
class KandinskyShape {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.tx = this.x;
    this.ty = this.y;
    this.size = random(30, 120);
    this.type = random(['circle', 'rect', 'triangle', 'line', 'arc', 'blob']);
    this.color = getWhimsicalColor(180);
    this.strokeColor = getWhimsicalColor(100);
    this.angle = random(TWO_PI);
    this.rotSpeed = random(-0.01, 0.01);
    this.strokeWeight = random(0.5, 2.5);
    this.glow = random() < 0.3;
  }

  update() {
    // Mouse interaction
    let dx = this.x - mouseX;
    let dy = this.y - mouseY;
    let distToMouse = sqrt(dx * dx + dy * dy);
    if (distToMouse < 150) {
      this.tx += dx * 0.001;
      this.ty += dy * 0.001;
    }

    this.tx += random(-1.2, 1.2);
    this.ty += random(-1.2, 1.2);
    this.x = lerp(this.x, this.tx, 0.015);
    this.y = lerp(this.y, this.ty, 0.015);
    this.angle += this.rotSpeed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    if (this.glow) {
      noStroke();
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 30);
      ellipse(0, 0, this.size * 1.6);
    }

    stroke(this.strokeColor);
    strokeWeight(this.strokeWeight);
    fill(this.color);

    switch (this.type) {
      case 'circle':
        ellipse(0, 0, this.size);
        break;
      case 'rect':
        rectMode(CENTER);
        rect(0, 0, this.size * 0.8, this.size * 0.6, 10);
        break;
      case 'triangle':
        triangle(
          -this.size / 2, this.size / 2,
          0, -this.size / 2,
          this.size / 2, this.size / 2
        );
        break;
      case 'line':
        strokeWeight(this.strokeWeight + 1);
        line(-this.size / 2, 0, this.size / 2, 0);
        break;
      case 'arc':
        noFill();
        strokeWeight(this.strokeWeight + 1);
        arc(0, 0, this.size, this.size, PI / 4, PI + QUARTER_PI);
        break;
      case 'blob':
        noStroke();
        fill(this.color);
        beginShape();
        for (let i = 0; i < TWO_PI; i += PI / 3) {
          let r = this.size / 2 + sin(i * 3 + frameCount * 0.03) * 15;
          let x = r * cos(i);
          let y = r * sin(i);
          curveVertex(x, y);
        }
        endShape(CLOSE);
        break;
    }

    pop();
  }
}

// --- Sparkles ---
class Sparkle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 3);
    this.speed = random(0.2, 0.6);
    this.alpha = random(100, 200);
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
      this.x = random(width);
    }
  }

  display() {
    noStroke();
    fill(0, 0, 100, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

// --- Rainbow Arcs ---
class RainbowArc {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(100, 200);
    this.alpha = random(20, 40);
  }

  display() {
    noFill();
    strokeWeight(4);
    for (let i = 0; i < 5; i++) {
      let hue = 200 + i * 20;
      stroke(hue % 360, 60, 100, this.alpha);
      arc(this.x, this.y, this.r + i * 10, this.r + i * 10, PI, TWO_PI);
    }
  }
}

// --- Bubbles ---
class Bubble {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(10, 40);
    this.speed = random(0.2, 0.7);
    this.alpha = random(30, 60);
  }

  update() {
    this.y -= this.speed;
    if (this.y < -this.r) {
      this.y = height + this.r;
      this.x = random(width);
    }
  }

  display() {
    noFill();
    stroke(220, 30, 100, this.alpha);
    strokeWeight(1);
    ellipse(this.x, this.y, this.r);
  }
}
