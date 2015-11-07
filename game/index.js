import {
  GameState,
  MenuState
} from './states';

class Game extends Phaser.Game {

	constructor() {
		super(800, 600, Phaser.AUTO, 'content', null);
		this.state.add('GameState', GameState, false);
    this.state.add('MenuState', MenuState, false);
		this.state.start('GameState');
	}

}

const game = new Game();