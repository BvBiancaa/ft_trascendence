import Phaser from "phaser";
import CustomButton from "./CustomButton";
import { TeamChoice } from "./CustomButtonScene";
import { player } from "./CustomButtonScene";
import { socket } from "./CustomButtonScene";
import { roomName } from "./CustomButtonScene";
import { punteggio1 } from "./HelloWorldScene";
let time: number;
export { time };
let randomStart: number;
export { randomStart };
let currentPlayerChoice1: string;
let currentPlayerChoice2: string;
export { currentPlayerChoice1 };
export { currentPlayerChoice2 };
export default class PlayerSelectionScene extends Phaser.Scene {
  constructor() {
    super("player-select");
  }
  preload() {
    this.load.image("01", "img/menu_button.png");
    this.load.image("vanni", "img/vanni.png");
    this.load.image("ben", "img/renzi.png");
    this.load.image("hitler", "img/hitla.png");
    this.load.image("soviet", "img/soviet.png");
    this.load.image("duce", "img/mussolini.png");
    this.load.image("silvio", "img/silvio.png");
    this.load.image("mao", "img/mao.png");
    this.load.image("sel", "img/sel.png");
    this.load.image("02", "img/menu_button_press.png");
    this.load.image("paccia", "img/paccia.png");
    //DOUBLES
    this.load.image("paccia2", "img/paccia2.png");
    this.load.image("vanni2", "img/vanni2.png");
    this.load.image("ben2", "img/ben2.png");
    this.load.image("hitler2", "img/hitla2.png");
    this.load.image("soviet2", "img/soviet2.png");
    this.load.image("mao2", "img/mao2.png");
    this.load.image("duce2", "img/mussolini2.png");
    this.load.image("silvio2", "img/silvio2.png");

    this.load.audio("whis", "sounds/whistle.mp3");
    this.load.audio("whis2", "sounds/starting-whistle.mp3");
    this.load.audio("intro", "sounds/intro.mp3");
    this.load.audio("nein", "sounds/nein.mp3");
    this.load.audio("choose", "sounds/choose.mp3");
    this.load.audio("kapo", "sounds/kapo.mp3");
    this.load.audio("dux", "sounds/dux.mp3");
    this.load.audio("ussr", "sounds/ussrr.mp3");
    this.load.audio("gong", "sounds/gong.mp3");
    this.load.audio("bgp", "sounds/bgp.mp3");
    this.load.audio("vannidux", "sounds/vanniduxx.mp3");
    this.load.audio("capretto", "sounds/capretto.mp3");
    this.load.audio("wrong", "sounds/wrong.mp3");
  }

