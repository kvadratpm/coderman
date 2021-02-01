import * as Phaser from 'phaser';
import { Button } from './button.service';

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
   * @param levelNumber - номер уровня
   */
  levelNumber: number;
  /**
   * @param tileMap - параметры тайлмэпа текущего уровня
   */
  tileMap: {
    /**
     * @param tileMap.key - ключ создаваемого уровня, используем именование level1, level2 и так далее
     */
    key: string,
    /**
     * @param tileMap.path - путь до файла, достаточно указать папку с уровнем и json файл
     */
    path: string,
  };
  /**
   * @param hero - параметры спрайта героя
   */
  hero: {
    /**
     * @param hero.key - ключ спрайта, именуем в соотвествии с используемым спрайтом,
     * например, используем спрайт hero1.png, ключ называем hero1
     */
    key: string,
    /**
     * @param hero.pngPath - имя png файла с героем
     */
    pngPath: string,
    /**
     * @param hero.jsonPath - имя json файла с героем
     */
    jsonPath: string
  };
}

export class GameService extends Phaser.Scene {
  gameSettings!: any;
  defaultSettings: any = [
    { setting: 'music', value: false },
    { setting: 'sfx', value: true }
  ];

  currentDirection = 0;
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
  isRestart = false;

  constructor(config: SceneConfig) {
    super({ key: 'main' });
    this.sceneConfig = config;
  }

  preload(): void {
    this.load.image('tiles', 'assets/map/tiles.png');

    this.load.tilemapTiledJSON(
      this.sceneConfig.tileMap.key,
      `assets/levels/${this.sceneConfig.tileMap.path}`
    ); // тайл уровня

    this.load.atlas(
      this.sceneConfig.hero.key,
      `assets/heroes/${this.sceneConfig.hero.pngPath}`,
      `assets/heroes/${this.sceneConfig.hero.jsonPath}`
    ); // тайл героя

    // *****MeNU*****
    this.load.image('button', 'assets/button/button.png');
    this.load.image('button_pressed', 'assets/button/button_pressed.png');
    this.load.audio('buttonSound', 'assets/audio/putNlay.mp3');
    this.load.audio('backgroundMusic', 'assets/audio/second.mp3');
    this.load.audio('fail', 'assets/audio/fail.mp3');
    this.load.audio('success', 'assets/audio/success.mp3');
    this.load.audio('fight', 'assets/audio/fight.mp3');
    this.load.audio('step', 'assets/audio/step.mp3');
    this.load.audio('takestuff', 'assets/audio/takestuff.mp3');
    this.load.audio('putNplay', 'assets/audio/putNplay.mp3');

    // ****************************

    // ***Персонажи и текстуры***
    this.load.atlas('orc1', 'assets/enemies/orc1.png', 'assets/enemies/orc1.json'); // орк1
    this.load.atlas('orc2', 'assets/enemies/orc2.png', 'assets/enemies/orc2.json'); // орк2
    this.load.atlas('hero3', 'assets/heroes/warrior2.png', 'assets/heroes/warrior2.json'); // странствующий рыцарь
    this.load.image('sword', 'assets/armour/sword.png'); // меч
    this.load.image('head', 'assets/armour/head.png'); // шлем
    this.load.image('shield', 'assets/armour/shield.png'); // щит
    this.load.atlas('gems', 'assets/gems/gems1.png', 'assets/gems/gems1.json'); // камни
    this.load.image('point', 'assets/points/lighter1.png'); // текущая точка
    this.load.image('finish', 'assets/points/finish.png'); // финишная точка
    // ********
  }

