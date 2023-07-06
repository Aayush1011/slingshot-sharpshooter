import Background from "./background.js";
import Bird from "./bird.js";
import Canvas from "./canvas.js";
import Overlay from "./overlay.js";
import Player from "./player.js";
import Powerup from "./powerup.js";

export default class Gameloop {
  constructor(assets) {
    this.assets = assets;
    this.canvas = null;
    this.ctx = null;
    this.background = null;
    this.updateLoop = null;
    this.playerRed = null;
    this.playerBlue = null;
    this.overlay = null;
    this.powerup = null;
    this.collisionRed = false;
    this.collisionBlue = false;
    this.turnCount = 0;
    this.players = [];
    this.firstEnteredScreen = false;
    this.outsideScreen = true;
    this.currentPlayer = null;
    this.gameStarted = false;
    this.gameInitialized = false;
    this.difficulty = null;
    this.paused = false;
    this.powerupArray = [];
    this.powerupDeployed = false;
    this.nextTurn = true;
  }

  init() {
    this.playerRed = new Player(
      this.canvas.width * (1 / 2 - 19.35 / 100),
      this.canvas.height * (1 - 35.35 / 100),
      this.canvas.width * (1 / 2 - 19.35 / 100),
      this.canvas.height * (1 - 16.45 / 100),
      this.assets["catapult"],
      this.assets["base"],
      "red",
      "#ff313f",
      "#e65a64",
      this.canvas.canvas
    );
    this.playerBlue = new Player(
      this.canvas.width * (1 / 2 + 10.08 / 100),
      this.canvas.height * (1 - 35.35 / 100),
      this.canvas.width * (1 / 2 + 10.08 / 100),
      this.canvas.height * (1 - 16.45 / 100),
      this.assets["catapult"],
      this.assets["base"],
      "blue",
      "#3f31ff",
      "#645ae6",
      this.canvas.canvas
    );
    this.playerRed.init();
    this.playerBlue.init();
    let powerup = null;
    for (let i = 0; i < 2; i++) {
      do {
        powerup = this.getRandomNumber(2, 6);
      } while (
        this.powerupArray.includes(powerup) ||
        this.powerupArray.includes(powerup + 1) ||
        this.powerupArray.includes(powerup - 1)
      );
      this.powerupArray.push(powerup);
    }
    const speed =
      this.difficulty === "Easy"
        ? 3.5
        : this.difficulty === "Medium"
        ? 4.5
        : 5.5;
    this.bird = new Bird(
      -(6.72 / 100) * this.canvas.width,
      this.getRandomNumber(
        (12.85 / 100) * this.canvas.height,
        this.canvas.height * (1 / 2 + 6.427 / 100)
      ),
      92,
      69,
      [20, 277],
      15,
      this.assets["pigeon-transparent"],
      this.assets["pigeon-reverse"],
      speed,
      this.getRandomNumber,
      this.difficulty
    );
    this.powerup = new Powerup(this.canvas.width / 24, this.canvas.width / 24);
  }

