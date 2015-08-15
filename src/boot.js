var BasicGame = {

  // game settings

  SPACE_SCROLL_SPEED: 50,
  POWERUP_VELOCITY: 200,
  ENEMY_REWARD: 100,
  SHOOTER_REWARD: 400,
  BOSS_REWARD: 10000,
  POWERUP_REWARD: 500,
  PLAYER_EXTRA_LIVES: 4,
  INSTRUCTION_EXPIRE: Phaser.Timer.SECOND * 2,
  RETURN_MESSAGE_DELAY: Phaser.Timer.SECOND * 2,

  ENEMY_WEAPON_DROP_RATE: 1, 
  SHOOTER_WEAPON_DROP_RATE: 0.07,
  BOMB_DROP_RATE: 0.1,
  SHIELD_DROP_RATE: 0.08,

  BOSS_DROP_RATE: 0,

  // player settings

  PLAYER_ACCELERATION: 3000,
  PLAYER_DRAG: 3000,
  PLAYER_MAXSPEED: 800,
  PLAYER_BULLET_VELOCITY: 600,
  BULLET_DAMAGE: 1,
  BOMB_DAMAGE: 2,
  CRASH_DAMAGE: 5,
  PLAYER_SHIELD_TIME: Phaser.Timer.SECOND * 3,
  PLAYER_GHOST_TIME: Phaser.Timer.SECOND * 3,

  // enemy settings

  ENEMY_MIN_Y_VELOCITY: 100,
  ENEMY_MAX_Y_VELOCITY: 150,
  SHOOTER_MIN_VELOCITY: 100,
  SHOOTER_MAX_VELOCITY: 180,  

  SPAWN_ENEMY_DELAY: Phaser.Timer.SECOND * 3,
  SPAWN_SHOOTER_DELAY: Phaser.Timer.SECOND * 3,

  ENEMY_BULLET_VELOCITY: 200,
  SHOT_DELAY: Phaser.Timer.SECOND * .2,
  SHOOTER_SHOT_DELAY: Phaser.Timer.SECOND * 2,
  
  ENEMY_HEALTH: 2,
  SHOOTER_HEALTH: 5,
  

  // boss settings

  BOSS_Y_VELOCITY: 15,
  BOSS_X_VELOCITY: 200,
  BOSS_SHOT_DELAY: Phaser.Timer.SECOND,
  BOSS_HEALTH: 800,
  BOSS_APPROACH: 80000
  
};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

  preload: function () {

    //  Load assets for preloader.js
    this.load.image('preloaderBar', 'build/img/preloader-bar.png');
    this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']); 

    // Advanced profiling, including the fps rate, fps min/max and msMin/msMax are updated.
    this.time.advancedTiming = true; 

  },

  create: function () {

    //  Set this to 1 unless you know your game needs multi-touch
    this.input.maxPointers = 1;

    // Uncomment next line if you want game to keep playing when tab is not selected
    // this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop) {
      //  Desktop specific settings can go in here
    } else {
      //  Same goes for mobile settings.
      //  In this case I'm saying "scale the game, no lower than 480x260 and no higher than 1024x768"
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(480, 260, 1024, 768);
      this.scale.forceLandscape = true;
    }
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
      this.scale.setScreenSize(true);

    //  By this point the preloader assets have loaded to the cache and game settings are set
    //  Now preloader.js state starts
    this.state.start('Preloader');

  }

};
