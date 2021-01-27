import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';

@Component({
  selector: 'app-phaser1',
  templateUrl: './phaser1.component.html',
  styleUrls: ['./phaser1.component.scss']
})
export class Phaser1Component implements OnInit {

  game!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      scene: [MainScene],
      scale: {
        parent: 'phaser',
        mode: Phaser.Scale.FIT,
        // width: window.screen.width*1,
        width: 650,
        // height: window.screen.height*1,
        height: 650,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }
        }
      }
    };
  }

  ngOnInit(): void {
    this.game = new Phaser.Game(this.config);
  }

}
class MainScene extends Phaser.Scene {

  score = 0;
  scoreText!: any;
  coins!: any;
  platforms!: any;
  cursors!: any;
  player!: any;

  constructor() {
    super({ key: 'main' });
  }


  preload(): void {

    this.load.animation('gemData', 'assets/phaser1/gems.json');
    this.load.atlas('gems', 'assets/phaser1/gems.png', 'assets/phaser1/gems.json');
    this.load.image('tiles', 'assets/phaser1/back9.png');
    this.load.tilemapTiledJSON('map', 'assets/phaser1/level1.json');
    this.load.atlas('hero1', 'assets/phaser1/hero1.png', 'assets/phaser1/hero1.json');
  }

  create(): void {

    this.player = this.physics.add.sprite(400, 350, 'hero1', 'front');
    console.log(typeof this.player);
    console.log(this.player);
    const map = this.make.tilemap({ key: 'map', tileWidth: 50, tileHeight: 50 });
    const tileset = map.addTilesetImage('tile', 'tiles');
    const layer = map.createLayer(0, tileset, 0, 0);
    const spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point');
    layer.setCollisionByProperty({ collides: true });
    this.player = this.physics.add
        .sprite(spawnPoint.x!, spawnPoint.y!, 'hero1', 'front')
        .setSize(30, 40)
        .setOffset(0, 24);
    console.log(typeof this.player);
    console.log(this.player);
    this.physics.add.collider(this.player, layer);
    const anims = this.anims;
    anims.create({
        key: 'left',
        frames: anims.generateFrameNames('hero1', { prefix: 'left.', start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
      });
    anims.create({
        key: 'right',
        frames: anims.generateFrameNames('hero1', { prefix: 'right.', start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
      });
    anims.create({
        key: 'front',
        frames: anims.generateFrameNames('hero1', { prefix: 'front.', start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
      });
    anims.create({
        key: 'back',
        frames: anims.generateFrameNames('hero1', { prefix: 'back.', start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
      });
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const cursors = this.input.keyboard.createCursorKeys();


    this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });


      /// звезды
    const coins = [
        this.physics.add.sprite(150, 150, 'gems').play('prism'),
        this.physics.add.sprite(150, 450, 'gems').play('square'),
        this.physics.add.sprite(450, 450, 'gems').play('ruby'),
        this.physics.add.sprite(450, 150, 'gems').play('diamond')
      ];


  }

  update(): void {
/*
    const speed = 200;
    const prevVelocity = this.player.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);
console.log(this.player.body)
    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.player.right.isDown) {
      this.player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play("right", true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play("back", true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play("front", true);
    } else {
      this.player.anims.stop();

      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) this.player.setTexture("hero1", "left");
      else if (prevVelocity.x > 0) this.player.setTexture("hero1", "right");
      else if (prevVelocity.y < 0) this.player.setTexture("hero1", "back");
      else if (prevVelocity.y > 0) this.player.setTexture("hero1", "front");
    }*/
  }
}

