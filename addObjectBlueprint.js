// preloader.js

this.load.image('bomb', 'assets/bomb.png');

// game.js

// create functions

create: function () {

	this.setupBomb();

	this.bombKey = this.input.keyboard.addKey(Phaser.Keyboard.B);

}

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

setupText: function () {
	this.bombCount = 0;
    	this.bombPowerupText = this.add.text(
      	this.game.width - 80, 85, 'Bombs: ' + this.bombCount,
      	{ font: '20px monospace', fill: '#fff', align: 'center'}
    	);
    	this.bombPowerupText.anchor.setTo(0.5, 0.5);
	},

// update functions

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
      this.bombCount = this.bombCount - 1;
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

  
  checkCollisions: function () {

	this.physics.arcade.overlap(
      this.bombPool, this.enemyPool, this.bombHit, null, this
    );

    this.physics.arcade.overlap(
      this.bombPool, this.shooterPool, this.bombHit, null, this
    );

    if (this.bossApproaching === false) {

      this.physics.arcade.overlap(
        this.bombPool, this.bossPool, this.bombHit, null, this
      );

    }
 },

 processPlayerInput: function () {

 	if (this.bombKey.isDown) {
      this.launchBomb();
    }

}