  getRandomNumber(minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue - minValue) + minValue);
  }

  checkIfPowerupTurn() {
    return this.powerupArray.includes(Math.ceil((this.turnCount + 1) / 2));
  }

  newGame() {
    this.turnCount = 0;
    this.players = [];
    this.powerupArray = [];
    this.firstEnteredScreen = false;
    this.outsideScreen = true;
    this.init();
    this.players[0] = Math.random() < 0.5 ? this.playerRed : this.playerBlue;
    this.players[1] =
      this.players[0] === this.playerRed ? this.playerBlue : this.playerRed;
    this.players[1].disable();
    this.players.forEach((player) => player.resetScore());
  }

  gameEnd() {
    this.overlay.endgame();
    this.gameStarted = false;
    this.gameInitialized = false;
  }

  turn() {
    if (this.nextTurn && !this.powerupDeployed) {
      this.turnCount++;
    }
    this.nextTurn = true;
    if (this.turnCount === 14) {
      this.gameEnd();
      return;
    }
    console.log(this.turnCount, this.powerupArray);
    if (this.turnCount % 2 === 0) {
      this.players[0].enableTurn(this.checkIfPowerupTurn());
      this.players[1].disable();
    } else {
      this.players[1].enableTurn(this.checkIfPowerupTurn());
      this.players[0].disable();
    }
    if (!this.checkIfPowerupTurn()) {
      this.bird.resetForNewTurn();
    }
  }

  checkPowerup() {
    this.currentPlayer = this.players[this.turnCount % 2];
    if (this.checkIfPowerupTurn()) {
      this.powerupDeployed = true;
      this.nextTurn = false;
      this.powerup.deploy(
        this.getRandomNumber(0, this.canvas.width - this.powerup.width),
        this.getRandomNumber(0, this.canvas.height / 2)
      );
    }
  }

  checkInsideScreen() {
    if (
      this.bird.position.x + this.bird.width > 0 &&
      this.bird.position.x < this.canvas.width &&
      this.bird.position.y + this.bird.height > 0 &&
      this.bird.position.y < this.canvas.height
    ) {
      this.firstEnteredScreen = true;
      this.outsideScreen = false;
    } else {
      this.outsideScreen = true;
    }
  }

  checkOutsideScreen() {
    if (this.firstEnteredScreen && this.outsideScreen) {
      this.firstEnteredScreen = false;
      this.currentPlayer.removePowerUp();
      this.turn();
    }
  }

  checkMarblesRemaining() {
    if (this.currentPlayer.slingshot.totalMarbles === 0) {
      this.currentPlayer.disabled = true;
    }
  }

  startScreen() {
    this.canvas = new Canvas();
    this.ctx = this.canvas.ctx;
    this.background = new Background(
      this.canvas.width,
      this.canvas.height,
      this.assets["background"]
    );
    this.overlay = new Overlay(this.canvas.width, this.canvas.height);
    this.overlay.addClickHandler(this.canvas.canvas);
    this.update();
  }

  powerupHandler(ctx) {
    this.checkPowerup();
    [this.turnCount, this.powerupDeployed] = this.powerup.update(
      ctx,
      this.currentPlayer.marble,
      this.turnCount,
      this.currentPlayer
    );
    if (this.currentPlayer.powerupTurn === this.turnCount) {
      if (this.currentPlayer.powerupType === "pigeon") {
        this.bird.setPowerUp();
      } else if (this.currentPlayer.powerupType === "marble") {
        this.currentPlayer.setPowerUp();
      }
    }
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.background.update(this.ctx);
    if (!this.gameStarted && !this.paused) {
      this.gameInitialized = false;
    }
    if (this.gameStarted && !this.gameInitialized) {
      this.gameInitialized = true;
      this.newGame();
    }
    if (this.gameStarted) {
      this.powerupHandler(this.ctx);
      this.collisionRed = this.playerRed.update(this.ctx, this.bird);
      this.collisionBlue = this.playerBlue.update(this.ctx, this.bird);

      if (!this.powerupDeployed && !this.nextTurn) {
        this.turn();
      }
      if (!this.powerupDeployed) {
        this.bird.update(this.ctx, this.collisionRed, this.collisionBlue);
        this.checkInsideScreen();
        this.checkOutsideScreen();
      }
      this.checkMarblesRemaining();
      this.bird.paused =
        this.playerRed.slingshot.paused =
        this.playerBlue.slingshot.paused =
          this.paused;
    }
    [this.gameStarted, this.difficulty, this.paused] = this.overlay.update(
      this.ctx,
      this.gameInitialized,
      this.assets["pigeon-transparent"],
      this.turnCount,
      this.players,
      this.currentPlayer
    );
    this.updateLoop = window.requestAnimationFrame(this.update.bind(this));
  }
}
