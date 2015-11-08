var Bullet = function (game, key) {

  Phaser.Sprite.call(this, game, 0, 0, key);

  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

  this.anchor.set(0.5);

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;

  this.tracking = false;
  this.scaleSpeed = 0;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

  gx = gx || 0;
  gy = gy || 0;

  this.reset(x, y);
  this.scale.set(1);

  this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

  this.angle = angle;

  this.body.gravity.set(gx, gy);

};

Bullet.prototype.update = function () {

  if (this.tracking)
  {
    this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
  }

  if (this.scaleSpeed > 0)
  {
    this.scale.x += this.scaleSpeed;
    this.scale.y += this.scaleSpeed;
  }

};

////////////////////////////////////////////////////
//  A single bullet is fired in front of the ship //
////////////////////////////////////////////////////

SingleBullet = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'bullet1'), true);
    }

    return this;

};

SingleBullet.prototype = Object.create(Phaser.Group.prototype);
SingleBullet.prototype.constructor = SingleBullet;

SingleBullet.prototype.fire = function (source, facing) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y; //+ 10;

    if (facing === 'right') {
      this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    } else if (facing === 'left') {
      this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);
    }


    this.nextFire = this.game.time.time + this.fireRate;

};
function Enemy(game_state, x, y, image) {
  Phaser.Sprite.call(this, game_state.game, x, y, image);
  this.game_state = game_state;

  this.facing = 'left';
  this.name = 'Enemy';
  this.currState = 'ALERT';

  console.log('Add enemy');

  this.animations.add('idle', [1], 0);
  this.animations.add('walk', [0, 1], 6, true);
  this.animations.add('treat', [0,2,3], 2, true);
  this.animations.play('idle');

  this.game_state.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;
  this.anchor.setTo(0.5, 0.5);

  this.fx = this.game.add.audioSprite('sfx');
  this.fx.allowMultiple = true;
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.spawn = function() {
  this.reset(this.respawnPoint.x, this.respawnPoint.y);
};

Enemy.prototype.changeState = function(newState) {
  if (newState === this.currState) {
    return;
  }

  this.currState = newState;
  console.log('Change state', newState);

  switch(newState) {
    case 'IDLE':
      this.animations.play('idle');
      break;
    case 'TREAT':
      this.animations.play('treat');
      break;
  }
};

Enemy.prototype.update = function() {
  if (this.game_state.layerSolid) {
    this.game_state.game.physics.arcade.collide(this, this.game_state.layerSolid);
    this.game_state.game.physics.arcade.collide(this, this.game_state.layerHazard, function(enemy) {
      enemy.fx.play('death');
      enemy.kill();
    });
  }
};
function Player(game_state, x, y) {
  Phaser.Sprite.call(this, game_state.game, x, y, 'hero');
  this.game_state = game_state;

  this.facing = 'left';
  this.lifes = 3;
  this.isAlive = false;
  this.name = 'Player';
  this.currState = 'IDLE';
  this.respawnPoint = {
    x: 40, y: 4
  };

  this.facing = 'right'; // left
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

  this.fx = this.game.add.audioSprite('sfx');
  this.fx.allowMultiple = true;

  this.bullet = new SingleBullet(this.game_state.game);
  this.bullet.setAll('body.allowGravity', false);

  var key = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
  key.onDown.add(function(key)
  {
    this.fx.play('shot');
    this.bullet.fire(this, this.facing);
  }, this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.spawn = function() {
  this.reset(this.respawnPoint.x, this.respawnPoint.y);
};

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
      this.fx.play('squit');
      this.animations.play('jump');
      break;
  }
};

Player.prototype.update = function() {
  if (this.game_state.layerSolid) {
    this.game_state.game.physics.arcade.collide(this, this.game_state.layerSolid);
    this.game_state.game.physics.arcade.collide(this, this.game_state.layerHazard, function(player) {
      player.fx.play('death');
      player.kill();
      player.spawn();
    });
  }

  this.game_state.game.physics.arcade.collide(this.bullet, this.game_state.enemies, function(b, enemy) {
    b.kill();
    this.fx.play('squit');
    enemy.kill();
  }, null, this);

  if (this.cursors.left.isDown) {
      this.facing = 'left';
      this.scale.x = 1;
      this.body.velocity.x = -200;
  }

  if (this.cursors.right.isDown) {
      this.facing = 'right';
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
  this.game.load.spritesheet('hero', 'static/hero.png', 34, 38);
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

  var that = this;

  this.enemies = this.game.add.group();
  map.objects.enemies.forEach(function(enemy) {
    var e = new Enemy(that, enemy.x, enemy.y, 'enemy1');
    that.game.add.existing(e);
    that.enemies.add(e);
  });


  console.log(this.enemies);

  this.enemies.forEach(function(enemy) {
    console.log(enemy);
  }, this);

  this.player = new Player(this, 40, 4);
  this.add.game.add.existing(this.player);
  this.game.camera.follow(this.player);




  var music = this.game.add.audio('music');
  music.loop = true;
  music.play();

};

GameState.prototype.setupEnemies = function(enemy) {
  console.log(enemy);

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