import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';

@Component({
  selector: 'app-phaser-level',
  templateUrl: './phaser-level.component.html',
  styleUrls: ['./phaser-level.component.scss']
})


export class PhaserLevelComponent implements OnInit {
  game!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      scene: [ MainScene ],
      scale: {
        parent: 'phaser',
        mode: Phaser.Scale.FIT,
        width: window.screen.width * 0.5,
        height: window.screen.height * 0.9,
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

  hero!: any;
  cursors!: any;

  constructor() {
    super({ key: 'main' });
  }

  create(): void {
    const map = this.make.tilemap({ key: 'dungeon1', tileWidth: 32, tileHeight: 32});
    const tileset = map.addTilesetImage('tiles', 'tiles');
    const ground = map.createLayer('Ground', tileset);
    ground.setScale(4);
    const walls = map.createLayer('Walls', tileset);
    walls.setCollisionByProperty({ collides: true });
    walls.setScale(4);
    const debug = this.add.graphics().setAlpha(0.7);
    walls.renderDebug(debug, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });

    const hero = this.add.sprite(100, 590, 'hero', 'run-down-1.png');
    hero.setScale(4);

    this.anims.create({
      key: 'hero-stay-down',
      frames: [{ key: 'hero', frame: 'run-down-1.png' }]
    });
    this.anims.create({
      key: 'hero-go-down',
      frames: this.anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
      repeat: -1,
      frameRate: 10
    });
    this.anims.create({
      key: 'hero-go-up',
      frames: this.anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
      repeat: -1,
      frameRate: 10
    });
    this.anims.create({
      key: 'hero-go-right',
      frames: this.anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
      repeat: -1,
      frameRate: 10
    });
    hero.setScale(-4, 4);
    hero.anims.play('hero-go-right');
  }
  preload(): void {
    this.load.image('tiles', 'assets/dungeon1/tiles.png');
    this.load.tilemapTiledJSON('dungeon1', 'assets/dungeon1/dungeon1.json');
    this.load.atlas('hero', 'assets/hero.png', 'assets/hero.json');
  }
  update(): void {
  }
}
