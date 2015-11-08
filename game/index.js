(function() {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content');
  game.state.add('GameState', new GameState());
  game.state.start('GameState');
})();