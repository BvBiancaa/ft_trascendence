import Phaser, { Sound } from "phaser";
import { currentPlayerChoice1 } from "./PlayerSelection";
import { currentPlayerChoice2 } from "./PlayerSelection";
import { score } from "./CustomButtonScene";
import { speed } from "./CustomButtonScene";
import CustomButton from "./CustomButton";
import { roomName } from "./CustomButtonScene";
import { Socket } from "socket.io-client";
import { randomStart } from "./CustomButtonScene";
import { player } from "./CustomButtonScene";
import { parseQuery } from "vue-router";
let socket: Socket;
let IWIN: number;
export { IWIN };
let lastHit: number;
let random: number = randomStart;
let punteggio1: number = 0;
let punteggio2: number = 0;

export { punteggio1 };
export { punteggio2 };

export default class PongScene extends Phaser.Scene {
  handleCollision = () => {
    if (!this.player1 || !this.child || !this.player2 || !this.hit) return;
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
    if (!this.player1 || !this.child || !this.player2 || !this.hit) return;
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
  private rotX = 0.02;
  private rotY = 0.02;
  private child?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private collisionForce = 3;
  private score_p1?: Phaser.Physics.Arcade.Sprite;
  private score_p2?: Phaser.Physics.Arcade.Sprite;
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
  private SoundArray = ["gS1", "gS2", "gS3", "gS4", "hit"];
  private SoundArray2 = ["cheer", "cheer2", "cheer5", "cheer4", "cheer3"];
  private goalSounds?: Array<
    Sound.NoAudioSound | Sound.HTML5AudioSound | Sound.WebAudioSound
  >;
  private cheerSounds?: Array<
    Sound.NoAudioSound | Sound.HTML5AudioSound | Sound.WebAudioSound
  >;

  constructor() {
    super("pong-scene");
  }

  preload() {
    //GAME SOUNDS
    this.load.audio("wallhit", "sounds/wallhit.mp3");
    this.load.audio("hit", "sounds/hit.mp3");
    this.load.audio("gS1", "sounds/gS1.mp3");
    this.load.audio("gS2", "sounds/gS2.mp3");
    this.load.audio("gS3", "sounds/gS3.mp3");
    this.load.audio("gS4", "sounds/gS4.mp3");
    this.load.audio("cheer", "sounds/cheer.mp3");
    this.load.audio("cheer2", "sounds/cheer2.mp3");
    this.load.audio("cheer3", "sounds/cheer3.mp3");
    this.load.audio("cheer4", "sounds/cheer4.mp3");
    this.load.audio("cheer5", "sounds/cheer5.mp3");
    this.load.audio("hurt", "sounds/hurt.mp3");
    this.load.audio("hurt2", "sounds/hurt2.mp3");
    this.load.audio("hurt3", "sounds/hurt3.mp3");
    this.load.image("effect", "img/effect.png");
    this.load.audio("hurt4", "sounds/hurt4.mp3");
    this.load.audio("wallhit", "sounds/wallhit.mp3");
    //IMAGES
    this.load.image("soviet", "img/soviet.png");
    this.load.image("duce", "img/mussolini.png");
    this.load.image("silvio", "img/silvio.png");
    this.load.image("mao", "img/mao.png");
    this.load.image("vanni", "img/vanni.png");
    this.load.image("ben", "img/ben.png");
    this.load.image("paccia", "img/paccia.png");
    this.load.image("hitla", "img/hitla.png");
    this.load.image("p1", "img/player_one.png");
    this.load.image("p2", "img/player_two.png");
    this.load.image("0", "img/zero.png");
    this.load.image("1", "img/uno.png");
    this.load.image("2", "img/due.png");
    this.load.image("3", "img/tre.png");
    this.load.image("4", "img/quattro.png");
    this.load.image("5", "img/cinque.png");
    this.load.image("6", "img/sei.png");
    this.load.image("7", "img/sette.png");
    this.load.image("8", "img/otto.png");
    this.load.image("9", "img/nove.png");
    this.load.image("10", "img/dieci.png");
    this.load.image("mid", "img/middle.png");
    this.load.image("ball", "img/ball.png");
    this.load.image("fire", "img/fire.png");
    this.load.image("goal", "img/goalie.png");
    this.load.image("goalarea", "img/goalarea.png");

    //player2 score
    this.load.audio("intro1", "sounds/arcade.mp3");
    this.load.image("0.2", "img/02.png");
    this.load.image("1.2", "img/uno2.png");
    this.load.image("2.2", "img/due2.png");
    this.load.image("3.2", "img/tre2.png");
    this.load.image("4.2", "img/quattro2.png");
    this.load.image("5.2", "img/cinque2.png");
    this.load.image("6.2", "img/sei2.png");
    this.load.image("7.2", "img/sette2.png");
    this.load.image("8.2", "img/otto2.png");
    this.load.image("9.2", "img/nove2.png");
    this.load.image("on", "img/on.png");
    this.load.image("on2", "img/on2.png");
  }

  create() {
    socket = this.registry.get("socket");
    //socket.off("gameEnded");
    socket.off("AllReady");
    socket.off("blackrdy");
    socket.off("modern");
    socket.off("speed");
    socket.off("score");
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
    IWIN = 0;
    punteggio1 = 0;
    punteggio2 = 0;
    this.wallhit = this.sound.add("wallhit");
    this.goalSounds = [];
    this.cheerSounds = [];
    for (let i = 0; i < this.SoundArray.length; i++) {
      const sound = this.sound.add(this.SoundArray[i]);
      this.goalSounds.push(sound);
    }
    for (let i = 0; i < this.SoundArray2.length; i++) {
      const sound = this.sound.add(this.SoundArray2[i]);
      this.cheerSounds.push(sound);
    }

    this.platforms = this.physics.add.staticGroup();

    const audio = new CustomButton(
      this,
      window.innerWidth / window.innerWidth + 200,
      window.innerHeight / window.innerHeight + 100,
      "on",
      "on2"
    );
    const song = this.sound.add("intro1");

    this.add.existing(audio);
    const mid = this.platforms.create(
      window.innerWidth / 2 - 50,
      window.innerHeight / 2,
      "mid"
    ) as Phaser.Physics.Arcade.Sprite;
    mid.setScale(1.5);
    const duce = this.platforms.create(
      window.innerWidth / 6,
      window.innerHeight / 2,
      currentPlayerChoice1!
    ) as Phaser.Physics.Arcade.Sprite;
    const stalin = this.platforms.create(
      window.innerWidth - 400,
      window.innerHeight / 2,
      currentPlayerChoice2!
    ) as Phaser.Physics.Arcade.Sprite;

    duce.setScale(1).refreshBody();
    stalin.setScale(1).refreshBody();

    // SET THE PLAYER 1 SCORE
    this.score1 = this.physics.add.staticGroup();
    this.score_p1 = this.platforms.create(
      window.innerWidth / 2 - 300,
      window.innerHeight - window.innerHeight + 100,
      "0"
    ) as Phaser.Physics.Arcade.Sprite;
    this.score_p1.setScale(0.5).refreshBody();

    //SET THE PLAYER 2 SCORE
    this.score2 = this.physics.add.staticGroup();
    this.score_p2 = this.platforms.create(
      window.innerWidth / 2 + 200,
      window.innerHeight - window.innerHeight + 100,
      "0"
    ) as Phaser.Physics.Arcade.Sprite;
    this.score_p2.setScale(0.5).refreshBody();
    // PLAYER1 && PLAYER 2
    this.player1 = this.physics.add.sprite(
      window.innerWidth - window.innerWidth + 100,
      window.innerHeight / 2 - 15,
      "p1"
    );
    this.player1.setBounce(0, 0);
    this.player1.setCollideWorldBounds(true);
    this.player2 = this.physics.add.sprite(
      window.innerWidth - 100,
      window.innerHeight / 2 - 15,
      "p2"
    );
    this.player2.setBounce(0, 0);
    this.player2.setCollideWorldBounds(true);

    //ALLING ?
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
      this.child.setScale(0.75);
      this.child.setCollideWorldBounds(true);
      this.child.setVelocityX(400);
      return null;
    });

