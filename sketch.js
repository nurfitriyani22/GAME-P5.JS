function setup() {
  level = new Level();
  newMap = new Map(15, 15);
  newHero = new Hero(20, 20, 7, 13, "green", newMap, Math.floor(Math.random() * 20) + 10, Math.floor(Math.random() * 150) + 100);
  monsters = [];
  for (let i = 0; i < level.getCurrentLevel(); i++) {
    let randomX;
    let randomY;

    do {
      randomX = Math.floor(Math.random() * 13) + 1;
      randomY = Math.floor(Math.random() * 13) + 1;
    } while (newMap.checkCollision(randomX, randomY));

    monsters.push(new Monster(20, 20, randomX, randomY, "red", newMap, Math.floor(Math.random() * 20) + 10, Math.floor(Math.random() * 150) + 100));
  }
  newMap.init();
  newMap.putEntity(newHero, monsters);
}

function draw() {
  document.getElementById('level-value').innerHTML = level.getCurrentLevel();
  document.getElementById('score-value').innerHTML = newMap.getScore();
  background(255, 255, 255);
  //   rect(0, 0, 449, 450);
  newMap.printMap();

  if (newMap.countMonsters() === 0) {
    level.setLevel();
    monsters = [];
    for (let i = 0; i < level.getCurrentLevel(); i++) {
      let randomX;
      let randomY;

      do {
        randomX = Math.floor(Math.random() * 13) + 1;
        randomY = Math.floor(Math.random() * 13) + 1;
      } while (newMap.checkCollision(randomX, randomY));

      monsters.push(new Monster(20, 20, randomX, randomY, "red", newMap, Math.floor(Math.random() * 20) + 10, Math.floor(Math.random() * 150) + 100));
    }
    newMap.putEntity(newHero, monsters);
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    newMap.moveHero("right");
  } else if (keyCode === LEFT_ARROW) {
    newMap.moveHero("left");
  } else if (keyCode === UP_ARROW) {
    newMap.moveHero("up");
  } else if (keyCode === DOWN_ARROW) {
    newMap.moveHero("down");
  } else if (keyCode === 32) {
    newMap.startCombat();
  }
}

// newMap.printMap();
// console.log(newMap);

class Level {
  constructor(){
    this.currentLevel = 1;
    this.latestLevel = 1;
    this.maxLevel = 5;
  }

  getCurrentLevel(){
    return this.currentLevel;
  }

  setLevel(){
    if(this.currentLevel === this.maxLevel){
      window.location.replace("finished.html");
    }else{
      this.currentLevel++;
    }
  }
}

class Map {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.score = 0;
  }

  init() {
    createCanvas(this.width * 30, this.height * 30);
    this.selectRandomMap();
  }

  selectRandomMap() {
    var tempScheme = 0;

    // Load Map Template
    $.ajax({
      async: false,
      global: false,
      url: "maps/map1.json",
      dataType: "json",
      success: function (data) {
        console.log("done");
        tempScheme = data["map"];
      },
    });

    this.scheme = tempScheme;
  }

  putEntity(hero, monsters) {
    this.hero = hero;
    this.monsters = monsters;
  }

  printMap() {
    fill(0, 0, 0);

    // Draw Border
    noStroke();
    rect(0, 0, 450, 30);
    rect(0, 0, 30, 450);
    rect(0, 420, 450, 30);
    rect(420, 0, 30, 450);

    // Loop Through Map Scheme
    for (const coord in this.scheme) {
      // Get each x and y coordinate
      rect(this.scheme[coord][0] * 30, this.scheme[coord][1] * 30, 30, 30);
    }

    // Spawn Heroes
    this.hero.draw();

    // Spawn all monsters
    for (const id in this.monsters) {
      // Make monster move
      this.monsters[id].moveRandom();
      // Draw monster
      this.monsters[id].draw();
    }

    console.log(this.countMonsters());
  }

  checkCollision(x, y) {
    var collision = false;
    for (const coord in this.scheme) {
      // Check each x and y coordinate
      if (this.scheme[coord][0] === x && this.scheme[coord][1] === y) {
        collision = true;
        break;
      }
    }
    return collision;
  }

  moveHero(direction) {
    if (direction === "up") {
      this.hero.moveUp();
    } else if (direction === "down") {
      this.hero.moveDown();
    } else if (direction === "left") {
      this.hero.moveLeft();
    } else if (direction === "right") {
      this.hero.moveRight();
    }
  }

  initiateCombat() {
    var status = -1;
    for (const id in this.monsters) {
      if (this.monsters[id].getX() === this.hero.getX() && this.monsters[id].getY() === this.hero.getY()) {
        status = id;
        break;
      }
    }

    return status;
  }

  startCombat() {
    var monId = this.initiateCombat();
    if (monId !== -1) {
      if (this.monsters[monId].getPowerLevel() < this.hero.getPowerLevel()) {
        this.monsters.splice(monId, 1);
        this.score += 10;
      } else {
        console.log("You Lose!");
        window.location.replace("endgame.html");
      }
    }
  }

  countMonsters() {
    return this.monsters.length;
  }

  getScore() {
    return this.score;
  }

  sleep(miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) { }
  }
}