  create(): void {

    console.log(this.defaultSettings);
    const map = this.make.tilemap({ key: 'map', tileWidth: this.cell, tileHeight: this.cell });
    const tileset = map.addTilesetImage('tiles', 'tiles');
    const layer = map.createLayer('Ground', tileset, 0, 0); // id слоя по его названию в тайлсете
    layer.setScale(this.scaleCoef);
    const spawnPoint = map.findObject('Items', obj => obj.name === 'Spawn Point');
    const finishPoint = map.findObject('Items', obj => obj.name === 'Finish Point');
    const gemPoints = map.filterObjects('Items', elem => elem.name === 'Gem Point');
    const lootPoints = map.filterObjects('Items', elem => elem.name === 'Loot Point');
    const enemiesPoints = map.filterObjects('Items', elem => elem.name === 'Enemy Point');
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

    // ***Анимации героя***
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNames(
        this.sceneConfig.hero.key,
        { prefix: 'left.', start: 0, end: 3, zeroPad: 3 }
      ),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'right.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'front',
      frames: this.anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'front.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'back',
      frames: this.anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'back.', start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'left.attack',
      frames: this.anims.generateFrameNames(
        this.sceneConfig.hero.key,
        { prefix: 'left.attack.', start: 0, end: 14, zeroPad: 3 }
      ),
      frameRate: 15
    });
    this.anims.create({
      key: 'right.attack',
      frames: this.anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'right.attack.', start: 0, end: 14, zeroPad: 3 }),
      frameRate: 15
    });
    this.anims.create({
      key: 'front.attack',
      frames: this.anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'front.attack.', start: 0, end: 12, zeroPad: 3 }),
      frameRate: 15
    });
    this.anims.create({
      key: 'back.attack',
      frames: this.anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'back.attack.', start: 0, end: 14, zeroPad: 3 }),
      frameRate: 15
    });
    // *************************

    // ***Анимации врагов ***/
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
      frameRate: 5, repeat: -1
    });
    this.anims.create({
      key: 'lay2',
      frames: this.anims.generateFrameNames('orc2', { prefix: 'lay2.', start: 0, end: 14, zeroPad: 3 })
    });
    this.anims.create({
      key: 'wait',
      frames: this.anims.generateFrameNames('hero3', { prefix: 'wait.', start: 0, end: 19, zeroPad: 3 }),
      frameRate: 10, repeat: -1
    });

    // *** Анимации камней ****/
    this.anims.create({
      key: 'diamond',
      frames: this.anims.generateFrameNames(
        'gems',
        { prefix: 'diamond_', end: 15, zeroPad: 4 }
      ),
      repeat: -1
    });
    this.anims.create({
      key: 'prism',
      frames: this.anims.generateFrameNames(
        'gems',
        { prefix: 'prism_', end: 6, zeroPad: 4 }
      ),
      repeat: -1
    });
    this.anims.create({
      key: 'ruby',
      frames: this.anims.generateFrameNames(
        'gems',
        { prefix: 'ruby_', end: 6, zeroPad: 4 }
      ),
      repeat: -1
    });
    this.anims.create({
      key: 'square',
      frames: this.anims.generateFrameNames(
        'gems',
        { prefix: 'square_', end: 14, zeroPad: 4 }
      ),
      repeat: -1
    });
    // ****************

    /*
        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        */

    // *** Рендер лута, врагов, камней ***
    if (gemPoints) {
      this.levelTarget = gemPoints.length;
      gemPoints.forEach((point) => {
        const coin = this.physics.add.sprite(0, 0, 'gems').play(point.properties[0].value);
        coin.setX(point.x! * this.scaleCoef);
        coin.setY(point.y! * this.scaleCoef);
        coin.setScale(this.scaleCoef);
        this.physics.add.overlap(this.player, coin, () => {
          coin.disableBody(true, true);
          this.levelTarget -= 1;
        }, () => { return; }, this);
      });
    }

    if (enemiesPoints) {
      enemiesPoints.forEach((point) => {
        const enemy = this.physics.add.sprite(0, 0, `orc${point.properties[0].value}`).play(`stand${point.properties[0].value}`);
        enemy.setX(point.x! * this.scaleCoef);
        enemy.setY(point.y! * this.scaleCoef);
        enemy.setScale(this.scaleCoef);
        this.physics.add.overlap(this.player, enemy, () => {
          enemy.disableBody(true, true);
          this.levelTarget -= 1;
        }, () => { return; }, this);
      });
    }

    if (lootPoints) {
      lootPoints.forEach((point) => {
        const loot = this.physics.add.sprite(0, 0, point.properties[0].value);
        loot.setX(point.x! * this.scaleCoef);
        loot.setY(point.y! * this.scaleCoef);
        loot.setScale(this.scaleCoef);
        this.physics.add.overlap(this.player, loot, () => {
          loot.disableBody(true, true);
          this.levelTarget -= 1;
        }, () => { return; }, this);
      });
    }

    if (finishPoint) {
      const finish = this.physics.add.sprite(finishPoint.x!, finishPoint.y!, 'finish');
      finish.setScale(this.scaleCoef);
    }
    // **************
    this.gameSettings = JSON.parse(localStorage.getItem('myGameSettings') || '{}');
    console.log(this.gameSettings.length);
    if (this.gameSettings === null  || this.gameSettings.length <= 0 || this.gameSettings.length === undefined) {
      localStorage.setItem('myGameSettings', JSON.stringify(this.defaultSettings));
      this.gameSettings = this.defaultSettings;
      console.log(this.gameSettings);
    }

    const settingsButton = new Button(this, 310, 7, '#000', 'button', 'button_pressed', 'Settings', 'navigation', 'settings', 'settings');

    const music = this.sound.add('backgroundMusic', {
      mute: false,
      volume: 0.1,
      rate: 1,
      loop: true,
      delay: 200
    });

    if (this.gameSettings[0].value) {
      console.log(this.gameSettings[0].value);
      music.play();
    } else if (!this.gameSettings[0].value) {
      music.stop();
      this.sound.stopAll();
      console.log(this.gameSettings[0].value);
    }
  }

  playButtonSound(): void {
    if (this.gameSettings[1].value) {
      this.sound.play('buttonSound');
    }
  }

  update(): void {
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.SpawnX, this.SpawnY);
    if (this.player.body.speed > 0 && distance < 7) {
      this.player.body.reset(this.SpawnX, this.SpawnY);
      this.player.stop(true, null);
      console.log('STOP');
    }
  }

  async movePlayer(direction: number): Promise<void> {
    return new Promise((res) => {
      this.sound.play('step');
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
      this.sound.play('step');
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

  async attack(): Promise<void> {
    return new Promise((res) => {
      this.sound.play('fight');
      switch (this.currentDirection) {
        case 0:
          this.player.play('back.attack', true);
          break;
        case 90:
          this.player.play('right.attack', true);
          break;
        case 180:
          this.player.play('front.attack', true);
          break;
        case 270:
          this.player.play('left.attack', true);
          break;
      }
      setTimeout(() => {
        res();
      }, 1500);
    });
  }


  async startTurn(cmd: string[]): Promise<void> {
    for (const elem of cmd) {
      if (this.isRestart) {
        this.isRestart = false;
        break;
      }
      if (elem.includes('move')) {
        const steps = Number(elem.match(/\d+/));
        for (let i = 0; i < steps; i++) {
          await this.movePlayer(this.currentDirection);
          if (this.isRestart) {
            this.isRestart = false;
            break;
          }
        }
      }
      if (elem.includes('rotateRight')) {
        await this.rotateRight();
      }
      if (elem.includes('rotateLeft')) {
        await this.rotateLeft();
      }
      if (elem.includes('Attack')) {
        await this.attack();
      }
    }
    this.checkIfSuccess();
  }

  checkIfSuccess(): void {
    if (this.levelTarget === 0) {
      this.sound.play('success');
      alert('win!');
    } else {
      this.sound.play('fail');
      alert(this.levelTarget);
    }
    this.scene.restart();
  }

  restart(): void {
    this.isRestart = true;
    this.scene.restart();
  }
}

