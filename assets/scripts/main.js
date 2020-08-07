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
// Level

class Level {
  constructor(levelPlan) {
    this.rows = levelPlan[0]
      .trim()
      .split("\n")
      .map((row) => [...row]);
    this.height = this.rows.length;
    this.width = this.rows[0].length;
    this.actors = [];
    this.backgroundElms = [];
    this.finishDelay = null;
    this.status = null;

    for (let rowNum = 0; rowNum < this.rows.length; rowNum++) {
      let gridLine = [];
      for (let ColNum = 0; ColNum < this.rows[0].length; ColNum++) {
        let char = this.rows[rowNum][ColNum];
        let Actor = actors[char];
        console.log(Actor);
        if (Actor) {
          let x = ColNum;
          let y = rowNum;
          let position = new Vec(x, y);
          this.actors.push(new Actor(position));
        } else if (background[char]) {
          gridLine.push(background[char]);
        } else {
          gridLine.push("null");
        }
      }
      this.backgroundElms.push(gridLine);
    }
    for (let i = 0; i < this.actors.length; i++) {
      if (this.actors[i].type() === "player") {
        this.player = this.actors[i];
        break;
      }
    }
  }
}

Level.prototype.isFinished = function () {
  return this.status != null && this.finishDelay < 0;
};

let levelObj = new Level(levelPlan);

// State

class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find((a) => a.type == "player");
  }
}

//View

// craeteElement
function createElm(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}

// DOM Display

class DOMDisplay {
  constructor(parent, level) {
    this.dom = createElm("div", { class: "game" }, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }
  clear() {
    this.dom.remove();
  }
}

// Draw Grid

const scale = 20;

function drawGrid(level) {
  return createElm(
    "table",
    {
      class: "background",
      style: `width: ${level.width * scale}px`,
    },
    ...level.rows.map((row) =>
      createElm(
        "tr",
        { style: `height: ${scale}px` },
        ...row.map((type) => createElm("td", { class: type }))
      )
    )
  );
}

// Draw actors

function drawActors(actors) {
  return createElm(
    "div",
    { style: `width: 600px, height:500px` },
    ...actors.map((actor) => {
      let actorRect = createElm("div", { class: `actor ${actor.type}` });
      actorRect.style.width = `${actor.size.x * size}px`;
      actorRect.style.height = `${actor.size.y * size}px`;
      actorRect.style.left = `${actor.pos.x * size}px`;
      actorRect.style.top = `${actor.pos.y * size}px`;
      return actorRect;
    })
  );
}

// SyncState actors

DOMDisplay.prototype.syncState = function (state) {
  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
};
