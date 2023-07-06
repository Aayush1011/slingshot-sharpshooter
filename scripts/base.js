export default class Base {
  constructor(positionX, positionY, width, height, image) {
    this.width = width;
    this.height = height;
    this.position = { x: positionX, y: positionY };
    this.image = image;
    this.disabled = false;
  }

  render(ctx) {
    if (this.disabled) {
      ctx.save();
      ctx.globalAlpha = 0.5;
    } else {
      ctx.globalAlpha = 1;
    }
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    ctx.restore();
  }

  update(ctx, disabled) {
    this.disabled = disabled;
    this.render(ctx);
  }
}
