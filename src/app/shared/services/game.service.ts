import * as Phaser from 'phaser';

/**
 * С помощью этой конфигурации создаётся новый уровень игры.
 * @param tileMap - параметры тайлмэпа текущего уровня
 * @param tileMap.key - ключ создаваемого уровня, используем именование level1, level2 и так далее
 * @param tileMap.path - путь до файла, достаточно указать папку с уровнем и json файл
 * @param hero - параметры спрайта героя
 * @param hero.key - ключ спрайта, именуем в соотвествии с используемым спрайтом, например, используем спрайт hero1.png, ключ называем hero1
 * @param hero.pngPath - имя png файла с героем
 * @param hero.jsonPath - имя json файла с героем
 */
export interface SceneConfig {
  /**
   * @param tileMap - параметры тайлмэпа текущего уровня
   */
  tileMap: { // параметры тайлмэпа
    /**
     * @param tileMap.key - ключ создаваемого уровня, используем именование level1, level2 и так далее
     */
    key: string, // ключ для привязки
    /**
     * @param tileMap.path - путь до файла, достаточно указать папку с уровнем и json файл
     */
    path: string, // путь до файла
  };
  /**
   * @param hero - параметры спрайта героя
   */
  hero: {
    /**
     * @param hero.key - ключ спрайта, именуем в соотвествии с используемым спрайтом,
     * например, используем спрайт hero1.png, ключ называем hero1
     */
    key: string, // ключ героя
    /**
     * @param hero.pngPath - имя png файла с героем
     */
    pngPath: string, // путь до пнгшки героя
    /**
     * @param hero.jsonPath - имя json файла с героем
     */
    jsonPath: string // путь до json героя
  };
}
export class GameService extends Phaser.Scene {

  score = 0;
  currentDirection = 0;
  scoreText!: any;
  platforms!: any;
  player!: any;
  sceneConfig: SceneConfig;
  scaleCoef = window.screen.width * 0.5 / 650;
  cell = window.screen.width * 0.5 / 13;
  SpawnY!: any;
  SpawnX!: any;
  PointX!: any;
  PointY!: any;
  target!: any;
  levelTarget = 0;
  isSuccess = false;

// временно
orc1!: any;
orc2!: any;
hero2!: any;
hero3!: any;
shield!: any;
head!: any;
sword!: any;
finish!: any;
// ********* */



  constructor(config: SceneConfig) {
    super({ key: 'main' });
    this.sceneConfig = config;
  }


  preload(): void {

    this.load.atlas('gems', 'assets/phaser1/gems1.png', 'assets/phaser1/gems1.json');
    this.load.image('tiles', 'assets/map/tiles.png'); // изображение с тайлами - оно одно везде?
    this.load.image('point', 'assets/phaser1/lighter1.png');
    this.load.tilemapTiledJSON(this.sceneConfig.tileMap.key,
      `assets/${this.sceneConfig.tileMap.path}`); // тайлмэп текущего уровня
    this.load.atlas(this.sceneConfig.hero.key,
      `assets/heroes/${this.sceneConfig.hero.pngPath}`,
      `assets/heroes/${this.sceneConfig.hero.jsonPath}`); //

// **************временные текстуры***************

    this.load.atlas('orc1', 'assets/enemies/orc1.png', 'assets/enemies/orc1.json'); // черт1
    this.load.atlas('orc2', 'assets/enemies/orc2.png', 'assets/enemies/orc2.json'); // черт2
    this.load.atlas('hero2', 'assets/heroes/hero1.png', 'assets/heroes/hero1.json'); // hero2
    this.load.atlas('hero3', 'assets/heroes/warrior2.png', 'assets/heroes/warrior2.json'); // hero3
    this.load.image('sword', 'assets/armour/sword.png'); // меч
    this.load.image('head', 'assets/armour/head.png'); // шлем
    this.load.image('shield', 'assets/armour/shield.png'); // щит
    this.load.image('finish', 'assets/phaser1/finish.png'); // finish point

// ******************************** */
  }

