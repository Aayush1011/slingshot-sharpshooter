export default class Bird {
  constructor(
    x,
    y,
    width,
    height,
    startingX,
    startingY,
    image,
    imageReverse,
    speed,
    getRandomNumber,
    difficulty
  ) {
    this.width = width;
    this.height = height;
    this.position = { x: x, y: y };
    this.velocity = { x: 0, y: 0 };
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.starting = { x: startingX, y: startingY };
    this.image = image;
    this.imageReverse = imageReverse;
    this.difficulty = difficulty;
    this.collisionRed = false;
    this.collisionBlue = false;
    this.getRandomNumber = getRandomNumber;
    this.nextPathDistance = {
      Easy: {
        x: () =>
          this.getRandomNumber(
            (6.72 / 100) * window.innerWidth,
            (13.44 / 100) * window.innerWidth
          ),
        y: () =>
          this.getYPosition(
            (12.85 / 100) * window.innerHeight,
            (25.707 / 100) * window.innerHeight
          ),
      },
      Medium: {
        x: () =>
          this.getXPosition(
            (6.72 / 100) * window.innerWidth,
            (10.08 / 100) * window.innerWidth,
            this.difficulty
          ),
        y: () =>
          this.getYPosition(
            (12.85 / 100) * window.innerHeight,
            (19.28 / 100) * window.innerHeight
          ),
      },
      Hard: {
        x: () =>
          this.getXPosition(
            (6.72 / 100) * window.innerWidth,
            (8.4 / 100) * window.innerWidth,
            this.difficulty
          ),
        y: () =>
          this.getYPosition(
            (12.85 / 100) * window.innerHeight,
            (16.07 / 100) * window.innerHeight
          ),
      },
    };
    this.nextPath = this.getNextPathObject();
    this.speed = speed;
    this.reverse = false;
    this.paused = false;
    this.reverseDirectionFlyingCount = 0;
  }

  render(ctx) {
    ctx.drawImage(
      this.reverse ? this.imageReverse : this.image,
      this.reverse ? this.starting.x[1] : this.starting.x[0],
      this.starting.y,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      (6.18 / 100) * window.innerWidth,
      (8.87 / 100) * window.innerHeight
    );
  }

  getXPosition(minimumDistance, maximumDistance, difficulty) {
    let x = 0;
    let randomNumberToTest = 0;
    let maximumReverseFlyingAllowed = difficulty === "Medium" ? 3 : 7;
    let distanceToAllowReverseFlying =
      difficulty === "Medium" ? window.innerWidth / 2 : window.innerWidth / 3;
    if (
      this.position.x >= distanceToAllowReverseFlying &&
      this.reverseDirectionFlyingCount <= maximumReverseFlyingAllowed
    ) {
      if (difficulty === "Medium") {
        randomNumberToTest = 0.7;
      } else if (difficulty === "Hard") {
        randomNumberToTest = 0.45;
      }
      x =
        Math.random() < randomNumberToTest
          ? this.getRandomNumber(minimumDistance, maximumDistance)
          : this.getRandomNumber(-maximumDistance, -minimumDistance);
      if (x < 0) {
        this.reverseDirectionFlyingCount++;
      }
    } else {
      x = this.getRandomNumber(minimumDistance, maximumDistance);
    }
    return x;
  }

  getYPosition(minimumDistance, maximumDistance) {
    let y = 0;
    if (this.position.y <= 30) {
      y = this.getRandomNumber(minimumDistance, maximumDistance);
      return y;
    }
    y =
      Math.random() < 0.5
        ? this.getRandomNumber(minimumDistance, maximumDistance)
        : this.getRandomNumber(-maximumDistance, -minimumDistance);
    if (y + this.position.y < 10) {
      do {
        y += 5;
      } while (y + this.position.y < 10);
    } else if (y + this.position.y > window.innerHeight / 2 - this.height) {
      do {
        y -= 5;
      } while (y + this.position.y > window.innerHeight / 2 - this.height);
    }
    return y;
  }

  getNextPathObject() {
    return {
      x: this.position.x + this.nextPathDistance[this.difficulty].x(),
      y: this.position.y + this.nextPathDistance[this.difficulty].y(),
    };
  }

  changePosition() {
    if (!this.collisionRed && !this.collisionBlue) {
      const yDistance = this.nextPath.y - this.center.y;
      const xDistance = this.nextPath.x - this.center.x;
      const angle = Math.atan2(yDistance, xDistance);

      if (xDistance < 0) {
        this.reverse = true;
      } else {
        this.reverse = false;
      }

      this.velocity.x = Math.cos(angle) * this.speed;
      this.velocity.y = Math.sin(angle) * this.speed;

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      this.center = {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2,
      };

      if (
        Math.abs(Math.round(this.center.x) - Math.round(this.nextPath.x)) <
          Math.abs(this.velocity.x) &&
        Math.abs(Math.round(this.center.y) - Math.round(this.nextPath.y)) <
          Math.abs(this.velocity.y)
      ) {
        this.nextPath = this.getNextPathObject();
      }
    } else {
      if (this.position.y < window.innerHeight) {
        this.velocity.y += 0.5;
        this.position.y += this.velocity.y;
      }
    }
  }

  resetForNewTurn() {
    this.position.x = -100;
    this.position.y = this.getRandomNumber(
      100,
      window.innerHeight / 2 - this.height
    );
    this.nextPath = this.getNextPathObject();
    this.reverseDirectionFlyingCount = 0;
    if (this.speed === 2) {
      this.speed =
        this.difficulty === "Easy"
          ? 3.5
          : this.difficulty === "Medium"
          ? 4.5
          : 5.5;
    }
  }

  setPowerUp() {
    this.speed = 2;
  }

  update(ctx, collisionRed, collisionBlue) {
    this.collisionRed = collisionRed;
    this.collisionBlue = collisionBlue;
    if (!this.paused) {
      this.changePosition();
    }
    this.render(ctx);
    return this.nextTurn;
  }
}
