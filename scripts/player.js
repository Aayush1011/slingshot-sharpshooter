import Base from "./base";
import Marble from "./marble";
import Slingshot from "./slingshot";

export default class Player {
  constructor(
    slingshotX,
    slingshotY,
    baseX,
    baseY,
    slingshotImage,
    baseImage,
    color,
    marbleColor1,
    marbleColor2,
    canvas
  ) {
    this.slingshotX = slingshotX;
    this.slingshotY = slingshotY;
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseImage = baseImage;
    this.slingshotImage = slingshotImage;
    this.name = color;
    this.marbleColor1 = marbleColor1;
    this.marbleColor2 = marbleColor2;
    this.canvas = canvas;
    this.base = null;
    this.slingshot = null;
    this.marble = null;
    this.slingShotState = null;
    this.collision = false;
    this.disabled = false;
    this.powerupTurn = null;
    this.powerupType = "";
  }

  init() {
    this.base = new Base(
      this.baseX,
      this.baseY,
      (8.6 / 100) * window.innerWidth,
      (16.45 / 100) * window.innerHeight,
      this.baseImage
    );
    this.slingshot = new Slingshot(
      this.slingshotX,
      this.slingshotY,
      (6.72 / 100) * window.innerWidth,
      (19.28 / 100) * window.innerHeight,
      this.slingshotImage,
      this.name
    );
    this.slingshot.pullSlingshot(this.canvas);
    this.marble = new Marble(
      this.slingshot.position.x + this.slingshot.width / 2,
      this.slingshot.position.y - (3.21 / 100) * window.innerHeight,
      (1.93 / 100) * window.innerHeight,
      this.marbleColor1,
      this.marbleColor2
    );
  }

  removePowerUp() {
    this.marble.resetSize();
  }

  setPowerUp() {
    this.marble.setSize((5.14 / 100) * window.innerHeight);
  }

  disable() {
    this.disabled = true;
  }

  resetScore() {
    this.marble.resetScore();
  }

  enableTurn(powerupTurn) {
    this.slingshot.setTotalMarbles(powerupTurn);
    this.marble.resetScoreUpdated();
    this.disabled = false;
  }

  handlePowerup(turnCount) {
    this.marble.collisionWithPowerup();
    this.powerupType = Math.random() < 0.5 ? "pigeon" : "marble";
    this.powerupTurn = turnCount + 2;
  }

  update(ctx, bird) {
    this.base.update(ctx, this.disabled);
    this.slingShotState = this.slingshot.update(ctx, this.disabled);
    this.collision = this.marble.update(
      ctx,
      this.slingShotState,
      bird,
      this.disabled
    );
    return this.collision;
  }
}
