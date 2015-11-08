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
  this.game.load.spritesheet('enemy1', 'static/enemy1.png', 33, 42, 4);
  this.game.load.image('background', 'static/map1.png');
  this.game.load.image('bullet1', 'static/bullet1.png');



  var audioJSON = {
      spritemap: {
          'alien death': {
              start: 1,
              end: 2,
              loop: false
          },
          'boss hit': {
              start: 3,
              end: 3.5,
              loop: false
          },
          'escape': {
              start: 4,
              end: 7.2,
              loop: false
          },
          'meow': {
              start: 8,
              end: 8.5,
              loop: false
          },
          'numkey': {
              start: 9,
              end: 9.1,
              loop: false
          },
          'ping': {
              start: 10,
              end: 11,
              loop: false
          },
          'death': {
              start: 12,
              end: 16.2,
              loop: false
          },
          'shot': {
              start: 17,
              end: 18,
              loop: false
          },
          'squit': {
              start: 19,
              end: 19.3,
              loop: false
          }
      }
  };

  this.game.load.audiosprite('sfx', 'static/fx_mixdown.ogg', null, audioJSON);
  this.game.load.audio('music', 'static/theme_1.ogg');
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
  map.setCollisionBetween(1, 640, true, 'hazard', true);

  this.player = new Player(this, 40, 4);
  this.add.game.add.existing(this.player);
  this.game.camera.follow(this.player);

  this.enemies = this.game.add.group();

  var enemy = new Enemy(this, 100, 4, 'enemy1');
  this.game.add.existing(enemy);

  this.enemies.add(enemy);

  var music = this.game.add.audio('music');
  music.loop = true;
  music.play();

};

GameState.prototype.update = function() {
  'use strict';
};

GameState.prototype.render = function() {
  'use strict';
  //this.game.debug.bodyInfo(this.player, 16, 24);
};