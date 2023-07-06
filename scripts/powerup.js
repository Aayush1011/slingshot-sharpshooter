export default class Powerup {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.position = { x: 0, y: 0 };
    this.showPowerup = false;
    this.powerupActivated = false;
    this.counter = 0;
    this.deployed = false;
    this.finishedDeploy = false;
  }

  render(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  deploy(x, y) {
    if (!this.deployed) {
      this.position.x = x;
      this.position.y = y;
      this.deployed = true;
      this.finishedDeploy = false;
    }
  }

  checkCollision(marble, currentPlayer, turnCount) {
    const distanceX = Math.abs(
      marble.position.x - (this.position.x + this.width / 2)
    );
    const distanceY = Math.abs(
      marble.position.y - (this.position.y + this.height / 2)
    );
    if (
      distanceX <= this.width / 2 + marble.radius &&
      distanceY <= this.height / 2 + marble.radius
    ) {
      currentPlayer.handlePowerup(turnCount);
    }
  }

  update(ctx, marble, turnCount, currentPlayer) {
    if (this.deployed) {
      this.counter++;
      if (this.counter / 60 === 4) {
        this.counter = 0;
        this.deployed = false;
        turnCount++;
        this.finishedDeploy = true;
      }
      this.checkCollision(marble, currentPlayer, turnCount);
      this.render(ctx, currentPlayer.name);
    }

    return [turnCount, this.deployed];
  }
}
