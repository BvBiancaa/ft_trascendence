import Phaser from "phaser";
import CustomButton from "./CustomButton";
import { Socket } from "socket.io-client";
import { useOnlineSocketStore } from "../../utils/onlineSocketStore";
let TeamChoice;
export { TeamChoice };
let score;
export { score };
let speed;
export { speed };
let Gamemode;
let player: number;
let randomStart: number;
let time: number;
export { player };
export { randomStart };
export { time };
let roomName: string;
let socket: Socket;
export { socket };
export { roomName };
export default class CustomButtonScene extends Phaser.Scene {
  constructor() {
    super("custom-button");
  }

  preload() {
    this.load.image("black", "img/black.jpg");
    this.load.image("black2", "img/black2.png");
    this.load.image("red", "img/red.jpeg");
    this.load.image("red2", "img/red2.png");
    this.load.image("01", "img/menu_button.png");
    this.load.image("02", "img/menu_button_press.png");
    this.load.image("options", "img/options.png");
    this.load.image("options2", "img/options_pressed.png");
    this.load.image("on", "img/on.png");
    this.load.image("on2", "img/on2.png");
    this.load.image("menu", "img/menu.png");
    this.load.image("rounds", "img/rounds.png");
    this.load.image("velocity", "img/speed.png");
    this.load.image("gm", "img/gm.png");
    this.load.image("gm2", "img/gm2.png");
    this.load.image("gmb", "img/gmb.png");
    this.load.image("gm2b", "img/gm2b.png");
    this.load.image("class", "img/class.png");
    this.load.image("class2", "img/class2.png");
    this.load.image("rdy", "img/menu_button_ready.png");

    this.load.audio("selected", "sounds/selected.mp3");
    this.load.audio("wrong", "sounds/wrong.mp3");
    this.load.audio("intro1", "sounds/arcade.mp3");
    this.load.audio("locksel", "sounds/locksel.mp3");

    this.load.image("score1", "img/score.png");
    this.load.image("score2", "img/score2.png");
    this.load.image("score3", "img/score3.png");
    this.load.image("score1b", "img/scorebl.png");
    this.load.image("score2b", "img/score2bl.png");
    this.load.image("score3b", "img/score3bl.png");

    this.load.image("molt", "img/velocity.png");
    this.load.image("molt1", "img/velocity1.png");
    this.load.image("molt2", "img/velocity2.png");
    this.load.image("moltb", "img/velocityb.png");
    this.load.image("molt1b", "img/velocity1b.png");
    this.load.image("molt2b", "img/velocity2b.png");
  }

