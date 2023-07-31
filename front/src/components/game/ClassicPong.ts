import Phaser from "phaser";

import { speed } from "./CustomButtonScene";
import { player } from "./CustomButtonScene";
import { randomStart } from "./CustomButtonScene";
import { roomName } from "./CustomButtonScene";
import { score } from "./CustomButtonScene";
import { Socket } from "socket.io-client";

let Iwin: number;
let responsive: number = 55;
export { Iwin };

let socket: Socket;
let random: number = randomStart;

let lastHit: number;
export default class ClassicPongScene extends Phaser.Scene {
  handleCollision = () => {
    if (
      !this.ball ||
      !this.player1 ||
      !this.child ||
      !this.player2 ||
      !this.hit
    )
      return;
    const collisionPoint = this.child.x - this.player1.x;
    const normalizedCollisionPoint = collisionPoint * (this.player1.width / 2);

    let bounceAngle = (normalizedCollisionPoint * Math.PI) / 4;
    let ciccio;

    if (random < 200) {
      ciccio = {
        setv: 600 * speed! * (bounceAngle / 200),
        other: -300,
        gameRoom: roomName,
      };
    } else {
      ciccio = {
        setv: 600 * speed! * (bounceAngle / 200),
        other: 300,
        gameRoom: roomName,
      };
    }
    if (!this.player1.body) return;
    this.player1.body.immovable = true;
    if (player == 1) {
      lastHit = 1;
      socket.emit("hitp1", ciccio);
    }
    this.hit.play();
  };
  handleCollision2 = () => {
    if (
      !this.ball ||
      !this.player1 ||
      !this.child ||
      !this.player2 ||
      !this.hit
    )
      return;
    const collisionPoint = this.child.x - this.player2.x;
    const normalizedCollisionPoint = collisionPoint / (this.player2.width / 2);
    let bounceAngle = (normalizedCollisionPoint * Math.PI) / 4;
    let ciccio;
    if (random < 200) {
      ciccio = {
        setv: -600 * speed! * ((bounceAngle / 2) * -1.5),
        other: -300,
        roomName: roomName,
      };
    } else {
      ciccio = {
        setv: -600 * speed! * ((bounceAngle / 2) * -1.5),
        other: 300,
        roomName: roomName,
      };
    }
    if (!this.player2.body) return;
    this.player2.body.immovable = true;
    if (player == 2) {
      lastHit = 2;
      socket.emit("hitp2", ciccio);
    }
    this.hit.play();
  };
  private wallhit?:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private player1?: Phaser.Physics.Arcade.Sprite;
  private player2?: Phaser.Physics.Arcade.Sprite;
  private score1?: Phaser.Physics.Arcade.StaticGroup;
  private score2?: Phaser.Physics.Arcade.StaticGroup;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private ball?: Phaser.Physics.Arcade.Group;
  private child?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private score_p1?: Phaser.Physics.Arcade.Sprite;
  private score_p2?: Phaser.Physics.Arcade.Sprite;
  private punteggio1 = 0;
  private punteggio2 = 0;
  private hit?:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  private cheer?:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  private w: any;
  private s: any;
  private r: any;
  constructor() {
    super("classic-pong");
  }
  preload() {
    //GAME SOUNDS
    this.load.audio("hit", "sounds/classichit.mp3");
    this.load.audio("wallhit", "sounds/wallhit.mp3");

    this.load.audio("cheer", "sounds/classicscore.mp3");
    this.load.audio("cheer2", "sounds/cheer2.mp3");
    this.load.audio("cheer3", "sounds/cheer3.mp3");
    this.load.audio("cheer4", "sounds/cheer4.mp3");
    this.load.audio("hurt", "sounds/hurt.mp3");
    this.load.audio("hurt2", "sounds/hurt2.mp3");
    this.load.audio("hurt3", "sounds/hurt3.mp3");
    this.load.image("effect", "img/effect.png");
    this.load.audio("hurt4", "sounds/hurt4.mp3");
    //IMAGES

    this.load.image("p1", "img/classicplayer.png");
    this.load.image("p2", "img/classicplayer.png");
    this.load.image("0", "img/zeroC.png");
    this.load.image("1", "img/one.png");
    this.load.image("2", "img/two.png");
    this.load.image("3", "img/three.png");
    this.load.image("4", "img/four.png");
    this.load.image("5", "img/five.png");
    this.load.image("6", "img/six.png");
    this.load.image("7", "img/seven.png");
    this.load.image("8", "img/eight.png");
    this.load.image("9", "img/nine.png");
    this.load.image("mid", "img/classicdashed.png");
    this.load.image("ball", "img/classicBall.png");
    this.load.image("fire", "img/fire.png");
    this.load.image("goal", "img/goalie.png");
    this.load.image("goalarea", "img/goalarea.png");

    //player2 score
    this.load.image("0.2", "img/zeroC.png");
    this.load.image("1.2", "img/one.png");
    this.load.image("2.2", "img/two.png");
    this.load.image("3.2", "img/three.png");
    this.load.image("4.2", "img/four.png");
    this.load.image("5.2", "img/five.png");
    this.load.image("6.2", "img/six.png");
    this.load.image("7.2", "img/seven.png");
    this.load.image("8.2", "img/eight.png");
    this.load.image("9.2", "img/nine.png");
  }

