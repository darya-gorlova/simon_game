class Model {
  //private fields
  #computerSequence = [];
  #humanSequence = [];
  #level = 1;

  //getters and setters
  get computerSequence() {
    return this.#computerSequence;
  }
  get humanSequence() {
    return this.#humanSequence;
  }
  get level() {
    return this.#level;
  }
  set computerSequence(value) {
    this.#computerSequence = value;
  }
  set humanSequence(value) {
    this.#humanSequence = value;
  }
  set level(value) {
    this.#level = value;
  }

  getRandomTile() {
    const tiles = ["red", "green", "blue", "yellow"];
    const random = tiles[Math.floor(Math.random() * tiles.length)];
    return random;
  }

  saveComputerMove() {
    const tile = this.getRandomTile();
    this.#computerSequence.push(tile);
    console.log("computer");
    console.log(this.#computerSequence);
  }

  //return index of saved tile
  saveHumanMove(tile) {
    const length = this.#humanSequence.push(tile);
    console.log("human");
    console.log(this.#humanSequence);
    return length - 1;
  }

  wrongTile(index) {
    while (this.#computerSequence[index] !== this.#humanSequence[index]) {
      return true;
    }
  }
  humanSequenceHasCorrectLength() {
    while (this.#computerSequence.length === this.#humanSequence.length) {
      return true;
    }
  }
}

class UI {
  //private fields
  #button = document.querySelector(".button");
  #tile_container = document.querySelector(".tile-container");
  #tiles = [...this.#tile_container.children];
  #message = document.querySelector(".message");

  async pressTile(color) {
    const tile = document.querySelector(`[data-tile='${color}']`);
    const sound = document.querySelector(`[data-sound='${color}']`);
    tile.classList.add("activated");
    sound.play();
    return new Promise((resolve) => {
      setTimeout(() => {
        tile.classList.remove("activated");
        resolve(color + " tile bound successfully");
      }, 200);
    });
  }
  activateTiles() {
    this.#tiles.forEach((tile) => {
      tile.style.pointerEvents = "auto";
    });
  }
  deactivateTiles() {
    this.#tiles.forEach((tile) => {
      tile.style.pointerEvents = "none";
    });
  }
  activateStartBtn() {
    this.#button.style.display = "block";
  }
  deactivateStartBtn() {
    this.#button.style.display = "none";
  }
  displayMessage(text) {
    this.#message.textContent = text;
  }
  //In an event, this refers to the element that received the event. Thats why callback was bound with correct this (see 185)
  registerListenerOnStartBtn(startGame) {
    this.#button.addEventListener("click", startGame);
  }
  registerListenerOnTiles(humanPlays) {
    this.#tile_container.addEventListener("click", (event) => {
      const { tile } = event.target.dataset;
      if (tile) humanPlays(tile);
    });
  }
}

class Controller {
  //private fields
  #model;
  #ui;

  constructor(mod, view) {
    this.#model = mod;
    this.#ui = view;
  }

  #startGame() {
    this.#ui.deactivateStartBtn();
    this.#ui.deactivateTiles();
    controller.#computerPlays();
  }

  #resetGame(text) {
    this.#model.computerSequence = [];
    this.#model.humanSequence = [];
    this.#model.level = 0;
    controller.#updateMessage(text);
    this.#ui.activateStartBtn();
  }

  async #computerPlays() {
    await controller.#updateMessage("Computer plays...");
    this.#model.saveComputerMove();
    for (let i = 0; i < this.#model.level; i++) {
      await this.#ui.pressTile(this.#model.computerSequence[i]);
      await controller.#delay(700);
    }
    controller.#updateMessage("Your Turn...");
    this.#ui.activateTiles();
  }

  #humanPlays(tile) {
    const atIndex = this.#model.saveHumanMove(tile);
    this.#ui.pressTile(tile);
    controller.#evaluateMove(atIndex);
  }

  #evaluateMove(atIndex) {
    if (this.#model.wrongTile(atIndex)) {
      controller.#resetGame("You pressed wrong tile, game is over");
      this.#ui.deactivateTiles();
      return;
    }
    if (this.#model.humanSequenceHasCorrectLength()) {
      controller.#moveToNextLevel(
        "Congratulations! You passed to the next level: "
      );
      this.#ui.deactivateTiles();
      return;
    }
  }

  async #moveToNextLevel(text) {
    this.#model.level = ++this.#model.level;
    this.#model.humanSequence = [];
    await controller.#updateMessage(text + this.#model.level);
    await controller.#delay(2000);
    controller.#startGame();
  }

  async #updateMessage(message) {
    this.#ui.displayMessage(message);
    await controller.#delay(1000);
  }

  async #delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  registerListeners() {
    //pass with callbacks correct reference to this
    this.#ui.registerListenerOnStartBtn(controller.#startGame.bind(this));
    this.#ui.registerListenerOnTiles(controller.#humanPlays.bind(this));
  }
}

const mod = new Model();
const view = new UI();

//dependency injection
const controller = new Controller(mod, view);
controller.registerListeners();