  create() {
    const hitla = new CustomButton(
      this,
      window.innerWidth / 8,
      window.innerHeight / 4,
      "hitler",
      "hitler2"
    );
    const duce = new CustomButton(
      this,
      window.innerWidth / 4,
      window.innerHeight / 4 + 10,
      "duce",
      "duce2"
    );
    const silvio = new CustomButton(
      this,
      window.innerWidth / 4,
      window.innerHeight / 2 + 10,
      "silvio",
      "silvio2"
    );
    const vanni = new CustomButton(
      this,
      window.innerWidth / 8,
      window.innerHeight / 2 + 50,
      "vanni",
      "vanni2"
    );

    const mao = new CustomButton(
      this,
      window.innerWidth - 250,
      window.innerHeight / 4 + 10,
      "mao",
      "mao2"
    );
    const stalin = new CustomButton(
      this,
      window.innerWidth - 500,
      window.innerHeight / 4 + 10,
      "soviet",
      "soviet2"
    );
    const benigni = new CustomButton(
      this,
      window.innerWidth - 500,
      window.innerHeight / 2 + 10,
      "ben",
      "ben2"
    );
    const paccia = new CustomButton(
      this,
      window.innerWidth - 250,
      window.innerHeight / 2 + 10,
      "paccia",
      "paccia2"
    );

    const choose = this.sound.add("choose");
    const intro = this.sound.add("intro", { loop: true });
    const nein = this.sound.add("nein");
    const kapo = this.sound.add("kapo");
    const dux = this.sound.add("dux");
    const ussr = this.sound.add("ussr");
    const gong = this.sound.add("gong");
    const bgp = this.sound.add("bgp");
    const vannidux = this.sound.add("vannidux");
    const capretto = this.sound.add("capretto");
    const wrong = this.sound.add("wrong");

    choose.play();
    intro.play();

    vanni.setScale(0.4);
    duce.setScale(0.4);
    hitla.setScale(0.3);
    mao.setScale(0.3);
    stalin.setScale(0.3);
    silvio.setScale(0.5);
    benigni.setScale(0.4);
    paccia.setScale(0.3);

    this.add.existing(hitla);
    this.add.existing(duce);
    this.add.existing(mao);
    this.add.existing(stalin);
    this.add.existing(silvio);
    this.add.existing(benigni);
    this.add.existing(vanni);
    this.add.existing(paccia);

    const whistle = this.sound.add("whis");
    const whistle2 = this.sound.add("whis2");
    whistle.setVolume(0.5);
    whistle2.setVolume(0.5);

    //Neri

    hitla.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (TeamChoice! == "red") {
        wrong.play();
        return;
      }

      hitla.setScale(2);
      hitla.disableInteractive();
      silvio.setVisible(false);
      vanni.setVisible(false);
      duce.setVisible(false);
      intro.stop();
      nein.play();
      nein.once(Phaser.Sound.Events.COMPLETE, () => {
        if (player == 1) {
          socket.emit("p1Rdy", { roomName: roomName, char: "hitla" });
          currentPlayerChoice1 = "hitla";
        }
      });
    });

    silvio.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (TeamChoice! == "red") {
        wrong.play();
        return;
      }
      silvio.setScale(2);
      silvio.disableInteractive();
      hitla.setVisible(false);
      vanni.setVisible(false);
      duce.setVisible(false);
      intro.stop();
      kapo.play();
      kapo.once(Phaser.Sound.Events.COMPLETE, () => {
        if (player == 1) {
          socket.emit("p1Rdy", { roomName: roomName, char: "silvio" });
          currentPlayerChoice1 = "silvio";
        }
      });
    });

    duce.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (TeamChoice! == "red") {
        wrong.play();
        return;
      }
      silvio.setVisible(false);
      vanni.setVisible(false);
      hitla.setVisible(false);
      duce.setScale(2);
      duce.disableInteractive();
      intro.stop();
      dux.play();
      dux.once(Phaser.Sound.Events.COMPLETE, () => {
        if (player == 1) {
          socket.emit("p1Rdy", { roomName: roomName, char: "duce" });
          currentPlayerChoice1 = "duce";
        }
      });
    });

    vanni.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (TeamChoice! == "red") {
        wrong.play();
        return;
      }
      silvio.setVisible(false);
      hitla.setVisible(false);
      duce.setVisible(false);
      vanni.setScale(2);
      vanni.disableInteractive();
      intro.stop();
      vannidux.play();
      vannidux.once(Phaser.Sound.Events.COMPLETE, () => {
        if (player == 1) {
          socket.emit("p1Rdy", { roomName: roomName, char: "vanni" });
          currentPlayerChoice1 = "vanni";
        }
      });
    });

    // rossi
    stalin.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (TeamChoice! == "black") {
        wrong.play();
        return;
      }
      mao.setVisible(false);
      benigni.setVisible(false);
      paccia.setVisible(false);
      stalin.setScale(2);
      stalin.disableInteractive();
      intro.stop();
      ussr.play();
      ussr.once(Phaser.Sound.Events.COMPLETE, () => {
        if (player == 2) {
          socket.emit("p2Rdy", { roomName: roomName, char: "soviet" });
          currentPlayerChoice2 = "soviet";
        }
      });
    });

    mao.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (TeamChoice! == "black") {
        wrong.play();
        return;
      }
      stalin.setVisible(false);
      benigni.setVisible(false);
      paccia.setVisible(false);
      mao.setScale(2);
      mao.disableInteractive();
      intro.stop();
      gong.play();
      gong.once(Phaser.Sound.Events.COMPLETE, () => {
        if (player == 2) {
          currentPlayerChoice2 = "mao";
          socket.emit("p2Rdy", { roomName: roomName, char: "mao" });
        }
      });
    });

    benigni.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (TeamChoice! == "black") {
        wrong.play();
        return;
      }
      mao.setVisible(false);
      stalin.setVisible(false);
      paccia.setVisible(false);
      benigni.setScale(2);
      benigni.disableInteractive();
      intro.stop();
      bgp.play();
      bgp.once(Phaser.Sound.Events.COMPLETE, () => {
        if (player == 2) {
          socket.emit("p2Rdy", { roomName: roomName, char: "ben" });
          currentPlayerChoice2 = "ben";
        }
      });
    });

    paccia.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (TeamChoice! == "black") {
        wrong.play();
        return;
      }

      mao.setVisible(false);
      benigni.setVisible(false);
      stalin.setVisible(false);
      paccia.setScale(2);
      paccia.disableInteractive();
      intro.stop();
      capretto.play();
      capretto.once(Phaser.Sound.Events.COMPLETE, () => {
        if (player == 2) {
          socket.emit("p2Rdy", { roomName: roomName, char: "paccia" });
          currentPlayerChoice2 = "paccia";
        }
      });
    });

    socket.on("allReady", (data: any) => {
      randomStart = data.random;
      time = data.time;
      currentPlayerChoice1 = data.char1;
      currentPlayerChoice2 = data.char2;

      setTimeout(() => {
        //whistle?.play();
        //   whistle2?.play();
        this.scene.start("pong-scene");
      }, 1000);
    });
  }
}