  create() {
    socket = this.registry.get("socket");
    this.platforms = this.physics.add.staticGroup();
    this.hit = this.sound.add("hit");
    this.wallhit = this.sound.add("wallhit");
    this.cheer = this.sound.add("cheer");
    const mid = this.platforms.create(
      window.innerWidth / 2 - 50,
      window.innerHeight / 2 + 25,
      "mid"
    ) as Phaser.Physics.Arcade.Sprite;
    mid.setScale(2);

    // SET THE PLAYER 1 SCORE
    this.score1 = this.physics.add.staticGroup();
    this.score_p1 = this.platforms.create(
      window.innerWidth / 2 - 300,
      window.innerHeight - window.innerHeight + 100,
      "0"
    ) as Phaser.Physics.Arcade.Sprite;
    this.score_p1.setScale(2.5);
    //SET THE PLAYER 2 SCORE
    this.score2 = this.physics.add.staticGroup();
    this.score_p2 = this.platforms.create(
      window.innerWidth / 2 + 200,
      window.innerHeight - window.innerHeight + 100,
      "0"
    ) as Phaser.Physics.Arcade.Sprite;
    this.score_p2.setScale(2.5);
    // PLAYER1 && PLAYER 2
    this.player1 = this.physics.add.sprite(
      window.innerWidth - window.innerWidth + 250,
      window.innerHeight / 2 - 15,
      "p1"
    );
    this.player1.setBounce(0, 0);
    this.player1.setCollideWorldBounds(true);
    this.player2 = this.physics.add.sprite(
      window.innerWidth - 250,
      window.innerHeight / 2 - 15,
      "p2"
    );
    this.player2.setBounce(0, 0);
    this.player2.setCollideWorldBounds(true);

    // BALL CREATION
    const x = window.innerWidth / 2 - 50;
    const y = window.innerHeight / 2 - 15;
    this.ball = this.physics.add.group({
      key: "ball",
      setXY: { x, y, stepX: 70 },
    });
    this.ball.children.iterate((c: Phaser.GameObjects.GameObject) => {
      this.child = c as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
      this.child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      this.child.setBounceX(Phaser.Math.FloatBetween(1, 1.6));
      this.child.setScale(1.5);
      this.child.setCollideWorldBounds(true);
      this.child.setVelocityX(400);
      return null;
    });

    //EMITTER

    if (!this.child) return;

    this.physics.add.collider(this.player1, this.ball, this.handleCollision);
    this.physics.add.collider(this.ball, this.player2, this.handleCollision2);
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.w = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.s = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.r = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    if (!this.cursors || !this.child || !this.child.x) return;

    if (player == 1) {
      socket.on("ballPos2", (data: any) => {
        this.child?.setPosition(window.innerWidth / 2, data.y);
      });
    }

    if (player == 2) {
      socket.on("ballPos1", (data: any) => {
        this.child?.setPosition(window.innerWidth / 2, data.y);
      });
    }

    if (
      this.child.body.x == window.innerWidth / 2 &&
      lastHit == 1 &&
      player == 1
    ) {
      socket.emit("ballPos", {
        roomName: roomName,
        y: this.child.body.y,
      });
    }

    if (
      this.child.body.x == window.innerWidth / 2 &&
      lastHit == 2 &&
      player == 2
    ) {
      socket.emit("ballPos", {
        roomName: roomName,
        y: this.child.body.y,
      });
    }
    socket.on("player1Win", () => {
      Iwin = 1;
      this.scene.start("win-lose-scene");
    });
    socket.on("player2Win", () => {
      Iwin = 2;
      this.scene.start("win-lose-scene");
    });

    socket.on("p1hit", (data: any) => {
      random = data.random;
      this.child?.setVelocity(data.setv, data.other);
    });

    socket.on("p2hit", (data: any) => {
      random = data.random;
      this.child?.setVelocity(data.setv, data.other);
    });

    socket.on("player1down", (data: any) => {
      if (this.player1?.body?.position.y) {
        this.player1.body.position.y = data.paddle1y;
      }
      this.player1?.setVelocityY(760);
    });

    socket.on("player1up", (data: any) => {
      if (this.player1?.body?.position.y) {
        this.player1.body.position.y = data.paddle1y;
      }
      this.player1?.setVelocityY(-760);
    });

    socket.on("player2down", (data: any) => {
      if (this.player2?.body?.position.y) {
        this.player2.body.position.y = data.paddle2y;
      }
      this.player2?.setVelocityY(760);
    });

    socket.on("player2up", (data: any) => {
      if (this.player2?.body?.position.y) {
        this.player2.body.position.y = data.paddle2y;
      }
      this.player2?.setVelocityY(-760);
    });

    if (this.cursors.up?.isDown && player == 2) {
      socket.emit("player2up", {
        roomName: roomName,
        paddle2y: this.player2?.body?.position.y,
      });
    } else if (this.cursors.down?.isDown && player == 2) {
      this.player2?.setVelocityY(760);
      socket.emit("player2down", {
        roomName: roomName,
        paddle2y: this.player2?.body?.position.y,
      });
    }

    if (this.w.isDown && player == 1) {
      socket.emit("player1up", {
        roomName: roomName,
        paddle1y: this.player1?.body?.position.y,
      });
    } else if (this.s.isDown && player == 1) {
      socket?.emit("player1down", {
        roomName: roomName,
        paddle1y: this.player1?.body?.position.y,
      });
    } else if (this.r.isDown) {
      this.child.setPosition(window.innerWidth / 2, window.innerHeight / 2);
      if (random % 2 == 0) this.child.setVelocityY(-200);
      else this.child.setVelocityY(200);
    } else if (!this.cursors.up?.isDown && !this.cursors.down?.isDown) {
      this.player1?.setVelocityY(0);
      this.player2?.setVelocityY(0);
    }
    if (this.cursors.up?.isDown && this.player1?.body?.touching.down)
      this.player1.setVelocityY(-330);
    if (!this.ball) return;
    if (!this.player1 || !this.player2) return;
    if (!this.player1.body || !this.player2.body) return;
    this.player2.body.immovable = true;
    this.player1.body.immovable = true;

    if (!this.platforms) return;
    const array = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const array2 = [
      "0.2",
      "1.2",
      "2.2",
      "3.2",
      "4.2",
      "5.2",
      "6.2",
      "7.2",
      "8.2",
      "9.2",
    ];
    if (this.child.x < 25) {
      this.punteggio1++;
      this.child.setPosition(window.innerWidth / 2, window.innerHeight / 2);
      this.child.setVelocity(200);
      this.score_p2?.destroy(true);
      this.score_p2 = this.platforms.create(
        window.innerWidth / 2 + 200,
        window.innerHeight - window.innerHeight + 100,
        array2[this.punteggio1]
      );
      this.score_p2?.setScale(2.5);
      if (!this.score_p2) return;
      this.cheer?.play();
    }
    if (this.child.x > this.player2.x + responsive) {
      this.punteggio2++;
      this.child.setPosition(window.innerWidth / 2, window.innerHeight / 2);
      this.child.setVelocity(-200);
      this.score_p1?.destroy(true);
      this.score_p1 = this.platforms.create(
        window.innerWidth / 2 - 300,
        window.innerHeight - window.innerHeight + 100,
        array[this.punteggio2]
      );
      this.score_p1?.setScale(2.5);
      if (!this.score_p1) return;
      this.cheer?.play();
    }
    if (this.child.y >= window.innerHeight - 25 || this.child.y <= 10) {
      if (!this.wallhit) return;
      this.wallhit.play();
    }
    if (this.punteggio1 == score! || this.punteggio2 == score!) {
      if (this.punteggio1 == score!)
        socket.emit("winner", {
          winner: 2,
          roomName: roomName,
          result: { player1: this.punteggio1, player2: this.punteggio2 },
        });
      else if (this.punteggio2 == score!)
        socket.emit("winner", {
          winner: 1,
          roomName: roomName,
          result: { player1: this.punteggio1, player2: this.punteggio2 },
        });
    }
  }
}
