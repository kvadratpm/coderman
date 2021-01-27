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
  platforms!: any;
  player!: any;
  sceneConfig: SceneConfig;


  scaleCoef = window.screen.width * 0.5 / 650;
  cell = window.screen.width * 0.5/13;
  SpawnY!: any;
  SpawnX!: any;
  PointX!: any;
  PointY!: any;
  target!: any;
  isSuccess = false



  constructor(config: SceneConfig) {
    super({ key: 'main' });
    this.sceneConfig = config;
  }


  preload(): void {
    this.load.animation('gemData', 'assets/phaser1/gems.json');
    this.load.atlas('gems', 'assets/phaser1/gems.png', 'assets/phaser1/gems.json');
    this.load.image('tiles', 'assets/map/tiles.png'); // изображение с тайлами - оно одно везде?
    this.load.image('point', 'assets/phaser1/point.png');
    this.load.tilemapTiledJSON(this.sceneConfig.tileMap.key, this.sceneConfig.tileMap.path); // тайлмэп текущего уровня
    this.load.atlas(this.sceneConfig.hero.key, this.sceneConfig.hero.pngPath, this.sceneConfig.hero.jsonPath); // json hero animation
  }

  create(): void {
    this.player = this.physics.add.sprite(400, 350, this.sceneConfig.hero.key, 'front');
    const map = this.make.tilemap({ key: 'map', tileWidth: this.cell, tileHeight: this.cell });
    const tileset = map.addTilesetImage('tiles', 'tiles');
    const layer = map.createLayer(0, tileset, 0, 0);
    layer.setScale(this.scaleCoef);
    const spawnPoint = map.findObject('Items', obj => obj.name === 'Spawn Point');
    const gemPoints = map.filterObjects('Items', elem => elem.name === 'Gem Point');
    console.log(gemPoints);
    layer.setCollisionByProperty({ collides: true });

    this.SpawnX = spawnPoint.x! * this.scaleCoef;
    this.SpawnY = spawnPoint.y! * this.scaleCoef;
    console.log(this.SpawnX, this.SpawnY, this.cell)
    this.target = this.physics.add.image(this.SpawnX, this.SpawnY, 'point')
    this.player = this.physics.add
        .sprite(spawnPoint.x! * this.scaleCoef, spawnPoint.y! * this.scaleCoef, this.sceneConfig.hero.key, 'front')
        .setSize(30, 40)
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
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });


      /// звезды
    const coins = [
        this.physics.add.sprite(0, 0, 'gems').play('prism'),
        this.physics.add.sprite(150, 450, 'gems').play('square'),
        this.physics.add.sprite(450, 450, 'gems').play('ruby'),
        this.physics.add.sprite(450, 150, 'gems').play('diamond')
      ];
    coins.forEach((coin, i) => {
      coin.setX(gemPoints[i].x! * this.scaleCoef);
      coin.setY(gemPoints[i].y! * this.scaleCoef);
    });


    coins.forEach((coin,i) =>{
      coin.setX(gemPoints[i].x! * this.scaleCoef);
      coin.setY(gemPoints[i].y! * this.scaleCoef);
      this.physics.add.overlap(this.player, coin, () => {
          coin.disableBody(true, true)

        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
        if(this.score === 2){
          this.isSuccess = true
          this.checkIfSuccess()
        }
    }, () => { return }, this)
    })


  this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px'})



  }

  update(): void {
    var distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.SpawnX, this.SpawnY);
    if (this.player.body.speed > 0 && distance < 4) {
      this.player.body.reset(this.SpawnX, this.SpawnY);
      this.player.stop(true, null)
    }
  }

  async movePlayer(direction: number): Promise<void> {
    return new Promise((res) => {
      switch (direction) {
        case 0:
         this.SpawnY -= this.cell
          this.target.setPosition(this.SpawnX, this.SpawnY)
          this.physics.moveToObject(this.player, this.target)
          this.player.play('back', true);
          break;
        case 90:
          this.SpawnX += this.cell
          this.target.setPosition(this.SpawnX, this.SpawnY)
          this.physics.moveToObject(this.player, this.target)
          this.player.play('right', true);
          break;
        case 180:
          this.SpawnY += this.cell
          this.target.setPosition(this.SpawnX, this.SpawnY)
         this.player.play('front', true);
          this.physics.moveToObject(this.player, this.target)
          break;
        case 270:
          this.SpawnX -= this.cell
          this.target.setPosition(this.SpawnX, this.SpawnY)
          this.physics.moveToObject(this.player, this.target)
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
      console.log('right')
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
          await this.movePlayer(this.currentDirection)
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

  checkIfSuccess(){
    this.isSuccess ? console.log('winnn') : console.log("fail")
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
