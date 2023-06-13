class Intro extends Phaser.Scene {
    constructor() {
        super('intro');
    }

    preload() {
    }

    create(){
        //create text object
        this.textObject = this.add.text(
            this.game.config.width*.5, //x
            this.game.config.height*.5,//y
            "Endless Dream", //text
            {
                font: `${this.game.config.height*.056}px Arial`,
                color: "#ffffff",
            } //style
        ).setOrigin(.5);

        this.textObject = this.add.text(
            this.game.config.width*.5, //x
            this.game.config.height*.6,//y
            "(Click Anywhere to Continue)", //text
            {
                font: `${this.game.config.height*.028}px Arial`,
                color: "#ffffff",
            } //style
        ).setOrigin(.5);

        this.input.once('pointerdown', function() {
            this.scene.start("Studio")
        }, this)

    }
}

class Studio extends Phaser.Scene {
    constructor() {
        super('Studio');
    }

    preload() {
        this.load.path = './assets/';
        this.load.video('Studio23', 'Studio23.mp4');
    }

    create(){
        this.video = this.add.video(this.game.config.width*.5, this.game.config.height*.5, 'Studio23');
        this.video.setScale(this.game.config.height/1080);
        this.video.play();
        this.time.addEvent({
            delay: 6000*.125,
            callback: ()=>{
                this.cameras.main.fade(250, 0,0,0);
                this.time.delayedCall(250, () => this.scene.start("MainMenu"));
            },
            loop: false,
        })
    }
}

class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }
    preload(){
        this.load.path = './assets/';
        this.load.image('title', 'title.png');
        this.load.image('city', 'city.png');
        this.load.image('citylit', 'citylit.png');

    }
    create(){
        this.timer = 0;
        this.cameras.main.fadeIn(500, 0,0,0); // fade in

        //create image object 
        this.imageObject = this.add.sprite(
            this.game.config.width,//x
            this.game.config.height,//y
            'city',//imagename
        ).setOrigin(1);
        this.imageObject.setScale(this.game.config.height*.001); //resize

        
        let title = this.add.text(this.game.config.height*.0833, this.game.config.height*.0833, "Endless Dream")
            .setFontSize(this.game.config.height * .0556)
            .setInteractive()
            //.on('pointerover', () => this.setStyle({ fill: '#f39c12' }))
            .on('pointerdown', () => {
                this.tweens.add({
                    targets: title,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
        });

        // button code sourced from https://webtips.dev/webtips/phaser/interactive-buttons-in-phaser3
        let startButton = this.add.text(this.game.config.width*.15, this.game.config.height*0.35, 'Play', {
            font: `${this.game.config.height*.04}px Verdana`})
            .setOrigin(0.5)
            .setPadding(this.game.config.height*.01389)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.scene.start("level1"); })
            .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => startButton.setStyle({ fill: '#FFF' }))

        let optionsButton = this.add.text(this.game.config.width*.15, this.game.config.height*0.5, 'Options', {
            font: `${this.game.config.height*.04}px Verdana`})
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.scene.start("OptionsMenu"); })
            .on('pointerover', () => optionsButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => optionsButton.setStyle({ fill: '#FFF' }))

        let creditsButton = this.add.text(this.game.config.width*.15, this.game.config.height*0.65, 'Credits', {
            font: `${this.game.config.height*.04}px Verdana`})
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.scene.start("Credits"); })
            .on('pointerover', () => creditsButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => creditsButton.setStyle({ fill: '#FFF' }))

    }
    update(time, delta) {
        this.timer += delta;
        while (this.timer > 200 && time > 2000) {
            let randnum = Phaser.Math.Between(0,100);
            // console.log(randnum);
            if (randnum > 80) {
                this.imageObject.setTexture('citylit');
                this.imageObject.update();
            } else {this.imageObject.setTexture('city')};
            this.timer -= 200;
        }
        // console.log(this.timer);
    }
}

class OptionsMenu extends Phaser.Scene {

    constructor() {
        super('OptionsMenu');
    }

    preload() {
    }

    create(){
        //create text object
        this.textObject = this.add.text(
            250, //x
            300, //y
            "Game Options Here", //text
            {
                font: "40px Arial",
                color: "#ffffff",
            } //style
        );

        let returnButton = this.add.text(this.game.config.width*.5, this.game.config.height*.82, 'Return', {
            font: `${this.game.config.height*.04}px Verdana`})
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.scene.start("MainMenu"); })
            .on('pointerover', () => returnButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => returnButton.setStyle({ fill: '#FFF' }));

    }
}

class Credits extends Phaser.Scene {

    constructor() {
        super('Credits');
    }

    preload() {
    }

    create(){
        //create text object
        this.textObject = this.add.text(
            this.game.config.width*.5, //x
            this.game.config.height*.3, //y
            "Game Credits:", //text
            {
                font: `${this.game.config.height*.0556}px Arial`,
                color: "#ffffff",
            } //style
        ).setOrigin(.5,1);

        //create text object
        this.textObject = this.add.text(
            this.game.config.width*.5, //x
            this.game.config.height*.4, //y
            `Technical Lead: Harrison Le
Backup Technical Lead: Brandon Christensen
Testing Lead: Mark McAteer
Production Lead: Jacob Barriga-Luis

Background Shader: Brandon Fogerty (xdpixel.com)`, //text
            {
                font: `${this.game.config.height*.03}px Arial`,
                color: "#ffffff",
                lineSpacing: this.game.config.height*.015
            } //style
        ).setOrigin(.5,0);

        let returnButton = this.add.text(this.game.config.width*.5, this.game.config.height*.82, 'Return', {
            font: `${this.game.config.height*.04}px Verdana`})
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.scene.start("MainMenu"); })
            .on('pointerover', () => returnButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => returnButton.setStyle({ fill: '#FFF' }));
    }
}