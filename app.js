window.onload = function() {

  //  Creates Phaser game and injects it into the gameContainer div.
  //  Used window.onload event, but it can be done anywhere (requireJS load, anonymous function, jQuery dom ready)
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');

  //  Adds the States of the game.
  game.state.add('Boot', BasicGame.Boot);
  game.state.add('Preloader', BasicGame.Preloader);
  game.state.add('MainMenu', BasicGame.MainMenu);
  game.state.add('Game', BasicGame.Game);

  //  Start the Boot state.
  game.state.start('Boot');

};
