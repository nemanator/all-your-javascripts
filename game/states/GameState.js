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

  this.layer1 = map.createLayer('layer2');
  this.layer1.debug = true;
  this.layer1.resizeWorld();

  this.layer2 = map.createLayer('layer1');
  this.layer2.resizeWorld();

  map.setCollision([129, 130], true, "layer1", true);

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