export default class Background {
  constructor(width, height, image) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.image = image;
  }

  render(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    this.render(ctx);
  }
}
