let shapes = [];
let bgElements = [];
let grainGraphics;

function setup() {
  createCanvas(900, 900);
  colorMode(HSB, 360, 100, 100, 255);
  background(35, 20, 95);
  noFill();

  // Grain texture
  grainGraphics = createGraphics(width, height);
  grainGraphics.loadPixels();
  for (let i = 0; i < 10000; i++) {
    let x = floor(random(width));
    let y = floor(random(height));
    let index = 4 * (x + y * width);
    grainGraphics.pixels[index] = 255;
    grainGraphics.pixels[index + 1] = 255;
    grainGraphics.pixels[index + 2] = 255;
    grainGraphics.pixels[index + 3] = random(5, 15);
  }
  grainGraphics.updatePixels();

  // Background elements
  for (let i = 0; i < 20; i++) {
    bgElements.push(new BackgroundElement());
  }

  // Foreground shapes
  for (let i = 0; i < 50; i++) {
    shapes.push(new KandinskyShape());
  }
}

function draw() {
  background(35, 20, 95, 8); // soft fade for trailing effect

  for (let b of bgElements) {
    b.update();
    b.display();
  }

  for (let s of shapes) {
    s.update();
    s.display();
  }

  // Apply grain overlay
  image(grainGraphics, 0, 0);
}

class BackgroundElement {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.tx = this.x;
    this.ty = this.y;
    this.size = random(100, 300);
    this.alpha = random(10, 30);
    this.color = color(random(360), 30, 100, this.alpha);
    this.type = random(['circle', 'line']);
  }

  update() {
    // Slowly drift toward a target
    this.tx += random(-1, 1);
    this.ty += random(-1, 1);
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

class KandinskyShape {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.tx = this.x;
    this.ty = this.y;
    this.size = random(40, 130);
    this.type = random(['circle', 'rect', 'triangle', 'line', 'arc', 'blob']);
    this.color = color(random(360), 80, random(60, 100), 180);
    this.strokeColor = color(random(360), 50, 30, 180);
    this.angle = random(TWO_PI);
    this.rotSpeed = random(-0.01, 0.01);
    this.strokeWeight = random(1, 3);
  }

  update() {
    this.tx += random(-1.5, 1.5);
    this.ty += random(-1.5, 1.5);
    this.x = lerp(this.x, this.tx, 0.02);
    this.y = lerp(this.y, this.ty, 0.02);
    this.angle += this.rotSpeed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    stroke(this.strokeColor);
    strokeWeight(this.strokeWeight);
    fill(this.color);

    switch (this.type) {
      case 'circle':
        ellipse(0, 0, this.size);
        break;
      case 'rect':
        rectMode(CENTER);
        rect(0, 0, this.size * 0.8, this.size * 0.6);
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
        arc(0, 0, this.size, this.size, 0, PI + QUARTER_PI);
        break;
      case 'blob':
        noStroke();
        fill(this.color);
        beginShape();
        for (let i = 0; i < TWO_PI; i += PI / 3) {
          let r = this.size / 2 + sin(i * 3 + frameCount * 0.02) * 15;
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
