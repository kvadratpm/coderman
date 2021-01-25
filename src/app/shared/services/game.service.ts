import * as Phaser from 'phaser';

export interface SceneConfig {
  tileMap: { // параметры тайлмэпа
    key: string, // ключ для привязки
    path: string, // путь до файла
    layers: string[] // удаляю
  };
  hero: {
    key: string, // ключ героя
    pngPath: string, // путь до пнгшки героя
    jsonPath: string // путь до json героя
  }; // врагов
}

export class GameService extends Phaser.Scene {

  score = 0;
  currentDirection = 0;
  scoreText!: any;
  coins!: any;
  platforms!: any;
  cursors!: any;
  player!: any;
  sceneConfig: SceneConfig;

  constructor(config: SceneConfig) {
    super({ key: 'main' });
    this.sceneConfig = config;
  }


  preload(): void {

    this.load.animation('gemData', 'assets/phaser1/gems.json');
    this.load.atlas('gems', 'assets/phaser1/gems.png', 'assets/phaser1/gems.json');
    this.load.image('tiles', 'assets/phaser1/back9.png'); // изображение с тайлами - оно одно везде?
    this.load.tilemapTiledJSON(this.sceneConfig.tileMap.key, this.sceneConfig.tileMap.path); // тайлмэп текущего уровня
    this.load.atlas(this.sceneConfig.hero.key, this.sceneConfig.hero.pngPath, this.sceneConfig.hero.jsonPath); // json hero animation
  }

  create(): void {

    this.player = this.physics.add.sprite(400, 350, this.sceneConfig.hero.key, 'front');
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
          this.player.setVelocityY(-50);
          this.player.play('back', true);
          break;
        case 90:
          this.player.setVelocityX(50);
          this.player.play('right', true);
          break;
        case 180:
          this.player.setVelocityY(50);
          this.player.play('front', true);
          break;
        case 270:
          this.player.setVelocityX(-50);
          this.player.play('left', true);
          break;
      }
      setTimeout(() => {
        this.player.setVelocity(0, 0);
        this.player.stop(true, null);
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
        const steps = Number(elem.match(/\d+/));
        for (let i = 0; i < steps; i++) {
          await this.movePlayer(this.currentDirection);
        }
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
