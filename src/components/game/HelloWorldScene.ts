import Phaser, { Sound } from 'phaser';
import { currentPlayerChoice } from './PlayerSelection';
import { score } from './CustomButtonScene';
import { speed } from './CustomButtonScene';
import CustomButton from './CustomButton';
export default class PongScene extends Phaser.Scene {

	handleCollision = () =>
	{	
		this.random = Math.floor(Math.random() * 400)
			this.rd = Math.floor(Math.random() * 5)
			if (!this.ball || !this.player1 || !this.child || !this.player2 || !this.hit)
			return 
			// Calculate the bounce angle based on the collision point
			const collisionPoint = this.child.x - this.player1.x;
			const normalizedCollisionPoint = collisionPoint * (this.player1.width / 2) ;
			let bounceAngle = normalizedCollisionPoint * Math.PI / 6; // Adjust the angle as needed
			if (bounceAngle == 3.0)
			bounceAngle = 2.8
			if (this.random < 200)
			this.ball.setVelocity((700 * speed!)  * (bounceAngle / 200), -300)	
			else		
			this.ball.setVelocity((700 * speed!) * (bounceAngle / 200), 300)	
			if (!this.player1.body)
				return
			this.player1.body.immovable = true
			if (!this.goalSounds)
				return 
			this.goalSounds[this.rd].play()
		}
		handleCollision2 = () =>
		{	
			this.random = Math.floor(Math.random() * 400)
			this.rd = Math.floor(Math.random() * 5)
				if (!this.ball || !this.player1 || !this.child || !this.player2 || !this.hit)
				return 
				// Calculate the bounce angle based on the collision point
				const collisionPoint = this.child.x - this.player2.x;
				const normalizedCollisionPoint = collisionPoint / (this.player2.width / 2);
				let bounceAngle = normalizedCollisionPoint * Math.PI / 4; // Adjust the angle as needed
			
				if (bounceAngle == 3.0)
				bounceAngle = 2.8
			
				if (this.random <  200)
				this.ball.setVelocity((-700 * speed!) * ((bounceAngle / 2) * -1.5), -300)
				else
				this.ball.setVelocity((-700 * speed!) * ((bounceAngle / 2) * -1.5), 300)
		if (!this.player2.body)
			return
		this.player2.body.immovable = true;
		if (!this.goalSounds)
			return
		this.goalSounds[this.rd].play()

	}



