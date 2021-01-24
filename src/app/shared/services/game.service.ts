import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';

export class GameService extends Phaser.Scene {

  score = 0;
  currentDirection = 0;
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

  }

  async movePlayer(direction: number): Promise<void> {
    return new Promise((res) => {
      switch (direction) {
        case 0:
          this.player.setVelocityY(-60);
          break;
        case 90:
          this.player.setVelocityX(60);
          break;
        case 180:
          this.player.setVelocityY(60);
          break;
        case 270:
          this.player.setVelocityX(-60);
          break;
      }
      setTimeout(() => {
        this.player.setVelocity(0, 0);
        res();
      }, 1000);
    });
  }

  async rotateRight(): Promise<void> {
    return new Promise((res) => {
      this.currentDirection = this.currentDirection === 270 ? 0 : this.currentDirection + 90;
      res();
    });
  }
  async rotateLeft(): Promise<void> {
    return new Promise((res) => {
      this.currentDirection = this.currentDirection === 0 ? 270 : this.currentDirection - 90;
      res();
    });
  }

  async startTurn(cmd: string[]): Promise<void> {
    console.log(cmd);
    for (const elem of cmd) {
      if (elem.includes('move')) {
        await this.movePlayer(this.currentDirection);
      }
      if (elem.includes('rotateRight')) {
        await this.rotateRight();
      }
      if (elem.includes('rotateLeft')) {
        await this.rotateLeft();
      }
    }
  }
}