  create() {
    const p1isReady = false;
    const p2isReady = false;
    socket = this.registry.get("socket");
    roomName = this.registry.get("roomName");
    player = this.registry.get("player");

    const red = new CustomButton(
      this,
      window.innerWidth - 450,
      window.innerHeight / 2,
      "red",
      "red2"
    );
    const score1 = new CustomButton(
      this,
      window.innerWidth / 2 - 50,
      window.innerHeight / 2.5 + 30,
      "score1",
      "score1b"
    );
    const score2 = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2.5 + 30,
      "score2",
      "score2b"
    );
    const score3 = new CustomButton(
      this,
      window.innerWidth / 2 + 50,
      window.innerHeight / 2.5 + 30,
      "score3",
      "score3b"
    );
    const black = new CustomButton(
      this,
      window.innerWidth / 4,
      window.innerHeight / 2,
      "black",
      "black2"
    );
    const on = new CustomButton(
      this,
      window.innerWidth / 8,
      window.innerHeight / 8,
      "on",
      "on2"
    );
    const rounds = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2.5,
      "rounds",
      "rounds"
    );
    const velocity = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2.5 + 60,
      "velocity",
      "velocity"
    );
    const molt = new CustomButton(
      this,
      window.innerWidth / 2 + 50,
      window.innerHeight / 2.5 + 90,
      "molt",
      "moltb"
    );
    const molt2 = new CustomButton(
      this,
      window.innerWidth / 2 - 50,
      window.innerHeight / 2.5 + 90,
      "molt1",
      "molt1b"
    );
    const molt3 = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2.5 + 90,
      "molt2",
      "molt2b"
    );
    const gm = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight - window.innerHeight + 100,
      "gm",
      "gm2"
    );
    const gm2 = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight - window.innerHeight + 100,
      "gmb",
      "gm2b"
    );
    const classe = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2 + 75,
      "class",
      "class2"
    );
    black.setScale(0.5);

    const button = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2,
      "01",
      "02"
    );
    const rdy = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2,
      "rdy",
      "rdy"
    );

    const option = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight / 1.65,
      "options",
      "options2"
    );
    const optionwnd = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2,
      "menu",
      "menu"
    );
    const optionwnd2 = new CustomButton(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2,
      "menu",
      "menu"
    );
    const select = this.sound.add("selected");
    const wrong = this.sound.add("wrong");
    const intro1 = this.sound.add("intro1", { loop: true });
    const sellk = this.sound.add("locksel");

    score1.setScale(0.5);
    score2.setScale(0.5);
    score3.setScale(0.5);
    molt.setScale(0.5);
    molt2.setScale(0.5);
    molt3.setScale(0.5);

    this.add.existing(classe);
    this.add.existing(gm2);
    classe.setScale(0.5);
    classe.setVisible(false);
    this.add.existing(optionwnd);
    this.add.existing(optionwnd2);
    optionwnd.setVisible(false);
    optionwnd2.setVisible(false);
    this.add.existing(velocity);
    velocity.setVisible(false);
    this.add.existing(score1);
    this.add.existing(score2);
    this.add.existing(score3);
    this.add.existing(rounds);
    score1.setVisible(false);
    score2.setVisible(false);
    score3.setVisible(false);
    rounds.setVisible(false);
    rounds.setScale(0.3);
    velocity.setScale(0.3);
    this.add.existing(on);
    this.add.existing(option);
    this.add.existing(red);
    this.add.existing(black);
    this.add.existing(molt);
    molt.setVisible(false);
    this.add.existing(molt2);
    molt2.setVisible(false);
    this.add.existing(molt3);
    molt3.setVisible(false);
    this.add.existing(gm);
    gm.setScale(0.3);
    gm2.setScale(0.3);
    gm2.setVisible(false);
    if (player == 2) {
      socket.on("score", (data: any) => {
        score = data.score;
      });
      socket.on("speed", (data: any) => {
        speed = data.speed;
      });
    }
    if (player == 2) {
      socket.on("classic", () => {
        this.add.existing(button);
        gm.setVisible(false);
        gm2.setVisible(true);
        this.add.existing(button);
        button.setVisible(true);
        red.setVisible(false);
        black.setVisible(false);
        Gamemode = "classic";
      });
      socket.on("modern", () => {
        gm2.setVisible(false);
        gm.setVisible(true);
        button.setVisible(false);
        red.setVisible(true);
        black.setVisible(true);
        Gamemode = "modern";
      });
    }
    if (!Gamemode!) Gamemode = "modern";
    let vialibera = false;
    socket.on("blackrdy", () => {
      vialibera = true;
    });

    red.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (player == 2 && vialibera) {
        if (!speed!) speed = 1;
        if (!score!) score = 2;

        Phaser.Sound.Events.UNLOCKED;
        TeamChoice = "red";
        select.play();
        black.destroy();
        red.setScale(5);
        red.disableInteractive();
        on.setVisible(false);
        gm.setVisible(false);
        gm2.setVisible(false);
        if (TeamChoice! != null) {
          intro1.stop();
          if (Gamemode! == "modern") {
            intro1.stop();
            setTimeout(() => {
              this.scene.start("player-select");
            }, 1000);
          }
        }
      } else wrong.play();
    });
    black.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (player == 1) {
        if (!speed!) speed = 1;
        if (!score!) score = 2;
        socket.emit("blackrdy", { roomName: roomName });
        Phaser.Sound.Events.UNLOCKED;
        TeamChoice = "black";
        select.play();
        black.setScale(5);
        black.disableInteractive();
        red.destroy();
        on.setVisible(false);
        gm.setVisible(false);
        gm2.setVisible(false);
        if (TeamChoice! != null) {
          intro1.stop();
          if (Gamemode! == "modern") {
            intro1.stop();
            setTimeout(() => {
              this.scene.start("player-select");
            }, 1000);
          }
        }
      } else wrong.play();
    });

    button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      select.play();
      if (player == 1) socket.emit("p1Rdy", { roomName: roomName });
      else if (player == 2) socket.emit("p2Rdy", { roomName: roomName });

      if (player == 1 && !p1isReady) {
        button.destroy();
        this.add.existing(rdy);
      } else if (player == 1 && p1isReady) {
        rdy.destroy();
        this.add.existing(button);
      }

      if (player == 2 && !p2isReady) {
        button.destroy();
        this.add.existing(rdy);
      } else if (player == 2 && p2isReady) {
        rdy.destroy();
        this.add.existing(button);
      }

      if (!speed!) speed = 1;
      if (!score!) score = 2;
      if (Gamemode! == "classic") {
        socket.on("allReady", (data: any) => {
          randomStart = data.random;
          time = data.time;
          setTimeout(() => {
            intro1.stop();
            this.scene.start("classic-pong");
          }, 1000);
        });
      }
    });
    option.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      Phaser.Sound.Events.UNLOCKED;
      if (player == 1) {
        if (!optionwnd.visible) {
          optionwnd.setVisible(true);
          rounds.setVisible(true);
          velocity.setVisible(true);
          score1.setVisible(true);
          score2.setVisible(true);
          score3.setVisible(true);
          molt.setVisible(true);
          molt2.setVisible(true);
          molt3.setVisible(true);
          button.setVisible(false);
        } else {
          optionwnd.setVisible(false);
          button.setVisible(true);
          velocity.setVisible(false);
          rounds.setVisible(false);
          score1.setVisible(false);
          score2.setVisible(false);
          score3.setVisible(false);
          molt.setVisible(false);
          molt2.setVisible(false);
          molt3.setVisible(false);
        }
      } else wrong.play();
    });

    on.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      Phaser.Sound.Events.UNLOCKED;
      if (intro1.isPlaying) intro1.stop();
      else intro1.play();
    });

    score1.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (score1.visible) {
        if (!score2.visible) {
          score2.setVisible(true);
          score3.setVisible(true);
        } else {
          score2.setVisible(false);
          score3.setVisible(false);
        }
        sellk.play();
        socket.emit("score", { roomName: roomName, score: 3 });
        score = 3;
      }
    });

    score2.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (score2.visible) {
        if (!score1.visible) {
          score1.setVisible(true);
          score3.setVisible(true);
        } else {
          score1.setVisible(false);
          score3.setVisible(false);
        }
        sellk.play();
        socket.emit("score", { roomName: roomName, score: 5 });
        score = 5;
      }
    });

    score3.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (score3.visible) {
        if (!score1.visible) {
          score1.setVisible(true);
          score2.setVisible(true);
        } else {
          score1.setVisible(false);
          score2.setVisible(false);
        }
        sellk.play();
        socket.emit("score", { roomName: roomName, score: 7 });
        score = 7;
      }
    });

    molt.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (molt.visible) {
        if (!molt2.visible) {
          molt2.setVisible(true);
          molt3.setVisible(true);
        } else {
          molt2.setVisible(false);
          molt3.setVisible(false);
        }
        sellk.play();
        socket.emit("score", { roomName: roomName, speed: 1.7 });
        speed = 1.7;
      }
    });

    molt2.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (molt2.visible) {
        if (!molt.visible) {
          molt.setVisible(true);
          molt3.setVisible(true);
        } else {
          molt.setVisible(false);
          molt3.setVisible(false);
        }
        sellk.play();
        socket.emit("score", { roomName: roomName, speed: 1 });
        speed = 1;
      }
    });

    molt3.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (molt3.visible) {
        if (!molt2.visible) {
          molt2.setVisible(true);
          molt.setVisible(true);
        } else {
          molt2.setVisible(false);
          molt.setVisible(false);
        }

        sellk.play();
        socket.emit("score", { roomName: roomName, speed: 1.5 });
        speed = 1.5;
      }
    });

    gm.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (!gm2.visible && player == 1) {
        sellk.play();
        this.add.existing(button);
        gm.setVisible(false);
        gm2.setVisible(true);
        this.add.existing(button);
        button.setVisible(true);
        red.setVisible(false);
        black.setVisible(false);
        Gamemode = "classic";
        socket.emit("classic", { roomName: roomName });
      } else wrong.play();
    });
    gm2.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (!gm.visible && player == 1) {
        sellk.play();
        gm2.setVisible(false);
        gm.setVisible(true);
        button.setVisible(false);
        red.setVisible(true);
        black.setVisible(true);
        Gamemode = "modern";
        socket.emit("modern", { roomName: roomName });
      } else wrong.play();
    });
  }
}
