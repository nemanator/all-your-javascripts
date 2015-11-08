function Enemy(game_state, x, y, image) {
  Phaser.Sprite.call(this, game_state.game, x, y, image);
  this.game_state = game_state;

  this.facing = 'left';
  this.name = 'Enemy';
  this.currState = 'ALERT';
  this.facing = 'left'; //right

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

Enemy.prototype.checkDistance = function() {
  var player = this.game_state.player;
  var dx = player.x - this.x;
  var dy = player.y - this.y;

  return Math.sqrt(dx * dx + dy * dy);
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

  if (this.checkDistance() <= 100) {
    //console.log('player here');
    if (this.x < this.game_state.player.x) {
      this.scale.x = -1;
      this.facing = 'right';
      this.body.velocity.x = 200;
    } else {
      this.scale.x = 1;
      this.facing = 'left';
      this.body.velocity.x = -200;
    }

  }
};