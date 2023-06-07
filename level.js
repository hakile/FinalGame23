class LevelScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }
    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('tile', 'assets/tile.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('portal', 'assets/portal.png');
        this.load.image('screen', 'assets/whitescreen.png');
        this.load.audio('bgm', 'assets/bgmusic.mp3');
        this.load.audio('beep', 'assets/beep.mp3');
        this.load.glsl('bundle', 'assets/bundle.glsl.js');
    }
    create() {
        this.bgm = this.sound.add('bgm', {volume: 0});
        this.tweens.add({targets: this.bgm, volume: {from: 0, to: 0.2}, duration: 1000});
        this.bgm.loop = true;
        this.bgm.play();
        
        this.beep = this.sound.add('beep', {volume: 0.5});

        this.alive = true;

        this.add.shader('Colorful Voronoi', 640, 360, 1280, 720);

        this.player = this.physics.add.sprite(0, 0, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.body.setMaxVelocityX(600);
        this.player.setBounce(.25,0);

        this.enemies = [];
        this.enemyBounds = [];

        this.portal = this.physics.add.sprite(1280, 0, 'portal').setImmovable(true).setGravityY(-2000);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.enemies, this.enemyBounds);
        this.physics.add.overlap(this.player, this.enemies, this.die, null, this);
        this.physics.add.overlap(this.player, this.portal, this.win, null, this);

        this.onEnter();
    }
    onEnter() {
        console.warn('This LevelScene did not implement onEnter():', this.constructor.name);
    }
    update() {
        this.portal.rotation += .1;
        const { left, right, up, space } = this.cursors;
        if (left.isDown && this.player.body.touching.down && this.alive) {
            if (this.player.body.velocity.x > 0) {
                this.player.setVelocityX(this.player.body.velocity.x * .8)
            }
            this.player.setVelocityX(this.player.body.velocity.x - 40);
        } else if (right.isDown && this.player.body.touching.down && this.alive) {
            if (this.player.body.velocity.x < 0) {
                this.player.setVelocityX(this.player.body.velocity.x * .8)
            }
            this.player.setVelocityX(this.player.body.velocity.x + 40);
            // this.player.anims.play('right', true);
        } else if (this.player.body.touching.down) {
            this.player.setVelocityX(this.player.body.velocity.x * .8);
            // this.player.anims.play('turn');
        }

        if (up.isDown && this.player.body.touching.down && this.alive) {
            this.player.setVelocityY(-400 - 0.6 * Math.abs(this.player.body.velocity.x));
            this.beep.play();
        }
        if (space.isDown && this.alive) {speedInc = 0; this.die()};
    }
    die() {
        this.alive = false;
        this.player.setTexture("enemy");
        this.time.delayedCall(1000, () => this.scene.start('level1'));
        this.tweens.add({targets: this.bgm, volume: 0, duration: 500, onComplete: () => this.bgm.stop()});
    }
    win() {
        this.portal.disableBody(true);
        this.tweens.add({targets: this.winscreen, alpha: {from: .75, to: 0}, duration: 500, ease: 'Linear'});
        this.time.delayedCall(1500, () => this.scene.start('level1'));
        this.player.setGravityY(-4000);
        this.player.setVelocityX(0);
        this.player.setCollideWorldBounds(false);
        this.add.text(970, 150, "You win!", {font: "28px Arial"});
        speedInc += 75;
        this.tweens.add({targets: this.bgm, volume: 0, duration: 1000, onComplete: () => this.bgm.stop()});
    }
}