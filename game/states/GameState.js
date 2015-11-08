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