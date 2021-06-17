var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    // arcade: {
    //   gravity: { y: 200 }
    // }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var jet, bombs, sky, ammo, explosion, gunShot;
var score = 0;
var coinShot, coins;
var scoretext;

function preload() {
  this.load.setBaseURL('./');

  this.load.image('sky', 'assets/images/space.jpg');
  this.load.image('jet', 'assets/images/jet.png');
  this.load.image('bomb', 'assets/images/r.png')
  this.load.image('ammo', 'assets/images/ammo.png')
  this.load.spritesheet('explosion', 'assets/images/exp2_0.jpg', {
    frameWidth: 50,
    frameHeight: 50
  })
  this.load.image('coin', 'assets/images/coin.png', {
    frameWidth: 50,
    frameHeight: 50
  })
  this.load.audio('gun-shot', 'assets/sound/gun.wav')
  this.load.audio('coin-shot', 'assets/sound/gun.wav')
}

function create() {
  sky = this.add.tileSprite(400, 300, config.width, config.height, 'sky');

  jet = this.physics.add.image(400, 500, 'jet').setScale(0.05).setOrigin(0.5, 1);
  jet.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();
  this.input.on('pointerdown', shoot, this)

  bombs = this.physics.add.group({
    key: 'bomb',
    repeat: 5,
    setScale: { x: .2, y: .2 },
    setXY: {
      x: 20, y: 50, stepX: Phaser.Math.Between(40, config.width / 3), stepY: (1, 40)
    }
  })

  setObjVelocity(bombs)

  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers('explosion'),
    frameRate: 20,
    hideOnComplete: true
  })

  gunShot = this.sound.add('gun-shot')
  coinShot = this.sound.add('coin-shot')
  coins = this.physics.add.group({
    setScale: { x: .01, y: .02 }
  });

  for (var i = 0; i < 10; i++) {
    let x = Phaser.Math.Between(0, config.width);
    let y = Phaser.Math.Between(0, 200);

    let newCoin = coins.create(x, y, 'coin').setScale(0.05)
    setObjVelocity(coins)
  }
  this.physics.add.collider(jet, coins, collectCoins, null, this)

  scoretext = this.add.text(15, 15, "Score: 0", { fontSize: 32, fill: "#ff0000" })
}

function shoot() {
  ammo = this.physics.add.image(jet.x, jet.y, 'ammo').setScale(1)
  ammo.setVelocityY(-600);
  this.physics.add.collider(ammo, bombs, destroyBomb, function () {
    return true;
  }, this)

}

function destroyBomb(ammo, bomb) {
  gunShot.play()
  explosion = this.add.sprite(bomb.x, bomb.y, 'explosion')
  explosion.play('explode')
  bomb.disableBody(true, true)
  ammo.disableBody(true, true)
  let x = Phaser.Math.Between(0, config.width - 15)
  bomb.enableBody(true, x, 0, true, true);
  let xVel = Phaser.Math.Between(-80, 90);
  let yVel = Phaser.Math.Between(10, 150);
  bomb.setVelocity(xVel, yVel);
  score += 10;
  scoretext.setText('Score : ' + score)
}

function setObjVelocity(bombs) {
  bombs.children.iterate(function (bomb) {
    let xVel = Phaser.Math.Between(-60, 60);
    let yVel = Phaser.Math.Between(10, 150);

    bombs.setVelocity(xVel, yVel);
  })
}

function checkForRepositioning(bombs) {
  bombs.children.iterate(function (bomb) {
    if (bomb.y > config.height || bomb.x > config.width + 20 || bomb.x < -15) {
      resetPosition(bomb);
    }
  })
}

function resetPosition(bomb) {
  bomb.y = 0;
  bomb.x = Phaser.Math.Between(10, config.width)
}

function collectCoins(jet, coin) {
  score += 10;
  coinShot.play();
  coin.disableBody(true, true)
  let x = Phaser.Math.Between(0, config.width - 10)
  coin.enableBody(true, x, 0, true, true)
  let xVel = Phaser.Math.Between(-60, 60);
  let yVel = Phaser.Math.Between(10, 150);
  coin.setVelocity(xVel, yVel);
  scoretext.setText('Score : ' + score)
}

function update() {
  sky.tilePositioX += .3
  sky.tilePositionY -= .3
  if (cursors.left.isDown) {
    jet.setVelocityX(-150);
  } else if (cursors.right.isDown) {
    jet.setVelocityX(150);
  } else {
    jet.setVelocityX(0);
  }

  if (cursors.up.isDown) {
    jet.setVelocityY(-150);
  } else if (cursors.down.isDown) {
    jet.setVelocityY(150);
  } else {
    jet.setVelocityY(0);
  }

  checkForRepositioning(bombs);
  checkForRepositioning(coins);
}