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
