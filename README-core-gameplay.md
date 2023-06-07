## Core Gameplay Requirements
* Audio
    * Background music included (bgmusic.mp3)
    * Sound effect included (beep.mp3)
* Visual
    * Several sprite images (player.png, enemy.png, portal.png, etc.)
    * Shader background (bundle.glsl.js)
* Motion
    * Physics-based platformer, player controls the motion of the player character in-game
    * Enemies move around
* Progression
    * Level starts easy before becoming a little harder
    * Each completion of the level increases the difficulty by increasing enemy speed
* Prefabs
    * Enemy Class extends Phaser.Arcade.Physics.Sprite
    * LevelScene Class extends Phaser.Scene, which is the default for a level