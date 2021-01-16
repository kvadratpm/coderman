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
      width: window.screen.width * 0.5,
      height: window.screen.height * 0.8,
      scene: [ MainScene ],
      parent: 'phaser',
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
    this.hero = this.physics.add.sprite(250, 250, 'hero');
    this.hero.setCollideWorldBounds(true);
  }
  preload(): void {
    this.load.multiatlas('orc', 'assets/sprite/sprite.json', 'assets');
  }
  update(): void {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.hero = this.add.sprite(300, 300, 'orc', 'assets/sprite/sprite-o.png');
    if (this.cursors.left.isDown) {
      this.hero.setVelocityX(-100);
    }
    else {
      this.hero.setVelocityX(0);
    }
  }
}
