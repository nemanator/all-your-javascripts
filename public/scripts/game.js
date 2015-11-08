function Player(game_state, x, y) {
    Phaser.Sprite.call(this, game_state.game, x, y, 'hero');
    this.game_state = game_state;

    this.facing = 'left';
    this.life = 0;
    this.isAlive = false;
    this.name = 'Player';
    this.currState = 'IDLE';

    console.log('Add player');

    this.animations.add('idle', [1], 0);
    this.animations.add('walk', [0, 1], 6, true);
    this.animations.add('jump', [7], 0);
    this.animations.play('idle');

    this.game_state.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.anchor.setTo(0.5, 0.5);

    this.cursors = this.game_state.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game_state.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.changeState = function(newState) {
  if (newState === this.currState) {
    return;
  }

  this.currState = newState;
  console.log('Change state', newState);

  switch(newState) {
    case 'IDLE':
      this.animations.play('idle');
      break;
    case 'WALKING':
      this.animations.play('walk');
      break;
    case 'JUMPING':
      this.animations.play('jump');
      break;
  }
};

Player.prototype.update = function() {
  this.game_state.game.physics.arcade.collide(this, this.game_state.layerSolid);

  if (this.cursors.left.isDown) {
      this.scale.x = 1;
      this.body.velocity.x = -200;
  }

  if (this.cursors.right.isDown) {
      this.scale.x = -1;
      this.body.velocity.x = 200;
  }

  if (this.cursors.right.isDown || this.cursors.left.isDown) {
    if (this.body.onFloor()) {
      this.changeState('WALKING');
    }
  } else {
    this.body.velocity.x = 0;
    if (this.body.onFloor()) {
      this.changeState('IDLE');
    }
  }

  if (this.jumpButton.isDown && this.body.onFloor()) {
      this.body.velocity.y = -500;
      this.changeState('JUMPING');
  }
};
function GameState() {
  Phaser.State.call(this);
}

GameState.prototype = Object.create(Phaser.State.prototype);
GameState.prototype.constructor = GameState;

GameState.prototype.preload = function() {
  'use strict';
  this.game.load.tilemap('map', 'static/map1.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.image('tiles', 'static/tiles.png');
  this.game.load.spritesheet('hero', 'static/hero.png', 34, 38, 14);
  this.game.load.image('background', 'static/map1.png');
};

GameState.prototype.create = function () {
  'use strict';
  console.log('create');

  // start physics system
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.world.setBounds(0, 0, 6400, 640);

  this.game.physics.arcade.gravity.y = 1000;

  var map = this.game.add.tilemap('map');
  map.addTilesetImage('tiles1', 'tiles');

  this.game.add.sprite(0, 0, 'background');

  this.layerSolid = map.createLayer('solid');
  //this.layerSolid.debug = true;
  this.layerSolid.resizeWorld();

  this.layerHazard = map.createLayer('hazard');
  //this.layerHazard.debug = true;
  this.layerHazard.resizeWorld();

  map.setCollisionBetween(1, 640, true, 'solid', true);
  //map.setCollisionBetween(1, 640, true, 'hazard', true);

  this.player = new Player(this, 40, 4);
  this.add.game.add.existing(this.player);
  this.game.camera.follow(this.player);
};

GameState.prototype.update = function() {
  'use strict';
};

GameState.prototype.render = function() {
  'use strict';
  //this.game.debug.bodyInfo(this.player, 16, 24);
};
(function() {
  var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'content');
  game.state.add('GameState', new GameState());
  game.state.start('GameState');
})();