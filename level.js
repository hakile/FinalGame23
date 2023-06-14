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
        this.load.image('arrow', 'assets/arrow.png');
        this.load.audio('bgm', 'assets/bgmusic.mp3');
        this.load.audio('beep', 'assets/beep.mp3');
        this.load.audio('death', 'assets/death.mp3');
        this.load.audio('win', 'assets/win.mp3');
        this.load.glsl('bundle', 'assets/bundle.glsl.js');
    }
    create() {
        this.input.addPointer();
        this.bgm = this.sound.add('bgm', {volume: 0});
        this.tweens.add({targets: this.bgm, volume: {from: 0, to: 0.2}, duration: 1000});
        this.bgm.loop = true;
        this.bgm.play();
        
        this.beep = this.sound.add('beep', {volume: 0.5});
        this.ded = this.sound.add('death', {volume: 0.5});
        this.winsfx = this.sound.add('win', {volume: 0.3});

        this.alive = true;

        this.bgshader = this.add.shader('Colorful Voronoi', 640, 360, 1280, 720);

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

        this.leftdown = false;
        this.rightdown = false;
        if (onMobile) {
            this.leftbut = this.add.sprite(100, 620, 'arrow')
                .setInteractive()
                .setAlpha(0.5)
                .on('pointerdown', () => {this.leftdown = true; this.leftbut.setAlpha(1); this.rightbut.setRotation(1.5708)})
                .on('pointerup', () => {this.leftdown = false; this.leftbut.setAlpha(0.5); this.rightbut.setRotation(3.14159)});
            this.rightbut = this.add.sprite(1180, 620, 'arrow')
                .setInteractive()
                .setRotation(3.14159)
                .setAlpha(0.5)
                .on('pointerdown', () => {this.rightdown = true; this.rightbut.setAlpha(1); this.leftbut.setRotation(1.5708)})
                .on('pointerup', () => {this.rightdown = false; this.rightbut.setAlpha(0.5); this.leftbut.setRotation(0)});
        }

        this.add.text(1230, 50, '📺', {fontSize: "25px"})
            .setInteractive()
            .setOrigin(1,0)
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {this.scale.stopFullscreen()}
                else {this.scale.startFullscreen()};
            });
    }
    onEnter() {
        console.warn('This LevelScene did not implement onEnter():', this.constructor.name);
    }
    update() {
        this.portal.rotation += .1;
        const { left, right, up, space } = this.cursors;
        if ((left.isDown || this.leftdown) && this.player.body.touching.down && this.alive) {
            this.move("left");
        } else if ((right.isDown || this.rightdown) && this.player.body.touching.down && this.alive) {
            this.move("right");
        } else if (this.player.body.touching.down) {
            this.player.setVelocityX(this.player.body.velocity.x * .8);
        }

        if ((up.isDown || (this.leftdown && this.rightdown)) && this.player.body.touching.down && this.alive) {
            this.move("jump")
        }
        // if (space.isDown && this.alive) {speedInc = 0; this.die()};
    }
    move(direction) {
        if (direction == "left") {
            if (this.player.body.velocity.x > 0) {
                this.player.setVelocityX(this.player.body.velocity.x * .8)
            }
            this.player.setVelocityX(this.player.body.velocity.x - 40);
        } else if (direction == "right") {
            if (this.player.body.velocity.x < 0) {
                this.player.setVelocityX(this.player.body.velocity.x * .8)
            }
            this.player.setVelocityX(this.player.body.velocity.x + 40);
        } else if (direction == "jump") {
            this.player.setVelocityY(-400 - 0.6 * Math.abs(this.player.body.velocity.x));
            this.beep.play();
        }
    }
    die() {
        if (this.alive) {lives -= 1; this.ded.play()};
        this.alive = false;
        this.bgshader.x = -9999;
        this.player.setTexture("enemy");
        this.tweens.add({targets: this.bgm, volume: 0, duration: 500, onComplete: () => this.bgm.stop()});
        this.time.delayedCall(1000, () => {
            if (lives > 0) {this.scene.start('level1')}
            else {this.scene.start('losescreen')};
        });
    }
    win() {
        this.portal.disableBody(true);
        this.winsfx.play();
        this.tweens.add({targets: this.winscreen, alpha: {from: .75, to: 0}, duration: 500, ease: 'Linear'});
        this.player.setGravityY(-4000);
        this.player.setVelocityX(0);
        this.player.setCollideWorldBounds(false);
        this.add.text(970, 150, "You win!", {font: "28px Arial"});
        speedInc += 75;
        lives += 1;
        loopsToBeat -= 1;
        this.tweens.add({targets: this.bgm, volume: 0, duration: 1000, onComplete: () => this.bgm.stop()});
        this.time.delayedCall(1500, () => {
            if (loopsToBeat == 0) {this.scene.start('winscreen')}
            else {this.scene.start('level1')};
        });
    }
}

class WinScreen extends Phaser.Scene {
    constructor(key) {
        super('winscreen');
    }
    create() {
        this.add.text(640, 300, "You won!", {font: "60px Times New Roman", color: "#FFF"}).setOrigin(.5);

        let continueButton = this.add.text(400, 500, 'Continue (Endless)', {
            font: `30px Verdana`})
            .setOrigin(0,0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.scene.start("level1"); })
            .on('pointerover', () => continueButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => continueButton.setStyle({ fill: '#FFF' }));
        let returnButton = this.add.text(880, 500, 'Return', {
            font: `30px Verdana`})
            .setOrigin(1,0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.scene.start("MainMenu"); })
            .on('pointerover', () => returnButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => returnButton.setStyle({ fill: '#FFF' }));
    }
}

class LoseScreen extends Phaser.Scene {
    constructor(key) {
        super('losescreen');
    }
    create() {
        this.add.text(640, 300, "Game Over!", {font: "60px Times New Roman", color: "#FFF"}).setOrigin(.5);

        let returnButton = this.add.text(640, 500, 'Return', {
            font: `30px Verdana`})
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.scene.start("MainMenu"); })
            .on('pointerover', () => returnButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => returnButton.setStyle({ fill: '#FFF' }));
    }
}