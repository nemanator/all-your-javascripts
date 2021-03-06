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
    //enemy.kill();
  }, null, this);

  var touchEnemy = false;
  this.game_state.game.physics.arcade.collide(this, this.game_state.enemies, function(player, enemy) {
    //player.kill();
    this.fx.play('squit');
    touchEnemy = true;
    //player.fx.play('death');
    //player.spawn();
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

  if (this.jumpButton.isDown && (this.body.onFloor() || touchEnemy)) {
      this.body.velocity.y = -500;
      this.changeState('JUMPING');
  }
};