  create(): void {
    const map = this.make.tilemap({ key: 'map', tileWidth: this.cell, tileHeight: this.cell });
    const tileset = map.addTilesetImage('tiles', 'tiles');
    const layer = map.createLayer(0, tileset, 0, 0);
    layer.setScale(this.scaleCoef);
    const spawnPoint = map.findObject('Items', obj => obj.name === 'Spawn Point');
    const gemPoints = map.filterObjects('Items', elem => elem.name === 'Gem Point');
    const lootPoints = map.filterObjects('Items', elem => elem.name === 'Loot Point');
    const enemiesPoints = map.filterObjects('Enemies', elem => elem.name === 'Enemy Point');
    layer.setCollisionByProperty({ collides: true });
    this.SpawnX = spawnPoint.x! * this.scaleCoef;
    this.SpawnY = spawnPoint.y! * this.scaleCoef;
    this.target = this.physics.add.image(this.SpawnX, this.SpawnY, 'point');
    this.target.setScale(this.scaleCoef);
    this.player = this.physics.add
      .sprite(spawnPoint.x! * this.scaleCoef, spawnPoint.y! * this.scaleCoef, this.sceneConfig.hero.key, 'front')
      .setSize(50, 60)
      .setOffset(0, 24)
      .setScale(window.screen.width * 0.5 / 650);
    this.physics.add.collider(this.player, layer);
    const anims = this.anims;
    anims.create({
      key: 'left',
      frames: anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'left.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: 'right',
      frames: anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'right.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: 'front',
      frames: anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'front.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1

    });
    anims.create({
      key: 'back',
      frames: anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'back.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });


// *********временные текстуры**********************************
    this.anims.create({
      key: 'stand1',
      frames: this.anims.generateFrameNames('orc1', { prefix: 'stand1.', start: 0, end: 13, zeroPad: 3 }),
      frameRate: 5, repeat: -1
    });
    this.anims.create({
      key: 'lay1',
      frames: this.anims.generateFrameNames('orc1', { prefix: 'lay1.', start: 0, end: 11, zeroPad: 3 })
    });
    this.anims.create({
      key: 'stand2',
      frames: this.anims.generateFrameNames('orc2', { prefix: 'stand2.', start: 0, end: 15, zeroPad: 3 }),
      frameRate: 5, repeat: -1 });
    this.anims.create({
      key: 'lay2',
      frames: this.anims.generateFrameNames('orc2', { prefix: 'lay2.', start: 0, end: 14, zeroPad: 3 })
    });
    this.anims.create({
      key: 'left2',
      frames: anims.generateFrameNames('hero2', { prefix: 'left2.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10, repeat: -1
    });
    this.anims.create({
      key: 'right2',
      frames: anims.generateFrameNames('hero2', { prefix: 'right2.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10, repeat: -1
    });
    this.anims.create({
      key: 'front2',
      frames: anims.generateFrameNames('hero2', { prefix: 'front2.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10, repeat: -1
    });
    this.anims.create({
      key: 'back2',
      frames: anims.generateFrameNames('hero2', { prefix: 'back2.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10, repeat: -1
    });
    this.anims.create({
      key: 'wait',
      frames: anims.generateFrameNames('hero3', { prefix: 'wait.', start: 0, end: 19, zeroPad: 3 }),
      frameRate: 10, repeat: -1
    });


    this.orc1  = this.physics.add
.sprite(100 * this.scaleCoef, 100 * this.scaleCoef, 'orc1', 'stand1')
.setScale(window.screen.width * 0.5 / 650);
    this.orc1.play('stand1');
    this.orc2  = this.physics.add
.sprite(200 * this.scaleCoef, 100 * this.scaleCoef, 'orc2', 'stand2')
.setScale(window.screen.width * 0.5 / 650);
    this.orc2.play('lay2');
    this.hero2 = this.physics.add
.sprite(300 * this.scaleCoef, 100 * this.scaleCoef, 'hero2', 'front2')
.setScale(window.screen.width * 0.5 / 650);
    this.hero3 = this.physics.add
.sprite(400 * this.scaleCoef, 100 * this.scaleCoef, 'hero3', 'wait')
.setScale(window.screen.width * 0.5 / 650);
    this.hero3.play('wait');
    this.sword = this.physics.add.image(500 * this.scaleCoef, 100 * this.scaleCoef, 'sword');
    this.sword.setScale(this.scaleCoef);
    this.head = this.physics.add.image(200 * this.scaleCoef, 200 * this.scaleCoef, 'head');
    this.head.setScale(this.scaleCoef);
    this.shield = this.physics.add.image(300 * this.scaleCoef, 200 * this.scaleCoef, 'shield');
    this.shield.setScale(this.scaleCoef);
    this.finish = this.physics.add.image(325 * this.scaleCoef, 325 * this.scaleCoef, 'finish');
    this.finish.setScale(this.scaleCoef);




// *********временные **********************************


    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
/*
    this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });
*/

    /// Лут, враги, звезды
    const coinsKey = [
      'prism',
      'square',
      'ruby',
      'diamond'
    ];

    const enemiesKey = [];

    const lootsKey = [];

    gemPoints.forEach((point) => {
      const coin = this.physics.add.sprite(0, 0, 'gems').play(coinsKey[Math.floor(Math.random() * coinsKey.length)]);
      coin.setX(point.x! * this.scaleCoef);
      coin.setY(point.y! * this.scaleCoef);
      this.physics.add.overlap(this.player, coin, () => {
        coin.disableBody(true, true);
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
        if (this.score === 2) {
          this.isSuccess = true;
          this.checkIfSuccess();
        }
      }, () => { return; }, this);
    });
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px' });
  }

  update(): void {
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.SpawnX, this.SpawnY);
    if (this.player.body.speed > 0 && distance < 7) {
      this.player.body.reset(this.SpawnX, this.SpawnY);
      this.player.stop(true, null);
    }

  }

  async movePlayer(direction: number): Promise<void> {
    return new Promise((res) => {
      switch (direction) {
        case 0:
          this.SpawnY -= this.cell;
          this.target.setPosition(this.SpawnX, this.SpawnY);
          this.physics.moveToObject(this.player, this.target, 80);
          this.player.play('back', true);
          break;
        case 90:
          this.SpawnX += this.cell;
          this.target.setPosition(this.SpawnX, this.SpawnY);
          this.physics.moveToObject(this.player, this.target, 80);
          this.player.play('right', true);
          break;
        case 180:
          this.SpawnY += this.cell;
          this.target.setPosition(this.SpawnX, this.SpawnY);
          this.player.play('front', true);
          this.physics.moveToObject(this.player, this.target, 80);
          break;
        case 270:
          this.SpawnX -= this.cell;
          this.target.setPosition(this.SpawnX, this.SpawnY);
          this.physics.moveToObject(this.player, this.target, 80);
          this.player.play('left', true);
          break;
      }
      setTimeout(() => {
        res();
      }, 800);
    });
  }

  async rotateRight(): Promise<void> {
    return new Promise((res) => {
      this.currentDirection = this.currentDirection === 270 ? 0 : this.currentDirection + 90;
      console.log('right');
      setTimeout(() => {
        res();
      }, 1500);

    });
  }
  async rotateLeft(): Promise<void> {
    return new Promise((res) => {
      this.currentDirection = this.currentDirection === 0 ? 270 : this.currentDirection - 90;
      setTimeout(() => {
        res();
      }, 1500);
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
  // **************формула успешного окончания или нет  по умолчанию ФЕЙЛ*********************

  checkIfSuccess(): void {
    this.isSuccess ? console.log('winnn') : console.log('fail');
  }
}
// не удалять!!
/*function create ()
{
    zone = this.add.zone(300, 200).setSize(200, 200);
    this.physics.world.enable(zone);
    zone.body.setAllowGravity(false);
    zone.body.moves = false;

    var group = this.physics.add.group({
        key: 'block',
        frameQuantity: 4,
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true,
        velocityX: 120,
        velocityY: 60
    });

    this.physics.add.overlap(group, zone);
}

function update ()
{
    zone.body.debugBodyColor = zone.body.touching.none ? 0x00ffff : 0xffff00;
}
 */
