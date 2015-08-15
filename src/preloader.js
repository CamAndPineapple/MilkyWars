
BasicGame.Preloader = function (game) {

  this.background = null;
  this.preloadBar = null;

  //this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function () {

    //  Show the loading progress bar asset we loaded in boot.js
    this.stage.backgroundColor = '#000000';

    this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
    this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);

    //  Here we load the rest of the assets our game needs.
    this.load.image('titlePage', 'build/img/titlePage.jpg');
    this.load.image('space', 'build/img/space.png');
    this.load.image('bullet', 'build/img/bullet.png');
    this.load.image('shipExhaust', 'build/img/shipExhaust.png');
    this.load.image('bomb', 'build/img/bomb.png');
    this.load.image('bombPowerUp', 'build/img/bombPowerUp.png');
    this.load.image('shieldPowerUp', 'build/img/shield.png');
    this.load.image('enemyBullet', 'build/img/enemy-bullet.png');
    this.load.image('powerup1', 'build/img/powerup1.png');
    this.load.spritesheet('greenEnemy', 'build/img/enemy.png', 40, 48);
    this.load.spritesheet('whiteEnemy', 'build/img/shooting-enemy.png', 40, 60);
    this.load.spritesheet('boss', 'build/img/boss.png', 100, 100);
    this.load.spritesheet('explosion', 'build/img/explode1.png', 128, 128);
    this.load.spritesheet('bombBlast', 'build/img/shittyBomb.png', 243, 243);
    this.load.spritesheet('player', 'build/img/player.png', 75, 83);
    this.load.audio('menuMusic', ['assets/menuSound.ogg', 'assets/menuSound.wav']);
    this.load.audio('gameMusic', ['assets/background.ogg', 'assets/background.wav']); 
    this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']);
    this.load.audio('playerExplosion', ['assets/player-explosion.ogg', 'assets/player-explosion.wav']);
    this.load.audio('powerUp', ['assets/powerup.ogg', 'assets/powerup.wav']);
    this.load.audio('enemyFire', ['assets/enemy-fire.ogg', 'assets/enemy-fire.wav']);
    this.load.audio('playerFire', ['assets/player-fire.ogg', 'assets/player-fire.wav']);

    this.time.advancedTiming = true;

  },

  create: function () {

    //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;

  },

  update: function () {

    //  You don't actually need to do this, but I find it gives a much smoother game experience.
    //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
    //  You can jump right into the menu if you want and still play the music, but you'll have a few
    //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
    //  it's best to wait for it to decode here first, then carry on.
    
    //  If you don't have any music in your game then put the game.state.start line into the create function and delete
    //  the update function completely.
    
    //if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
    //{
    //  this.ready = true;
      this.state.start('MainMenu');
    //}

  }

};
