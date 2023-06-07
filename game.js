var speedInc = 0;

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, scale) {
        super(scene, x, y, scale);
        scene.physics.add.existing(this);
        this.setPosition(x, y)
        this.setScale(scale);
        this.setTexture("enemy");
        this.setSize(32, 69);
        scene.add.existing(this);
    }
}

class Level1 extends LevelScene {
    constructor() {
        super("level1");
    }
    onEnter() {
        this.add.text(30, 30, `Press Space to reset enemy speed\nEnemy speed: ${300+speedInc}`, {font: "32px Arial"}).setShadow(3,3);
        
        this.player.x = 96;
        this.player.y = 621.5;

        // this.enemy1 = this.physics.add.sprite(1100, 621.5, 'enemy');
        this.enemy1 = new Enemy(this, 1200, 621.5, 1);
        this.enemies.push(this.enemy1);
        
        this.enemy2 = new Enemy(this, 100, 306.65, 1.3);
        this.enemies.push(this.enemy2);

        this.time.delayedCall(50, () => {for (let i = 0; i < this.enemies.length; i++) {
                this.enemies[i].setVelocityX(-(300+speedInc)/this.enemies[i].scaleX/this.enemies[i].scaleX)
                    .setCollideWorldBounds(true).setBounce(1,0)
        }});
        
        const platforms = this.physics.add.staticGroup();

        for (let i = 0; i < 20; i++) {platforms.create(64*i + 32, 688, 'tile')};
        for (let i = 0; i < 5; i++) {platforms.create(64*i + 992, 555, 'tile')};
        for (let i = 0; i < 6; i++) {platforms.create(64*i + 32, 384, 'tile')};
        for (let i = 0; i < 4; i++) {platforms.create(64*i + 608, 256, 'tile')};

        platforms.create(640, 500, 'tile');
        platforms.create(800, 104, 'tile');
        platforms.create(800, 40, 'tile');
        platforms.create(1248, 192, 'tile');

        this.enemyBounds.push(this.physics.add.body(384, 342, 10, 10).setAllowGravity(false).setImmovable(true));

        this.portal.x = 1248;
        this.portal.y = 128
        
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.enemies, platforms);

        this.winscreen = this.add.sprite(640, 360, 'screen').setAlpha(0);
    }
}

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT
    },
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {y: 2000}
        }
    },
    scene: [ Level1 ]
});