	private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private player1?: Phaser.Physics.Arcade.Sprite;
	private player2?: Phaser.Physics.Arcade.Sprite;
	private score1?: Phaser.Physics.Arcade.StaticGroup;
	private score2?: Phaser.Physics.Arcade.StaticGroup;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
	private ball?: Phaser.Physics.Arcade.Group;
	private rotX = 0.02
	private rotY = 0.02
	private child?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
	private collisionForce = 3
	private score_p1?: Phaser.Physics.Arcade.Sprite
	private score_p2?: Phaser.Physics.Arcade.Sprite
	private punteggio1 = 0
	private punteggio2 = 0
	private hit?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
	private cheer?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
	private hurt?: Phaser.Sound.BaseSound
	private w: any
	private s: any
	private r: any
	private array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];	
	private array2 = ['0.2', '1.2', '2.2', '3.2', '4.2', '5.2', '6.2', '7.2', '8.2', '9.2'];
	private SoundArray = ['gS1', 'gS2', 'gS3', 'gS4', 'hit'];
	private SoundArray2 = ['cheer', 'cheer2', 'cheer5', 'cheer4', 'cheer3'];
	private SoundArray3 = ['hurt', 'hurt2', 'hurt3', 'hurt4'];
	private goalSounds?: Array<Sound.NoAudioSound | Sound.HTML5AudioSound | Sound.WebAudioSound>;
	private cheerSounds?: Array<Sound.NoAudioSound | Sound.HTML5AudioSound | Sound.WebAudioSound>;
	private random = Math.floor(Math.random() * 400)
	private rd = Math.floor(Math.random() * 5)
    constructor() {
        super('pong-scene');
    }

    preload() {


		//GAME SOUNDS
		this.load.audio('hit', 'sounds/hit.mp3')
		this.load.audio('gS1', 'sounds/gS1.mp3')
		this.load.audio('gS2', 'sounds/gS2.mp3')
		this.load.audio('gS3', 'sounds/gS3.mp3')
		this.load.audio('gS4', 'sounds/gS4.mp3')
		this.load.audio('cheer', 'sounds/cheer.mp3')
		this.load.audio('cheer2', 'sounds/cheer2.mp3')
		this.load.audio('cheer3', 'sounds/cheer3.mp3')
		this.load.audio('cheer4', 'sounds/cheer4.mp3')
		this.load.audio('cheer5', 'sounds/cheer5.mp3')
		this.load.audio('hurt', 'sounds/hurt.mp3')
		this.load.audio('hurt2', 'sounds/hurt2.mp3')		
		this.load.audio('hurt3', 'sounds/hurt3.mp3')
		this.load.image('effect', 'img/effect.png')
		this.load.audio('hurt4', 'sounds/hurt4.mp3')
		//IMAGES

		this.load.image('soviet', 'img/soviet.png');
        this.load.image('duce', 'img/mussolini.png');
		this.load.image('silvio', 'img/silvio.png');
        this.load.image('mao', 'img/mao.png')
		this.load.image('vanni', 'img/vanni.png')
        this.load.image('ben', 'img/ben.png')
		this.load.image('paccia', 'img/paccia.png')
		this.load.image('hitla', 'img/hitla.png')
        this.load.image('p1', 'img/player_one.png');
        this.load.image('p2', 'img/player_two.png');
		this.load.image('0','img/zero.png')
		this.load.image('1','img/uno.png')
		this.load.image('2','img/due.png')
		this.load.image('3','img/tre.png')
		this.load.image('4','img/quattro.png')
		this.load.image('5','img/cinque.png')
		this.load.image('6','img/sei.png')
		this.load.image('7','img/sette.png')
		this.load.image('8','img/otto.png')
		this.load.image('9','img/nove.png')
		this.load.image('10','img/dieci.png')
		this.load.image('mid', 'img/middle.png')
		this.load.image('ball', 'img/ball.png')
		this.load.image('fire', 'img/fire.png')
		this.load.image('goal', 'img/goalie.png')
		this.load.image('goalarea', 'img/goalarea.png')
		
		
		//player2 score
		this.load.audio('intro1', 'sounds/arcade.mp3')
		this.load.image('0.2','img/02.png')
		this.load.image('1.2','img/uno2.png')
		this.load.image('2.2','img/due2.png')
		this.load.image('3.2','img/tre2.png')
		this.load.image('4.2','img/quattro2.png')
		this.load.image('5.2','img/cinque2.png')
		this.load.image('6.2','img/sei2.png')
		this.load.image('7.2','img/sette2.png')
		this.load.image('8.2','img/otto2.png')
		this.load.image('9.2','img/nove2.png')
		this.load.image('on', 'img/on.png')
        this.load.image('on2', 'img/on2.png')
		
    }
	
    create() {

		this.goalSounds = [];
		this.cheerSounds = []

		for (let i = 0; i < this.SoundArray.length; i++)
		{
			const sound = this.sound.add(this.SoundArray[i]);
			this.goalSounds.push(sound);
		}
		for (let i = 0; i < this.SoundArray2.length;i++)
		{
			const sound = this.sound.add(this.SoundArray2[i])
			this.cheerSounds.push(sound)
		}


        this.platforms = this.physics.add.staticGroup();

		const audio = new CustomButton(this, window.innerWidth / window.innerWidth + 200, window.innerHeight / window.innerHeight + 100, 'on', 'on2' )
		const song = this.sound.add('intro1')
		
		this.add.existing(audio)
		const mid = this.platforms.create(window.innerWidth / 2 - 50	, window.innerHeight / 2, 'mid') as Phaser.Physics.Arcade.Sprite
		mid.setScale(1.5)
		const duce = this.platforms.create(window.innerWidth / 6, window.innerHeight / 2, currentPlayerChoice!) as Phaser.Physics.Arcade.Sprite;
		const stalin = this.platforms.create(window.innerWidth - 400, window.innerHeight / 2, 'paccia') as Phaser.Physics.Arcade.Sprite;

		duce.setScale(1).refreshBody();
        stalin.setScale(1).refreshBody();



		// SET THE PLAYER 1 SCORE
		this.score1 = this.physics.add.staticGroup();
		this.score_p1 =this.platforms.create(window.innerWidth / 2 - 300, window.innerHeight - window.innerHeight + 100 , '0') as Phaser.Physics.Arcade.Sprite
		this.score_p1.setScale(0.5).refreshBody();
		
		//SET THE PLAYER 2 SCORE
		this.score2 = this.physics.add.staticGroup();
		this.score_p2 =this.platforms.create(window.innerWidth / 2 + 200, window.innerHeight - window.innerHeight + 100 , '0') as Phaser.Physics.Arcade.Sprite
		this.score_p2.setScale(0.5).refreshBody();
		// PLAYER1 && PLAYER 2
		this.player1 = this.physics.add.sprite(window.innerWidth - window.innerWidth + 100, window.innerHeight / 2 - 15, 'p1');
		this.player1.setBounce(0, 0);
		this.player1.setCollideWorldBounds(true);
		this.player2 = this.physics.add.sprite(window.innerWidth - 100, window.innerHeight / 2 - 15, 'p2');
        this.player2.setBounce(0, 0);
        this.player2.setCollideWorldBounds(true);
		
		//ALLING ? 
		//this.aGrid = new AlingGrid ({scene:this, rows: 11, cols: 11})
		// BALL CREATION
		const x = window.innerWidth / 2 - 50
		const y = window.innerHeight / 2 - 15
		this.ball = this.physics.add.group(
			{
				key: 'ball',
				setXY: { x, y , stepX: 70}
			}
		)	
			this.ball.children.iterate((c: Phaser.GameObjects.GameObject) => {
				this.child = c as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
				this.child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
				this.child.setBounceX(Phaser.Math.FloatBetween(1, 1.6));
				this.child.setScale(0.75);
				this.child.setCollideWorldBounds(true);
				this.child.setVelocityX(400);
				return null;
			});
		
		this.ball.rotate(this.rotX, this.rotY)

		this.hit = this.sound.add('hit')
		this.cheer = this.sound.add('cheer')
		//EMITTER 

		const particles = this.add.particles(0, 0, 'effect', {
			x: 0,
			y: 0,
			scale: { start: 0.2,  end: 0.4},
			speed: { min: 0, max: 100 },
			lifespan: 400,
			blendMode: 'ADD',
		});
		if (!this.child )
				return 	
				
		audio.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () =>
        {  
            Phaser.Sound.Events.UNLOCKED
			if (!song.isPlaying)
				song.play()
			else
			song.stop()
			

        })
		
		particles.startFollow(this.child);
		this.cursors = this.input.keyboard?.createCursorKeys();
		this.w = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W)
		this.s = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)
		this.r = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    }
	
    update() 
	{	
		if (!this.ball || !this.cursors || !this.child || !this.w || !this.player1 || !this.player2 || !this.player1.body || !this.player2.body || !this.platforms) return;
		
		this.player2.body.immovable = true;
		this.player1.body.immovable = true;
        if (this.cursors.up?.isDown) this.player2?.setVelocityY(-560)
		else if (this.cursors.down?.isDown) this.player2?.setVelocityY(560);
		
		if (this.w.isDown) this.player1?.setVelocityY(-560)
		else if (this.s.isDown) this.player1?.setVelocityY(560)

		else if (this.r.isDown)  
		{
			this.child.setPosition(window.innerWidth / 2, window.innerHeight / 2)
			if (this.random % 2 == 0)
			this.child.setVelocity(-200)
			else
			this.child.setVelocity(200)
		}
		else if (!this.cursors.up?.isDown && !this.cursors.down?.isDown)
		{
			this.player1?.setVelocity(0)
			this.player2?.setVelocity(0)
		}
		if (this.cursors.up?.isDown && this.player1?.body?.touching.down)
				this.player1.setVelocityY(-330)
		this.physics.add.collider(this.ball, this.player1, this.handleCollision)
		this.physics.add.collider(this.ball, this.player2, this.handleCollision2)		
		this.ball.rotate(this.rotX * this.collisionForce, this.rotY * this.collisionForce)
		if (this.child.x < 25)
		{
			this.punteggio1++;
			this.child.setPosition(window.innerWidth / 2, window.innerHeight / 2)
			this.child.setVelocity(200)
			this.score_p2?.destroy(true)
			this.score_p2 = this.platforms.create(window.innerWidth / 2 + 200, window.innerHeight - window.innerHeight + 100 , this.array2[this.punteggio1])
			if (!this.score_p2)
				return
			this.score_p2.setScale(0.5).refreshBody();
			if (!this.cheerSounds)
				return
			this.cheerSounds[this.rd].play()
			
		}
		if (this.child.x > window.innerWidth - 55)
		{
			this.punteggio2++
			this.child.setPosition(window.innerWidth / 2, window.innerHeight / 2)
			this.child.setVelocity(-200)
			this.score_p1?.destroy(true)
			this.score_p1 = this.platforms.create(window.innerWidth / 2 - 300, window.innerHeight - window.innerHeight + 100 , this.array[this.punteggio2])
			if (!this.score_p1)
				return
			this.score_p1.setScale(0.5).refreshBody();
			if (!this.cheerSounds)
				return
			this.cheerSounds[this.rd].play()
			
		}
		if (this.punteggio1 == score! || this.punteggio2 == score!)
		{
			if (!this.hurt)
				return
			this.hurt.play()
			this.scene.pause()
		}
    }
}
