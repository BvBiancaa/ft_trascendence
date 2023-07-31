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
export default class PrePapaScene extends Phaser.Scene {
  constructor() {
    super("pre-papa-scene");
  }

  preload() {
    this.load.image("win", "img/youwin.png");
    this.load.image("lose", "img/youlose.png");
    this.load.audio("victory", "sounds/victory.mp3");
    this.load.audio("laugh", "sounds/laugh.mp3");
    this.load.audio("lost", "sounds/lost.mp3");
    this.load.video("died", "video/youdied.mp4")
    this.load.video("challenge", "video/challenger.mp4")
    this.load.video("intro", "video/intro.mp4")
    this.load.audio("thunder", "sounds/thunder.mp3")
  }

  create() {
    const laugh = this.sound.add('laugh')
    laugh.play()
    const thunder = this.sound.add("thunder")
    const challenger = this.add.video(window.innerWidth / 2, window.innerHeight / 2, "challenge")
    const intro = this.add.video(window.innerWidth / 2, window.innerHeight / 2, "intro")
    challenger.play()
    challenger.once(Phaser.Sound.Events.COMPLETE, () =>
    {   
        thunder.play()
        intro.play()
    })
    intro.once(Phaser.Sound.Events.COMPLETE, () =>
    {
        this.scene.start("papa-scene")

    })
  }
    
}
