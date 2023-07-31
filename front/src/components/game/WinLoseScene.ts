import Phaser from "phaser";
import { Socket } from "socket.io-client";
import { punteggio1 } from "./HelloWorldScene";
import { punteggio2 } from "./HelloWorldScene";

import { Iwin } from "./ClassicPong";
import { IWIN } from "./HelloWorldScene";
import { roomName } from "./CustomButtonScene";
let TeamChoice;
export { TeamChoice };
let score;
export { score };
let speed;
export { speed };
let socket: Socket;
let player: number;
export default class WinLose extends Phaser.Scene {
  constructor() {
    super("win-lose-scene");
  }
  private platforms?: Phaser.Physics.Arcade.StaticGroup;

  preload() {
    this.load.image("win", "img/youwin.png");
    this.load.image("lose", "img/youlose.png");
    this.load.audio("victory", "sounds/victory.mp3");
    this.load.audio("laugh", "sounds/laugh.mp3");
    this.load.audio("lost", "sounds/lost.mp3");
  }

  create() {
    player = this.registry.get("player");
    if (punteggio1 == 7 && punteggio2 == 0 && player == 2)
      setTimeout(() => {
        this.scene.start("pre-papa-scene");
      }, 3000);
    else if (player == 2) {
      setTimeout(() => {
        socket.emit("gameEnd", { roomName: roomName });

        socket.off("player2down");
        socket.off("player1down");
        socket.off("player1up");
        socket.off("player2up");
        socket.off("p2hit");
        socket.off("p1hit");
        socket.off("player2Win");
        socket.off("player1Win");
        socket.off("ballpos2");
        socket.off("ballpos1");
        socket.off("allReady");
        this.game.destroy(true);
      }, 6000);
    }
    if (punteggio1 == 0 && punteggio2 == 7 && player == 1) {
      setTimeout(() => {
        this.scene.start("pre-papa-scene");
      }, 6000);
    } else if (player == 1) {
      setTimeout(() => {
        socket.emit("gameEnd", { roomName: roomName });

        socket.off("player2down");
        socket.off("player1down");
        socket.off("player1up");
        socket.off("player2up");
        socket.off("p2hit");
        socket.off("p1hit");
        socket.off("player2Win");
        socket.off("player1Win");
        socket.off("ballpos2");
        socket.off("ballpos1");
        socket.off("allReady");
        this.game.destroy(true);
      }, 6000);
    }
    socket = this.registry.get("socket");
    this.platforms = this.physics.add.staticGroup();
    const winner = this.sound.add("victory");
    const loser = this.sound.add("lost");
    const laugh = this.sound.add("laugh");
    if (Iwin) {
      if (Iwin == 1) {
        if (player == 1) {
          winner.play();
          const win = this.platforms?.create(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "win"
          ) as Phaser.Physics.Arcade.Sprite;
          win.setScale(3);
        }
        if (player == 2) {
          loser.play();
          laugh.play();
          const lost = this.platforms?.create(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "lose"
          ) as Phaser.Physics.Arcade.Sprite;
          lost.setScale(3);
        }
      }

      if (Iwin == 2) {
        if (player == 2) {
          winner.play();
          const win = this.platforms?.create(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "win"
          ) as Phaser.Physics.Arcade.Sprite;
          win.setScale(3);
        }
        if (player == 1) {
          loser.play();
          laugh.play();
          const lost = this.platforms?.create(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "lose"
          ) as Phaser.Physics.Arcade.Sprite;
          lost.setScale(3);
        }
      }
    } else if (IWIN) {
      if (IWIN == 1) {
        if (player == 1) {
          winner.play();
          const win = this.platforms?.create(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "win"
          ) as Phaser.Physics.Arcade.Sprite;
          win.setScale(3);
        }
        if (player == 2) {
          loser.play();
          laugh.play();
          const lost = this.platforms?.create(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "lose"
          ) as Phaser.Physics.Arcade.Sprite;
          lost.setScale(3);
        }
      }
      if (IWIN == 2) {
        if (player == 2) {
          winner.play();
          const win = this.platforms?.create(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "win"
          ) as Phaser.Physics.Arcade.Sprite;
          win.setScale(3);
        }
        if (player == 1) {
          loser.play();
          laugh.play();
          const lost = this.platforms?.create(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "lose"
          ) as Phaser.Physics.Arcade.Sprite;
          lost.setScale(3);
        }
      }
    }
  }
}
