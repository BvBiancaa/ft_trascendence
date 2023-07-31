import Phaser from "phaser";
import { useRouter } from "vue-router";
let TeamChoice;
export { TeamChoice };
let score;
export { score };
let speed;
export { speed };
let roomName: string;
const router = useRouter();
export { roomName };
export default class YouSuck extends Phaser.Scene {
  constructor() {
    super("YouSuck-scene");
  }
  private platforms?: Phaser.Physics.Arcade.StaticGroup;

  preload() {
    this.load.image("win", "img/youwin.png");
    this.load.image("lose", "img/youlose.png");
    this.load.audio("victory", "sounds/victory.mp3");
    this.load.audio("laugh", "sounds/laugh.mp3");
    this.load.audio("lost", "sounds/lost.mp3");
    this.load.video("died", "video/youdied.mp4")
    this.load.video("challenge", "video/challenger.mp4")
  }

  create() {
    const laugh = this.sound.add('laugh')
    laugh.play()
    const died = this.add.video(window.innerWidth / 2, window.innerHeight /2, "died")
    died.play()
    setTimeout(() => {
      this.game.destroy(true)
      router.push("/");
    }, 5000);

  }
    
}
