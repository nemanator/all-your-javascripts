'use strict';

import RainbowText from '../objects/RainbowText';

class GameState extends Phaser.State {

	create() {
		const center = { x: this.game.world.centerX, y: this.game.world.centerY };
	}

}

export default GameState;