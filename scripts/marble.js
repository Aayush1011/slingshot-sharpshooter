export default class Marble {
  constructor(positionX, positionY, radius, gradientColor1, gradientColor2) {
    this.position = { x: positionX, y: positionY };
    this.radius = radius;
    this.gradientColor1 = gradientColor1;
    this.gradientColor2 = gradientColor2;
    this.gravity = 0.5;
    this.speed = 0;
    this.velocity = { x: null, y: null };
    this.slingshotSpeed = 0;
    this.slingShotAngle = 0;
    this.speedMod = 4;
    this.collision = false;
    this.disabled = false;
    this.score = 0;
    this.scoreUpdated = false;
    this.birdCollision = false;
  }

  render(ctx) {
    ctx.save();
    if (this.disabled) {
      ctx.globalAlpha = 0.5;
    } else {
      ctx.globalAlpha = 1;
    }
    const circle = new Path2D();
    const gradient = ctx.createRadialGradient(
      this.position.x,
      this.position.y,
      5,
      this.position.x,
      this.position.y,
      35
    );
    gradient.addColorStop(0, this.gradientColor1);
    gradient.addColorStop(1, this.gradientColor2);

    circle.arc(
      this.position.x,
      this.position.y - (3.21 / 100) * window.innerHeight,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = gradient;
    ctx.fill(circle);
    ctx.restore();
  }

  changePosition(slingShotState) {
    function getPosition(self) {
      return (
        self.position.x + self.radius > 0 &&
        self.position.x - self.radius < window.innerWidth &&
        self.position.y + self.radius > -500 &&
        self.position.y - self.radius < window.innerHeight
      );
    }
    const currentPosition = getPosition(this);
    if (this.shooting && currentPosition && !this.collision) {
      this.velocity.y += this.gravity;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    } else if (this.collision && currentPosition) {
      this.shooting = false;
      this.position.y += 10;
    } else {
      this.shooting = false;
      this.collision = false;
      this.position.x = slingShotState[1];
      this.position.y = slingShotState[2];
    }
  }

  setVelocity(slingShotState) {
    this.speed = slingShotState[4] / this.speedMod;
    this.velocity.x = Math.cos(slingShotState[3]) * this.speed;
    this.velocity.y = Math.sin(slingShotState[3]) * this.speed;
    this.shooting = true;
  }

  checkCollision(bird) {
    const distanceX = Math.abs(this.position.x - bird.center.x);
    const distanceY = Math.abs(this.position.y - bird.center.y);
    if (
      distanceX <= bird.width / 2 + this.radius &&
      distanceY <= bird.height / 2 + this.radius
    ) {
      this.collision = true;
      this.birdCollision = true;
    }
  }

  checkScore() {
    if (this.birdCollision && !this.scoreUpdated) {
      this.birdCollision = false;
      this.scoreUpdated = true;
      this.score++;
    }
  }

  resetSize() {
    this.radius = (1.93 / 100) * window.innerHeight;
  }

  setSize(size) {
    this.radius = size;
  }

  resetScore() {
    this.score = 0;
  }

  resetScoreUpdated() {
    this.scoreUpdated = false;
  }

  collisionWithPowerup() {
    this.collision = true;
  }

  update(ctx, slingShotState, bird, disabled) {
    this.disabled = disabled;
    if (slingShotState[0]) {
      this.setVelocity(slingShotState);
    }
    this.changePosition(slingShotState);
    if (this.shooting) {
      this.checkCollision(bird);
    }
    this.checkScore();
    this.render(ctx);
    return this.collision;
  }
}
