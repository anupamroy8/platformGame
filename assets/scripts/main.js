class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(next) {
    return new Vec(this.x + next.x, this.y + next.y);
  }

  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}

// console.log(new Vec(1, 2));

// player

class Player {
  constructor(position, speed) {
    this.position = position;
    this.speed = speed;
  }
  get type() {
    return "player";
  }
  static create(position) {
    return new Player(position.plus(new Vec(0, -5)), new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(0.8, 1.5);

// Lava

class Lava {
  constructor(position, speed, reset) {
    this.position = position;
    this.speed = speed;
    this.reset = reset;
  }
  get type() {
    return "lava";
  }
  static create(position, char) {
    let speed = {};
    switch (char) {
      case "=":
        speed = new Vec(2, 0);
        return new Lava(position, speed);
      case "|":
        speed = new Vec(0, 2);
        return new Lava(position, speed);
      case "v":
        speed = new Vec(0, 3);
        return new Lava(position, speed, position);
      default:
        alert("Invalid lava symbol!");
    }
  }
}

Lava.prototype.size = new Vec(1, 1);

// Coin

class Coin {
  constructor(position, basePosition, wobble) {
    this.position = position;
    this.basePosition = basePosition;
    this.wobble = wobble;
  }
  get type() {
    return "coin";
  }
  static create(position) {
    const basePosition = position.plus(new Vec(0.2, 0.1));
    const wobble = 2 * Math.PI * Math.random();
    return new Coin(basePosition, basePosition, wobble);
  }
}

Coin.prototype.size = new Vec(0.6, 0.6);

// actors

const actors = {
  "@": Player,
  o: Coin,
  "|": Lava,
  "=": Lava,
  v: Lava,
};

const background = {
  "#": "wall",
  "+": "lava",
};

//
