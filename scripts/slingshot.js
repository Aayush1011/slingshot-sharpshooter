export default class Slingshot {
  constructor(positionX, positionY, width, height, image, slingColor) {
    this.position = { x: positionX, y: positionY };
    this.width = width;
    this.height = height;
    this.image = image;
    this.drag = false;
    this.draggable = false;
    this.slingshotCenterX = this.position.x + this.width / 2;
    this.slingshotCenterY = this.position.y + 50;
    this.angle = 0;
    this.distance = 0;
    this.shootingTime = false;
    this.slingColor = slingColor;
    this.disabled = false;
    this.totalMarbles = 3;
    this.paused = false;
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
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.moveTo(
      this.position.x + (1.34 / 100) * window.innerWidth,
      this.position.y + (3.86 / 100) * window.innerHeight
    );
    ctx.lineTo(this.slingshotCenterX, this.slingshotCenterY);
    ctx.lineTo(
      this.position.x + this.width,
      this.position.y + (3.86 / 100) * window.innerHeight
    );
    ctx.lineWidth = (1 / 100) * window.innerWidth;
    ctx.strokeStyle = this.slingColor;
    ctx.stroke();
    ctx.restore();
  }

  pullSlingshot(canvas) {
    canvas.addEventListener("mousedown", (e) => {
      const mouseX = parseInt(e.clientX);
      const mouseY = parseInt(e.clientY);
      if (
        !this.paused &&
        mouseX <= this.position.x + this.width / 2 + 20 &&
        mouseX >= this.position.x + this.width / 2 - 20 &&
        mouseY <= this.position.y + 65 &&
        mouseY >= this.position.y + 15
      ) {
        this.draggable = true;
      }
      this.drag = false;
    });
    canvas.addEventListener("mousemove", (e) => {
      if (!this.paused && this.draggable && !this.disabled) {
        this.drag = true;
        if (
          e.clientX <= this.position.x + this.width / 2 + 200 &&
          e.clientX >= this.position.x + this.width / 2 - 200 &&
          e.clientY <= this.position.y + 200 &&
          e.clientY >= this.position.y - 150
        ) {
          this.slingshotCenterX = parseInt(e.clientX);
          this.slingshotCenterY = parseInt(e.clientY);
          return [this.slingshotCenterX, this.slingshotCenterY];
        }
      }
    });

    canvas.addEventListener("mouseup", () => {
      if (this.disabled) {
        this.drag = false;
        this.draggable = false;
        this.slingshotCenterX = this.position.x + this.width / 2;
        this.slingshotCenterY = this.position.y + 50;
      } else if (!this.paused && this.drag && !this.disabled) {
        this.shootingTime = true;
        this.drag = false;
        this.draggable = false;
        this.totalMarbles--;
        this.angle = Math.atan2(
          this.position.y + 50 - this.slingshotCenterY,
          this.position.x + this.width / 2 - this.slingshotCenterX
        );
        this.distance = Math.sqrt(
          Math.pow(this.slingshotCenterY - 25 - (this.position.y + 25), 2) +
            Math.pow(
              this.slingshotCenterX - (this.position.x + this.width / 2 - 25),
              2
            )
        );
        this.slingshotCenterX = this.position.x + this.width / 2;
        this.slingshotCenterY = this.position.y + 50;
      }
    });
  }

  setTotalMarbles(powerupTurn) {
    this.totalMarbles = powerupTurn ? 1 : 3;
  }

  update(ctx, disabled) {
    this.disabled = disabled;
    this.render(ctx);
    if (this.shootingTime) {
      this.shootingTime = false;
      return [
        true,
        this.slingshotCenterX,
        this.slingshotCenterY,
        this.angle,
        this.distance,
      ];
    }
    return [false, this.slingshotCenterX, this.slingshotCenterY];
  }
}
