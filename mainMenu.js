
BasicGame.MainMenu = function (game) {

  this.music = null;
  this.playButton = null;

};

BasicGame.MainMenu.prototype = {

  create: function () {

 

    this.space = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'titlePage');

    this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2 - 175, "Our planet's last hope.", { font: "20px monospace", fill: "#7CFC00" });
    this.loadingText.anchor.setTo(0.5, 0.5);
    this.add.text(this.game.width / 2, this.game.height - 220, "Press SPACEBAR to start", { font: "19px monospace", fill: "#fff", align: "center"}).anchor.setTo(0.5, 0.5);
    this.add.text(this.game.width / 2, this.game.height - 80, "Beautiful Powerups Copyright Mitchell Deaner", { font: "15px monospace", fill: "#fff", align: "center"}).anchor.setTo(0.5, 0.5);
    
  },

  update: function () {

    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.activePointer.isDown) {
      
      this.startGame();
      
    }
    //  Do some nice funky main menu effect here

  },

  startGame: function (pointer) {

    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    // this.music.stop();


    //  And start the actual game
    this.state.start('Game');

  }

};
