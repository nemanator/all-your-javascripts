'use strict';

export class GameState extends Phaser.State {

	create() {
    this.state.start('MenuState');
	}
}