    this.hit = this.sound.add("hit");
    this.cheer = this.sound.add("cheer");
    //EMITTER

    const particles = this.add.particles(0, 0, "effect", {
      x: 0,
      y: 0,
      scale: { start: 0.2, end: 0.4 },
      speed: { min: 0, max: 100 },
      lifespan: 400,
      blendMode: "ADD",
    });
    if (!this.child) return;

    audio.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      Phaser.Sound.Events.UNLOCKED;
      if (!song.isPlaying) song.play();
      else song.stop();
    });

    particles.startFollow(this.child);
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.physics.add.collider(this.player1, this.ball, this.handleCollision);
    this.physics.add.collider(this.ball, this.player2, this.handleCollision2);

    this.w = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.s = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  }

  update() {
    let rd;
    rd = Math.floor(Math.random() * 4);
    if (
      !this.cursors ||
      !this.child ||
      !this.w ||
      !this.player1 ||
      !this.player2 ||
      !this.player1.body ||
      !this.player2.body ||
      !this.platforms
    )
      return;
    this.ball?.rotate(
      this.rotX * this.collisionForce,
      this.rotY * this.collisionForce
    );
    this.hit = this.sound.add(this.SoundArray[rd]);
    this.cheer = this.sound.add(this.SoundArray2[rd]);
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
    socket.on("player1Win", (data: any) => {
      IWIN = 1;
      punteggio2 = data.result.player1;
      punteggio1 = data.result.player2;
      this.scene.start("win-lose-scene");
      socket.emit("finishedPlaying");
      this.scene.stop()
      return
    });
    socket.on("player2Win", (data: any) => {
      punteggio2 = data.result.player1;
      punteggio1 = data.result.player2;
      IWIN = 2;
      this.scene.start("win-lose-scene");
      socket.emit("finishedPlaying");
      this.scene.stop()
      return
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
      punteggio1++;
      this.child.setPosition(window.innerWidth / 2, window.innerHeight / 2);
      this.child.setVelocity(200);
      this.score_p2?.destroy(true);
      this.score_p2 = this.platforms.create(
        window.innerWidth / 2 + 200,
        window.innerHeight - window.innerHeight + 100,
        array2[punteggio1]
      );
      this.score_p2?.setScale(0.5);
      if (!this.score_p2) return;
      this.cheer?.play();
    }
    if (this.child.x > this.player2.x + 30) {
      punteggio2++;
      this.child.setPosition(window.innerWidth / 2, window.innerHeight / 2);
      this.child.setVelocity(-200);
      this.score_p1?.destroy(true);
      this.score_p1 = this.platforms.create(
        window.innerWidth / 2 - 300,
        window.innerHeight - window.innerHeight + 100,
        array[punteggio2]
      );
      this.score_p1?.setScale(0.5);
      if (!this.score_p1) return;
      this.cheer?.play();
    }
    if (this.child.y >= window.innerHeight - 25 || this.child.y <= 10) {
      if (!this.wallhit) return;
      this.wallhit.play();
    }
    if (punteggio1 == score! || punteggio2 == score!) {
      if (punteggio1 == score! && player == 1) {
        socket.emit("winner", {
          IWIN: 2,
          winner: 2,
          roomName: roomName,
          wienner: 1,
          result: { player1: punteggio2, player2: punteggio1 },
        });
      } else if (punteggio2 == score! && player == 2)
        socket.emit("winner", {
          IWIN: 1,
          winner: 1,
          roomName: roomName,
          wienner: 2,
          result: { player1: punteggio2, player2: punteggio1 },
        });
    }
  }
}
