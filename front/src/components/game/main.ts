	import Phaser from 'phaser'
	import HelloWorldScene from './HelloWorldScene'
	import CustomButtonScene from './CustomButtonScene'
	declare global {
		var currentPlayerChoice: string | null;
	  }
	import PlayerSelectionScene from './PlayerSelection'
import ClassicPongScene from './ClassicPong';

	const config: Phaser.Types.Core.GameConfig = {
		type: Phaser.AUTO,
		//parent: 'app',
		width: window.innerWidth - 20,
		height: window.innerHeight - 15,
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 1 },
			 /* 	debug: true  */
			},
		},	
		scene: [CustomButtonScene, PlayerSelectionScene, HelloWorldScene, ClassicPongScene],
	}

	export default new Phaser.Game(config)
