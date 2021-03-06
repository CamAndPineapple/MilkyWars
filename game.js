
BasicGame.Game = function (game) {
  
};


BasicGame.Game.prototype = {


  create: function () {
    this.setupBackground();
    this.setupPlayer();
    this.setupShipExhaust();
    this.setupEnemies();
    this.setupBullets();
    this.setupBomb();
    this.setupExplosions();
    this.setupBombBlast();
    this.setupPlayerIcons();
    this.setupText();
    this.setupAudio();


    // General Keys

    this.cursors = this.input.keyboard.createCursorKeys();
    this.muteKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
    this.unMuteKey = this.input.keyboard.addKey(Phaser.Keyboard.N);
    
    // Action Keys

    this.bombKey = this.input.keyboard.addKey(Phaser.Keyboard.F);
    this.shieldKey = this.input.keyboard.addKey(Phaser.Keyboard.D);
  },

  update: function () {
    this.checkCollisions();
    this.spawnEnemies();
    this.enemyFire();
    this.processPlayerInput();
    this.processDelayedEffects();

  },

  render: function() {
    //this.game.debug.body(this.player);
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
  },

  
  // create()- related functions
 
  setupBackground: function () {
    this.space = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    this.space.autoScroll(0, BasicGame.SPACE_SCROLL_SPEED);

  },


  setupPlayer: function () {

    this.player = this.add.sprite(this.game.width / 2, this.game.height - 130, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add('fly', [ 0, 1, 2 ], 20, true);
    this.player.animations.add('ghost', [ 3, 1, 3, 2 ], 20, true);
    this.player.animations.add('shield', [4, 5, 6], 20, true);
    this.player.play('fly');
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;
    // hitbox, centered a little bit higher than the center
    this.player.body.setSize(30, 45, 0, 0);

    this.player.body.maxVelocity.setTo(BasicGame.PLAYER_MAXSPEED, BasicGame.PLAYER_MAXSPEED);
    this.player.body.drag.setTo(BasicGame.PLAYER_DRAG, BasicGame.PLAYER_DRAG);
   
  },

  setupShipExhaust: function () {

    var shipExhaust;
    this.shipExhaust = this.game.add.emitter(this.player.x, this.player.y, 400);
    this.shipExhaust.makeParticles('shipExhaust'); 
    this.shipExhaust.width = 20;
    this.shipExhaust.setXSpeed(30, -30);
    this.shipExhaust.setYSpeed(200, 180);
    this.shipExhaust.setRotation(50,-50);
    this.shipExhaust.setAlpha(1, 0.01, 800);
    this.shipExhaust.setScale(1, 1, 1, 1, 8000, Phaser.Easing.Quintic.Out);
    this.shipExhaust.start(false, 5000, 10);

  },

  setupEnemies: function () {

    this.enemyPool = this.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyPool.createMultiple(500, 'greenEnemy');
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.enemyPool.setAll('reward', BasicGame.ENEMY_REWARD, false, false, 0, true);
    this.enemyPool.setAll('dropRate', BasicGame.ENEMY_WEAPON_DROP_RATE, false, false, 0, true);
    this.enemyPool.setAll('bombDropRate', BasicGame.BOMB_DROP_RATE, false, false, 0, true); 
    this.enemyPool.setAll('shieldDropRate', BasicGame.SHIELD_DROP_RATE, false, false, 0, true); 

    // Set the animation for each sprite
    this.enemyPool.forEach(function (enemy) {
      enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
      enemy.animations.add('hit', [ 3, 1, 3, 2 ], 20, false);
      enemy.events.onAnimationComplete.add( function (e) {
        e.play('fly');
      }, this);
    });

    this.nextEnemyAt = 0;
    this.enemyDelay = BasicGame.SPAWN_ENEMY_DELAY;

    this.shooterPool = this.add.group();
    this.shooterPool.enableBody = true;
    this.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.shooterPool.createMultiple(500, 'whiteEnemy');
    this.shooterPool.setAll('anchor.x', 0.5);
    this.shooterPool.setAll('anchor.y', 0.5);
    this.shooterPool.setAll('outOfBoundsKill', true);
    this.shooterPool.setAll('checkWorldBounds', true);
    this.shooterPool.setAll('reward', BasicGame.SHOOTER_REWARD, false, false, 0, true);
    this.shooterPool.setAll('dropRate', BasicGame.SHOOTER_WEAPON_DROP_RATE, false, false, 0, true);
    this.shooterPool.setAll('bombDropRate', BasicGame.BOMB_DROP_RATE, false, false, 0, true);
    this.shooterPool.setAll('shieldDropRate', BasicGame.SHIELD_DROP_RATE, false, false, 0, true); 

    // start spawning 5 seconds into the game
    this.nextShooterAt = this.time.now + Phaser.Timer.SECOND * 5;
    this.shooterDelay = BasicGame.SPAWN_SHOOTER_DELAY;

    this.bossPool = this.add.group();
    this.bossPool.enableBody = true;
    this.bossPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.bossPool.createMultiple(1, 'boss');
    this.bossPool.setAll('anchor.x', 0.5);
    this.bossPool.setAll('anchor.y', 0.5);
    this.bossPool.setAll('outOfBoundsKill', true);
    this.bossPool.setAll('checkWorldBounds', true);
    this.bossPool.setAll('reward', BasicGame.BOSS_REWARD, false, false, 0, true);
    this.bossPool.setAll('dropRate', BasicGame.BOSS_DROP_RATE, false, false, 0, true);



    // Set the animation for each sprite
    this.bossPool.forEach(function (enemy) {
      enemy.animations.add('hit', [1, 0], 20, false);
    
    });

    this.boss = this.bossPool.getTop();
    this.bossApproaching = false;
  },

  setupBullets: function () {
    this.enemyBulletPool = this.add.group();
    this.enemyBulletPool.enableBody = true;
    this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBulletPool.createMultiple(500, 'enemyBullet');
    this.enemyBulletPool.setAll('anchor.x', 0.5);
    this.enemyBulletPool.setAll('anchor.y', 0.5);
    this.enemyBulletPool.setAll('outOfBoundsKill', true);
    this.enemyBulletPool.setAll('checkWorldBounds', true);
    this.enemyBulletPool.setAll('reward', 0, false, false, 0, true);

    // Add an empty sprite group into our game
    this.bulletPool = this.add.group();

    // Enable physics to the whole sprite group
    this.bulletPool.enableBody = true;
    this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;

    // Add 100 'bullet' sprites in the group.
    // By default this uses the first frame of the sprite sheet and
    // sets the initial state as non-existing (i.e. killed/dead)
    this.bulletPool.createMultiple(100, 'bullet');

    // Sets anchors of all sprites
    this.bulletPool.setAll('anchor.x', 0.5);
    this.bulletPool.setAll('anchor.y', 0.5);

    // Automatically kill the bullet sprites when they go out of bounds
    this.bulletPool.setAll('outOfBoundsKill', true);
    this.bulletPool.setAll('checkWorldBounds', true);

    this.nextShotAt = 0;
    this.shotDelay = BasicGame.SHOT_DELAY;
  },

  setupBomb: function () {
    this.bombPool = this.add.group();
    this.bombPool.enableBody = true;
    this.bombPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.bombPool.createMultiple(10, 'bomb');
    this.bombPool.setAll('anchor.x', 0.5);
    this.bombPool.setAll('anchor.y', 0.5);
    this.bombPool.setAll('outOfBoundsKill', true);
    this.bombPool.setAll('checkWorldBounds', true);

    this.nextBombAt = 0;
    this.bombShotDelay = Phaser.Timer.SECOND;
    

  },

  setupExplosions: function () {
    this.explosionPool = this.add.group();
    this.explosionPool.enableBody = true;
    this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosionPool.createMultiple(100, 'explosion');
    this.explosionPool.setAll('anchor.x', 0.5);
    this.explosionPool.setAll('anchor.y', 0.5);
    this.explosionPool.forEach(function (explosion) {
      explosion.animations.add('boom');
    });
  },

  setupBombBlast: function () {
    this.bombBlastPool = this.add.group();
    this.bombBlastPool.enableBody = true; 
    this.bombBlastPool.physicsBodyType = Phaser.Physics.ARCADE; 
    this.bombBlastPool.createMultiple(10, 'bombBlast'); 
    this.bombBlastPool.setAll('anchor.x', 0.5);
    this.bombBlastPool.setAll('anchor.y', 0.5);
    this.bombBlastPool.forEach(function (bombExplosion) {
      bombExplosion.animations.add('bang', [0, 1, 2], 5, true);
    });
 },

  setupPlayerIcons: function () {
    this.powerUpPool = this.add.group();
    this.powerUpPool.enableBody = true;
    this.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.powerUpPool.createMultiple(5, 'powerup1');
    this.powerUpPool.setAll('anchor.x', 0.5);
    this.powerUpPool.setAll('anchor.y', 0.5);
    this.powerUpPool.setAll('outOfBoundsKill', true);
    this.powerUpPool.setAll('checkWorldBounds', true);
    this.powerUpPool.setAll('reward', BasicGame.POWERUP_REWARD, false, false, 0, true);

    this.bombPowerUpPool = this.add.group();
    this.bombPowerUpPool.enableBody = true;
    this.bombPowerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.bombPowerUpPool.createMultiple(1, 'bombPowerUp');
    this.bombPowerUpPool.setAll('anchor.x', 0.5);
    this.bombPowerUpPool.setAll('anchor.y', 0.5);
    this.bombPowerUpPool.setAll('outOfBoundsKill', true);
    this.bombPowerUpPool.setAll('checkWorldBounds', true);
    this.bombPowerUpPool.setAll('reward', BasicGame.POWERUP_REWARD, false, false, 0, true);

    this.shieldPowerUpPool = this.add.group();
    this.shieldPowerUpPool.enableBody = true;
    this.shieldPowerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.shieldPowerUpPool.createMultiple(1, 'shieldPowerUp');
    this.shieldPowerUpPool.setAll('anchor.x', 0.5);
    this.shieldPowerUpPool.setAll('anchor.y', 0.5);
    this.shieldPowerUpPool.setAll('outOfBoundsKill', true);
    this.shieldPowerUpPool.setAll('checkWorldBounds', true);
    this.shieldPowerUpPool.setAll('reward', BasicGame.POWERUP_REWARD, false, false, 0, true);





    this.lives = this.add.group();
    // calculate location of first life icon
    var firstLifeIconX = this.game.width - 10 - (BasicGame.PLAYER_EXTRA_LIVES * 30);
    for (var i = 0; i < BasicGame.PLAYER_EXTRA_LIVES; i++) {
      var life = this.lives.create(firstLifeIconX + (30 * i), 30, 'player');
      life.scale.setTo(0.5, 0.5);
      life.anchor.setTo(0.5, 0.5);
    }
  },

  setupText: function () {

// instructions

    this.instructions = this.add.text(
      this.game.width / 2, 
      this.game.height - 50,
      'Use Arrow Keys to Move, Press SPACEBAR to Fire\n' + 
      'Tapping/clicking does both', 
      { font: '20px monospace', fill: '#BF55EC', align: 'center' }
    );
    this.instructions.anchor.setTo(0.5, 0.5);
    this.instExpire = this.time.now + BasicGame.INSTRUCTION_EXPIRE;

// HUD (Heads Up Display text)

    this.score = 0;
    this.highscoreText = this.add.text(this.game.width - 770, 10, 'Score',
    { font: '20px monospace', fill: '#fff', align: 'center' } 
    );
    this.scoreText = this.add.text(
      this.game.width - 740, 50, '' + this.score, 
      { font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.scoreText.anchor.setTo(0.5, 0.5);

    this.weaponLevel = 0;
    this.powerupText = this.add.text(
      this.game.width - 80, 60, 'PowerUp: ' + this.weaponLevel, 
      { font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.powerupText.anchor.setTo(0.5, 0.5);

    this.bombCount = 0;
    this.bombPowerupText = this.add.text(
      this.game.width - 68, 110, 'Bombs: ' + this.bombCount,
      { font: '20px monospace', fill: '#fff', align: 'center'}
    );
    this.bombPowerupText.anchor.setTo(0.5, 0.5);

    this.shieldCount = 0;
    this.shieldPowerupText = this.add.text(
      this.game.width - 80, 85, 'Shields: ' + this.shieldCount,
      { font: '20px monospace', fill: '#fff', align: 'center'}
    );
    this.shieldPowerupText.anchor.setTo(0.5, 0.5);

// Text when boss approaches

    this.bossHealthText = this.add.text(
      this.game.width/2, 10, '', 
      { font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.bossHealthText.anchor.setTo(0.5, 0.5);
    
  },

  setupAudio: function () {
    this.explosionSFX = this.add.audio('explosion');
    this.playerExplosionSFX = this.add.audio('playerExplosion');
    this.enemyFireSFX = this.add.audio('enemyFire');
    this.playerFireSFX = this.add.audio('playerFire');
    this.powerUpSFX = this.add.audio('powerUp');
    this.soundtrack = this.add.audio('gameMusic');
    this.soundtrack.play('', 0, 0.8, true);  


  },


  // update() functions
  
  checkCollisions: function () {
    this.physics.arcade.overlap(
      this.bulletPool, this.enemyPool, this.enemyHit, null, this
    );

    this.physics.arcade.overlap(
      this.bulletPool, this.shooterPool, this.enemyHit, null, this
    );

    this.physics.arcade.overlap(
      this.bombPool, this.enemyPool, this.bombHit, null, this
    );

    this.physics.arcade.overlap(
      this.bombPool, this.shooterPool, this.bombHit, null, this
    );

    this.physics.arcade.overlap(
      this.bombBlastPool, this.enemyPool, this.bombBlastHit, null, this
    );

    this.physics.arcade.overlap(
      this.bombBlastPool, this.shooterPool, this.bombBlastHit, null, this
    );

    this.physics.arcade.overlap(
      this.player, this.enemyPool, this.playerHit, null, this
    );

    this.physics.arcade.overlap(
      this.player, this.shooterPool, this.playerHit, null, this
    );

    this.physics.arcade.overlap(
      this.player, this.enemyBulletPool, this.playerHit, null, this
    );

    this.physics.arcade.overlap(
      this.player, this.powerUpPool, this.playerGetsWeaponPowerUp, null, this
    );

    this.physics.arcade.overlap(
      this.player, this.bombPowerUpPool, this.playerGetsBomb, null, this
      );

    this.physics.arcade.overlap(
      this.player, this.shieldPowerUpPool, this.playerGetsShield, null, this
      );

    if (this.bossApproaching === false) {
      this.physics.arcade.overlap(
        this.bulletPool, this.bossPool, this.enemyHit, null, this
      );

      this.physics.arcade.overlap(
        this.bombPool, this.bossPool, this.bombHit, null, this
      );

      this.physics.arcade.overlap(
        this.bombBlastPool, this.bossPool, this.bombBlastHit, null, this
      );

      this.physics.arcade.overlap(
        this.player, this.bossPool, this.playerHit, null, this
      );
    }
  },

  spawnEnemies: function () {

    var shooterEnemyLaunched = false;
    if (this.score > 500) {
      shooterEnemyLaunched = true;
    }

    if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
      this.nextEnemyAt = this.time.now + this.enemyDelay;
      var enemy = this.enemyPool.getFirstExists(false);
      // spawn at a random location top of the screen
      enemy.reset(
        this.rnd.integerInRange(20, this.game.width - 20), 0,
        BasicGame.ENEMY_HEALTH
      );
      // also randomize the speed
      enemy.body.velocity.y = this.rnd.integerInRange(
        BasicGame.ENEMY_MIN_Y_VELOCITY, BasicGame.ENEMY_MAX_Y_VELOCITY
      );
      enemy.play('fly');
    } else if (this.score >= 50000 && this.score <= 55000) {
      this.nextEnemyAt = this.time.now + Phaser.Timer.SECOND - 10;
      var enemy = this.enemyPool.getFirstExists(false);
      // spawn at a random location top of the screen
      enemy.reset(
        this.rnd.integerInRange(20, this.game.width - 20), 0,
        BasicGame.ENEMY_HEALTH
      );
      // also randomize the speed
      enemy.body.velocity.y = this.rnd.integerInRange(
        BasicGame.ENEMY_MIN_Y_VELOCITY, BasicGame.ENEMY_MAX_Y_VELOCITY
      );
      enemy.play('fly');
    } 

    if (shooterEnemyLaunched === true && this.nextShooterAt < this.time.now && this.shooterPool.countDead() > 0) {
      this.nextShooterAt = this.time.now + this.shooterDelay;
      var shooter = this.shooterPool.getFirstExists(false);

      // spawn at a random location at the top  
      shooter.reset(
        this.rnd.integerInRange(20, this.game.width - 20), 0,
        BasicGame.SHOOTER_HEALTH
      );

      // choose a random target location at the bottom
      var target = this.rnd.integerInRange(20, this.game.width - 20);

      // move to target and rotate the sprite accordingly  
      shooter.rotation = this.physics.arcade.moveToXY(
        shooter, target, this.game.height,
        this.rnd.integerInRange(
          BasicGame.SHOOTER_MIN_VELOCITY, BasicGame.SHOOTER_MAX_VELOCITY
        )
      ) - Math.PI / 2;

      shooter.play('fly');

      // each shooter has their own shot timer 
      shooter.nextShotAt = 0;
    }
  },


  enemyFire: function() {
    this.shooterPool.forEachAlive(function (enemy) {
      if (this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) {
        var bullet = this.enemyBulletPool.getFirstExists(false);
        bullet.reset(enemy.x, enemy.y + 30);
        this.physics.arcade.moveToObject(
          bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY
        );
        enemy.nextShotAt = this.time.now + BasicGame.SHOOTER_SHOT_DELAY;
        this.enemyFireSFX.play();
      }
    }, this);

    // Boss Fire

    if (this.bossApproaching === false && this.boss.alive && 
        this.boss.nextShotAt < this.time.now &&
        this.enemyBulletPool.countDead() >= 10) {      

      this.boss.nextShotAt = this.time.now + BasicGame.BOSS_SHOT_DELAY;
      this.enemyFireSFX.play();

      for (var i = 0; i < 5; i++) {
        // process 2 bullets at a time
        var leftBullet = this.enemyBulletPool.getFirstExists(false);
        leftBullet.reset(this.boss.x - 10 - i * 10, this.boss.y + 60);
        var rightBullet = this.enemyBulletPool.getFirstExists(false);
        rightBullet.reset(this.boss.x + 10 + i * 10, this.boss.y + 60);

        if (this.boss.health > 300) {
          // aim directly at the player
          this.physics.arcade.moveToObject(
            leftBullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY
          );
          this.physics.arcade.moveToObject(
            rightBullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY
          );
        } else {
          // aim slightly off center of the player
          this.physics.arcade.moveToXY(
            leftBullet, this.player.x - i * 100, this.player.y,
            BasicGame.ENEMY_BULLET_VELOCITY
          );
          this.physics.arcade.moveToXY(
            rightBullet, this.player.x + i * 100, this.player.y,
            BasicGame.ENEMY_BULLET_VELOCITY
          );
        }
      }
    }
  },


// player movement

  processPlayerInput: function () {
    this.player.body.acceleration.x = 0;
    this.player.body.acceleration.y = 0;

    this.shipExhaust.x = this.player.x;
    this.shipExhaust.y = this.player.y + 45;

    this.player.rotation = 0;
    this.shipExhaust.on = false; 

    if (this.cursors.left.isDown) {
      this.player.body.acceleration.x = -BasicGame.PLAYER_ACCELERATION;
      this.player.rotation -= 0.324;
      this.shipExhaust.on = true;
      this.shipExhaust.x = this.player.x + 30;
          
    } else if (this.cursors.right.isDown) {

      this.player.body.acceleration.x = BasicGame.PLAYER_ACCELERATION;
      this.player.rotation += 0.324;
      this.shipExhaust.on = true;
      this.shipExhaust.x = this.player.x - 30;

    } 

    if (this.cursors.up.isDown) {

      this.player.body.acceleration.y = -BasicGame.PLAYER_ACCELERATION; 
      this.shipExhaust.on = true;
  
    } else if (this.cursors.down.isDown) {
   
      this.player.body.acceleration.y = BasicGame.PLAYER_ACCELERATION; 
      this.shipExhaust.on = true;
   
    }

    if (this.input.activePointer.isDown &&
        this.physics.arcade.distanceToPointer(this.player) > 15) {
      this.physics.arcade.moveToPointer(this.player, this.player.speed);
    }

    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
        this.input.activePointer.isDown) {
      if (this.returnText && this.returnText.exists) {
        this.quitGame();
        this.soundtrack.destroy();
      } else {
        this.fire();
      }
    }

    // Player Action keys

    if (this.bombKey.isDown) {
      this.launchBomb();
    }

     if (this.shieldKey.isDown) {
      this.deployShield();
    }

    // Audio Keys

    if (this.muteKey.isDown) {
      this.game.sound.mute = true;

    } else if (this.unMuteKey.isDown) {
      this.game.sound.mute = false;
    }
  },


  processDelayedEffects: function () {
    if (this.instructions.exists && this.time.now > this.instExpire) {
      this.instructions.destroy();
    }

    if (this.ghostUntil && this.ghostUntil < this.time.now) {
      this.ghostUntil = null;
      this.player.play('fly');
    }

    if (this.showReturn && this.time.now > this.showReturn) {
      this.returnText = this.add.text(
        this.game.width / 2, this.game.height / 2 + 40, 
        'Press SPACEBAR to go back to Main Menu', 
        { font: '16px sans-serif', fill: '#fff'}
      );
      this.returnText.anchor.setTo(0.5, 0.5);
      this.showReturn = false;
    }

    if (this.bossApproaching && this.boss.y > 80) {
      this.bossApproaching = false;
      this.boss.nextShotAt = 0;

      this.boss.body.velocity.y = 0;
      this.boss.body.velocity.x = BasicGame.BOSS_X_VELOCITY;
      // allow bouncing off world bounds
      this.boss.body.bounce.x = 1;
      this.boss.body.collideWorldBounds = true;
    }
  },

  playerHit: function (player, enemy) {

    // check first if this.ghostUntil is not not undefined or null 
    if (this.ghostUntil && this.ghostUntil > this.time.now) {
      return;
    }

    this.playerExplosionSFX.play();

    // crashing into an enemy only deals 5 damage
    this.damageEnemy(enemy, BasicGame.CRASH_DAMAGE);

    var life = this.lives.getFirstAlive();
    if (life !== null && this.weaponLevel === 0) {
      life.kill();
      this.powerupText.text = "PowerUp: " + this.weaponLevel;
      this.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;
      this.player.play('ghost');
      
    } else if (life !== null && this.weaponLevel > 0) {
      life.kill();
      this.weaponLevel--;
      this.powerupText.text = "PowerUp: " + this.weaponLevel;
      this.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;
      this.player.play('ghost');
      
    } else {
      this.explode(player);
      player.kill();
      this.shipExhaust.kill();
      this.displayEnd(false);
    }
  },

  enemyHit: function (bullet, enemy) {
    bullet.kill();
    this.damageEnemy(enemy, bullet.body.BULLET_DAMAGE);

    if(this.boss.alive) {

    this.bossHealthText.text = "Boss Health: " + this.boss.health;
    } 
  },

  damageEnemy: function (enemy, damage) {
    enemy.damage(damage);
    if (enemy.alive) {
      enemy.play('hit');

    } else {
      this.explode(enemy);
      this.explosionSFX.play();
      this.dropWeaponPowerUp(enemy);
      this.dropBombPowerUp(enemy);
      this.dropShieldPowerUp(enemy);
      this.addToScore(enemy.reward);
      // We check the sprite key (e.g. 'greenEnemy') to see if the sprite is a boss
      // For full games, it would be better to set flags on the sprites themselves
      if (enemy.key === 'boss') {
        this.enemyPool.destroy();
        this.shooterPool.destroy();
        this.bossPool.destroy();
        this.enemyBulletPool.destroy();
        this.bossHealthText.text = "Boss Health: 0";
        this.displayEnd(true);
      }
    }
  },

  dropWeaponPowerUp: function (enemy) {
    if (this.powerUpPool.countDead() === 0 || this.weaponLevel === 5) { 
      return;
    }

    if (this.rnd.frac() < enemy.dropRate) {
      var powerUp = this.powerUpPool.getFirstExists(false);
      powerUp.reset(enemy.x, enemy.y);
      powerUp.body.velocity.y = BasicGame.POWERUP_VELOCITY;
    }
  },

  dropBombPowerUp: function (enemy) {
    if (this.bombPowerUpPool.countDead() === 0) {
      return;
    }

    if (this.rnd.frac() < enemy.bombDropRate) {
      var bombPowerUp = this.bombPowerUpPool.getFirstExists(false);
      bombPowerUp.reset(enemy.x, enemy.y);
      bombPowerUp.body.velocity.y = BasicGame.POWERUP_VELOCITY;
    }
  },

  dropShieldPowerUp: function (enemy) {
    if (this.shieldPowerUpPool.countDead() === 0) {
      return;
    }

    if (this.rnd.frac() < enemy.shieldDropRate) {
      var shieldPowerUp = this.shieldPowerUpPool.getFirstExists(false);
      shieldPowerUp.reset(enemy.x, enemy.y);
      shieldPowerUp.body.velocity.y = BasicGame.POWERUP_VELOCITY;
    }
  },

  playerGetsWeaponPowerUp: function (player, powerUp) {
    this.addToScore(powerUp.reward);
    powerUp.kill();
    this.powerUpSFX.play();
    if (this.weaponLevel < 5) {
      this.weaponLevel++;
    }

    this.powerupText.text = "PowerUp: " + this.weaponLevel;
    
  },

  playerGetsBomb: function (player, bombPowerUp) {
    bombPowerUp.kill();
    this.powerUpSFX.play();

    this.bombCount++;

    this.bombPowerupText.text = "Bombs: " + this.bombCount;

  },

  playerGetsShield: function (player, shieldPowerUp) {
    shieldPowerUp.kill();
    this.powerUpSFX.play();

    this.shieldCount++;

    this.shieldPowerupText.text = "Shields: " + this.shieldCount;
  },

  launchBomb: function () {
    if (!this.player.alive || this.nextBombAt > this.time.now) {
      return;
    }

    this.nextBombAt = this.time.now + this.bombShotDelay;

    var bomb;
    if (this.bombCount > 0) {
      

      bomb = this.bombPool.getFirstExists(false);
      bomb.reset(this.player.x, this.player.y - 50);
      bomb.body.velocity.y = -500;
      bomb.body.DAMAGE = BasicGame.BOMB_DAMAGE;
      this.bombCount--;
      this.bombPowerupText.text = "Bombs: " + this.bombCount;

    } else {
      return;
    }

  },

  bombHit: function (bomb, enemy) {
    bomb.kill();
    this.damageEnemy(enemy, bomb.body.DAMAGE);  
    this.bombBlast(bomb);  
 
    if(this.boss.alive) {
      this.bossHealthText.text = "Boss Health: " + this.boss.health;
    } 

  },

  bombBlast: function (bomb) {
    if (this.bombBlastPool.countDead() === 0) {
      return;
    }
    var bombExplosion = this.bombBlastPool.getFirstExists(false);
    bombExplosion.reset(bomb.x, bomb.y);
    bombExplosion.play('bang', 15, false, true);
    bombExplosion.body.velocity.x = bomb.body.velocity.x;
    bombExplosion.body.velocity.y = bomb.body.velocity.y;
    bombExplosion.body.DAMAGE = BasicGame.BOMB_DAMAGE;
    
  },

  bombBlastHit: function (bombExplosion, enemy) {
    this.damageEnemy(enemy, bombExplosion.body.DAMAGE);
    
    if(this.boss.alive) {
      this.bossHealthText.text = "Boss Health: " + this.boss.health;
    } 
  },

  deployShield: function () {    

    if (!this.player.alive || this.shieldRecharge > this.time.now) {
      return;
    } 
      this.shieldDeployDelay = Phaser.Timer.SECOND * 3;
      this.shieldRecharge = this.time.now + this.shieldDeployDelay;

    if (this.shieldCount > 0) {
      this.ghostUntil = this.time.now + BasicGame.PLAYER_SHIELD_TIME;
      this.player.play('shield');
      this.shieldCount--;
      this.shieldPowerupText.text = "Shields: " + this.shieldCount;
    } else {
      return;
    }
  
  },

  makeBullet: function (extraSpeed, extraDamage) {

      var bullet;
      var bulletOffset = 60 * Math.sin(this.game.math.degToRad(this.player.angle));
      bullet = this.bulletPool.getFirstExists(false);
      bullet.reset(this.player.x + bulletOffset, this.player.y - 40);
      bullet.angle = this.player.angle;

      // make bullet shoot at same angle as ship
      this.game.physics.arcade.velocityFromAngle(bullet.angle - 90, BasicGame.PLAYER_BULLET_VELOCITY, bullet.body.velocity);
      bullet.body.velocity.x += this.player.body.velocity.x;
      bullet.body.velocity.y = -BasicGame.PLAYER_BULLET_VELOCITY - extraSpeed;
      bullet.body.BULLET_DAMAGE = BasicGame.BULLET_DAMAGE + extraDamage;
      
    },

    makeBulletSpray: function (extraSpeed, extraDamage) {

      var i = 1;  
      bullet = this.bulletPool.getFirstExists(false);
      bullet.reset(this.player.x, this.player.y - 40);
      bullet.body.velocity.y = -BasicGame.PLAYER_BULLET_VELOCITY - extraSpeed;
      bullet.body.BULLET_DAMAGE = BasicGame.BULLET_DAMAGE + extraDamage;

      // bullet spray to the left 
      bullet = this.bulletPool.getFirstExists(false);
      bullet.body.BULLET_DAMAGE = BasicGame.BULLET_DAMAGE + extraDamage;
      bullet.reset(this.player.x - (10 + i * 6), this.player.y - 40);
      this.physics.arcade.velocityFromAngle(
      -95 - i * 10, BasicGame.PLAYER_BULLET_VELOCITY + extraSpeed, bullet.body.velocity
      );

      // bullet spray to the right
      bullet = this.bulletPool.getFirstExists(false);
      bullet.body.BULLET_DAMAGE = BasicGame.BULLET_DAMAGE + 3;
      bullet.reset(this.player.x + (10 + i * 6), this.player.y - 40); 
      this.physics.arcade.velocityFromAngle(
      -85 + i * 10, BasicGame.PLAYER_BULLET_VELOCITY + extraSpeed, bullet.body.velocity
      );

    },

    fire: function() {
    if (!this.player.alive || this.nextShotAt > this.time.now) {
      return;
    }

    this.nextShotAt = this.time.now + this.shotDelay;
    this.playerFireSFX.play();

    // Weapon Powerup Upgrades
    
    if (this.weaponLevel === 0) {
      if (this.bulletPool.countDead() === 0) {
        return;
      } else {
        this.makeBullet(0, 0);
      }
    } else if (this.weaponLevel === 1) {
        this.makeBullet(100, 0);
    } else if (this.weaponLevel === 2) {
        this.makeBullet(100, 1);
    } else if (this.weaponLevel === 3) {
        this.makeBullet(200, 2);
    } else if (this.weaponLevel === 4) {
        this.makeBullet(400, 3);
    } else {
        this.makeBulletSpray(600, 3);
    }
  },

  addToScore: function (score) {
    this.score += score;
    this.scoreText.text = this.score;
    // this approach prevents the boss from spawning again upon winning
    if (this.score >= BasicGame.BOSS_APPROACH && this.bossPool.countDead() == 1) {
      this.spawnBoss();
     
    }
  },

  spawnBoss: function () {
    this.bossApproaching = true;
    this.boss.reset(this.game.width / 2, 0, BasicGame.BOSS_HEALTH);
    this.physics.enable(this.boss, Phaser.Physics.ARCADE);
    this.boss.body.velocity.y = BasicGame.BOSS_Y_VELOCITY;
    this.boss.play('fly');
     
  },

  explode: function (sprite) {
    if (this.explosionPool.countDead() === 0) {
      return;
    }
    var explosion = this.explosionPool.getFirstExists(false);
    explosion.reset(sprite.x, sprite.y);
    explosion.play('boom', 20, false, true);
    // add the original sprite's velocity to the explosion
    explosion.body.velocity.x = sprite.body.velocity.x;
    explosion.body.velocity.y = sprite.body.velocity.y;
  },

  displayEnd: function (win) {
    // you can't win and lose at the same time
    if (this.endText && this.endText.exists) {

      return;
    }

    var msg = win ? 'Boss Defeated' : 'You Failed Us';
    this.endText = this.add.text( 
      this.game.width / 2, this.game.height / 2 - 80, msg, 
      { font: '72px serif', fill: '#7CFC00' }
    );
    this.endText.anchor.setTo(0.5, 0);

    this.showReturn = this.time.now + BasicGame.RETURN_MESSAGE_DELAY;
  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    this.space.destroy();
    this.player.destroy();
    this.enemyPool.destroy();
    this.bulletPool.destroy();
    this.explosionPool.destroy();
    this.shooterPool.destroy();
    this.enemyBulletPool.destroy();
    this.powerUpPool.destroy();
    this.bossPool.destroy();
    this.instructions.destroy();
    this.scoreText.destroy();
    this.endText.destroy();
    this.returnText.destroy();
    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  }

};
