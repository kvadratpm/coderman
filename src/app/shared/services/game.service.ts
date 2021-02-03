import * as Phaser from 'phaser';
import { Button } from './button.service';
import { CodefieldComponent } from '../components/codefield/codefield.component';

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
   * @param score - необходимое количество очков для прохождения уровня
   */
  // score: number;
  /**
   * @param levelNumber - номер уровня
   */
  levelNumber: number;
  codeField: CodefieldComponent;
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
  defaultSettings!: any;

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
  finishX!: any;
  finishY!: any;
  lootCoordinate!: any;
  isLoading = true;

  isMusicOn = false;
  isTaken = false;
  isPut = false;
  isAttack = false;
  position!: any;
  loops: any = [];


  constructor(config: SceneConfig) {
    super({ key: 'main' });
    this.sceneConfig = config;
  }

  preload(): void {
    console.log(this.sceneConfig);
    this.load.image('tiles', 'assets/map/tiles.png');
    this.defaultSettings = [
      { setting: 'music', value: false },
      { setting: 'sfx', value: true },
      {setting: 'saved game', value!: this.sceneConfig}
    ];
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
    this.load.atlas('bronze', 'assets/gems/coin.png', 'assets/gems/coin.json'); // монета
    this.load.image('point', 'assets/points/lighter1.png'); // текущая точка
    this.load.image('finish', 'assets/points/finish.png'); // финишная точка
    this.load.image('deliver', 'assets/points/deliverPoint.png'); // точка для доставки
    // ********
  }

  create(): void {
    console.log(this.defaultSettings);
    const map = this.make.tilemap({ key: 'map', tileWidth: this.cell, tileHeight: this.cell });
    const tileset = map.addTilesetImage('tiles', 'tiles');
    const layer = map.createLayer('Ground', tileset, 0, 0); // id слоя по его названию в тайлсете
    const world = map.createLayer('World', tileset, 0, 0); // id слоя по его названию в тайлсете
    const upperLayout = map.createLayer('UpperLayout', tileset, 0, 0); // id слоя по его названию в тайлсете
    upperLayout.setScale(this.scaleCoef);
    world.setScale(this.scaleCoef);
    layer.setCollisionByProperty({ collides: true });
    layer.setScale(this.scaleCoef);
    const spawnPoint = map.findObject('Items', obj => obj.name === 'Spawn Point');
    const finishPoint = map.findObject('Items', obj => obj.name === 'Finish Point');
    const deliverPoint = map.findObject('Items', obj => obj.name === 'Deliver Point');
    const aliesPoint = map.findObject('Items', obj => obj.name === 'Alies Point');
    const gemPoints = map.filterObjects('Items', elem => elem.name === 'Gem Point');
    const lootPoints = map.filterObjects('Items', elem => elem.name === 'Loot Point');
    const enemiesPoints = map.filterObjects('Items', elem => elem.name === 'Enemy Point');
    layer.setCollisionByProperty({ collides: true });
    world.setCollisionByProperty({ collides: true });
    this.SpawnX = spawnPoint.x! * this.scaleCoef;
    this.SpawnY = spawnPoint.y! * this.scaleCoef;
    this.target = this.physics.add.image(this.SpawnX, this.SpawnY, 'point');
    this.target.setScale(this.scaleCoef);
    this.physics.add.collider(this.target, layer);
    this.physics.add.collider(this.target, world);
    this.player = this.physics.add
      .sprite(spawnPoint.x! * this.scaleCoef, spawnPoint.y! * this.scaleCoef, this.sceneConfig.hero.key, 'back')
      .setSize(45 * this.scaleCoef, 45 * this.scaleCoef)
      .setScale(this.scaleCoef);
    this.physics.add.collider(this.player, layer);
    this.physics.add.collider(this.player, world);

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
    this.anims.create({
      key: 'bronze',
      frames: this.anims.generateFrameNames(
        'bronze',
        { prefix: 'Bronze.', start: 1, end: 9, zeroPad: 3 }
      ),
      repeat: -1,
      frameRate: 10,
    });
    // ****************

    /*
        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        */

    // *** Рендер лута, врагов, камней ***
    if (aliesPoint) {
      const alies = this.physics.add.sprite(aliesPoint.x! * this.scaleCoef, aliesPoint.y! * this.scaleCoef, 'hero3').play('wait');
      alies.setScale(this.scaleCoef * 0.9);
    }

    if (finishPoint) {
      this.levelTarget += 1;
      this.finishX = finishPoint.x! * this.scaleCoef;
      this.finishY = finishPoint.y! * this.scaleCoef;
      const finish = this.physics.add.image(finishPoint.x! * this.scaleCoef, finishPoint.y! * this.scaleCoef, 'finish');
      finish.setScale(this.scaleCoef);
      this.physics.add.overlap(this.player, finish, () => {
        finish.disableBody(true, false);
        this.levelTarget -= 1;
      }, () => { return; }, this);
    }

    if (deliverPoint) {
      this.levelTarget += 1;
      const deliver = this.physics.add.image(deliverPoint.x! * this.scaleCoef, deliverPoint.y! * this.scaleCoef, 'deliver');
      deliver.setScale(this.scaleCoef);
      this.physics.add.overlap(this.player, deliver, () => {

        if (deliver.x + deliver.y - this.player.x - this.player.y < Math.abs(20) && this.isPut) {
          this.isPut = false;
          this.levelTarget -= 1;
        }
      });
    }

    if (gemPoints) {
      this.levelTarget += gemPoints.length;
      gemPoints.forEach((point) => {
        const coin = this.physics.add.sprite(0, 0, 'gems').play(point.properties[0].value);
        coin.setX(point.x! * this.scaleCoef);
        coin.setY(point.y! * this.scaleCoef);
        coin.setScale(this.scaleCoef * 0.8);
        this.physics.add.overlap(this.player, coin, () => {
          coin.disableBody(true, true);
          this.levelTarget -= 1;
        }, () => { return; }, this);
      });
    }

    if (enemiesPoints) {
      this.levelTarget += enemiesPoints.length;
      enemiesPoints.forEach((point) => {
        const enemy = this.physics.add.sprite(0, 0, `orc${point.properties[0].value}`).play(`stand${point.properties[0].value}`)
          .setSize(70 * this.scaleCoef, 70 * this.scaleCoef)
          .setX(point.x! * this.scaleCoef)
          .setY(point.y! * this.scaleCoef)
          .setScale(this.scaleCoef );

        this.physics.add.overlap(this.player, enemy, () => {
          console.log(enemy.x + enemy.y - this.player.x - this.player.y);
          if ( enemy.x + enemy.y - this.player.x - this.player.y < Math.abs(66) && this.isAttack) {
            enemy.play(`lay${point.properties[0].value}`);
            this.isAttack = false;
            this.levelTarget -= 1;
          }
        }, () => { return; }, this);
      });
    }
    if (lootPoints) {
      this.levelTarget += lootPoints.length;
      lootPoints.forEach((point) => {
        const loot = this.physics.add.sprite(0, 0, point.properties[0].value).play(point.properties[0].value);
        loot.setX(point.x! * this.scaleCoef);
        loot.setY(point.y! * this.scaleCoef);
        loot.setScale(this.scaleCoef * 0.8);
        this.physics.add.overlap(this.player, loot, () => {
          console.log(loot.x + loot.y - this.player.x - this.player.y);
          if (loot.x + loot.y - this.player.x - this.player.y < Math.abs(15) && this.isTaken) {
            loot.disableBody(true, true);
            this.isTaken = false;
            this.levelTarget -= 1;
          }
        }, () => { return; }, this);
      });
    }




    // **************
    this.gameSettings = JSON.parse(localStorage.getItem('myGameSettings') || '{}');
    if (this.gameSettings === null || this.gameSettings.length <= 0 || this.gameSettings.length === undefined) {
      localStorage.setItem('myGameSettings', JSON.stringify(this.defaultSettings));
      this.gameSettings = this.defaultSettings;
    }

    const settingsButton = new Button(this, 310, 7, '#000', 'button', 'button_pressed', 'Menu', 'navigation', 'settings', 'settings');

    const music = this.sound.add('backgroundMusic', {
      mute: false,
      volume: 0.1,
      rate: 1,
      loop: true,
      delay: 200
    });

    if (this.gameSettings[0].value && !this.isMusicOn) {
      music.play();
      this.isMusicOn = true;
    } else if (!this.gameSettings[0].value) {
      music.stop();
      this.sound.stopAll();
      this.isMusicOn = false;
    }
  }

  playButtonSound(): void {
    if (this.gameSettings[1].value) {
      this.sound.play('buttonSound');
    }
  }

  update(): void {
    this.isLoading = false;
    const distancePlayertoTarget = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.SpawnX, this.SpawnY);
    if (this.player.body.speed > 0 && distancePlayertoTarget < 7) {
      this.player.body.reset(this.SpawnX, this.SpawnY);
      this.player.stop(true, null);
    }
  }

  async movePlayer(direction: number): Promise<void> {
    return new Promise((res) => {
      if (this.gameSettings[0].value) { this.sound.play('step'); }
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

  async attack(): Promise<void> {
    return new Promise((res) => {
      if (this.gameSettings[0].value) { this.sound.play('fight'); }
      this.isAttack = true;

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
  async take(): Promise<void> {
    return new Promise((res) => {
      this.isTaken = true;
      setTimeout(() => {
        res();
      }, 1500);
    });
  }
  async put(): Promise<void> {
    return new Promise((res) => {
      this.isPut = true;
      setTimeout(() => {
        res();
      }, 1500);
    });
  }

  async turn(commands: string[]): Promise<void> {
    console.log(commands);
    for (const elem of commands) {
      if (this.isRestart) {
        this.isRestart = false;
        break;
      }
      if (elem.includes('loopN')) {
        const num = Number(elem.match(/\d+/));
        const inCmd = this.loops[num];
        const steps = Number(inCmd[0].match(/\d+/));
        for (let i = 0; i < steps; i++) {
          await this.turn(inCmd);
        }
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
      if (elem.includes('Take')) {
        await this.take();
      }
      if (elem.includes('Put')) {
        await this.put();
      }
    }
  }

  async startTurn(codeField: CodefieldComponent): Promise<void> {
    const cmd = codeField.code.filter((elem) => elem !== '');
    const loopStart: number[] = [];
    const loopEnd: number[] = [];
    cmd.forEach((elem, i) => {
      if (elem.includes('loop')) {
        loopStart.push(i);
      }
      if (elem.includes('end')) {
        loopEnd.push(i);
      }
    });
    let acc = 0;
    if (loopStart) {
      loopStart.forEach((elem, i) => {
        const start = elem - acc;
        const end = loopEnd[i] - acc;
        const loop = cmd.splice(start, end - start + 1, `loopN ${this.loops.length}`);
        this.loops.push(loop);
        acc += loop.length - 1;
      });
    }
    await this.turn(cmd).then(() => this.checkIfSuccess(codeField));
  }



  checkIfSuccess(codeField: CodefieldComponent): void {

    const distancePlayertofinish = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.finishX, this.finishY);
    console.log(distancePlayertofinish);
    if (distancePlayertofinish < 50 && this.levelTarget === 0) {
      codeField.openWinPopup();
      if (this.gameSettings[0].value) {
        this.sound.play('success');
      }

    } else {
      codeField.openLosePopup();
      this.levelTarget = 0;
      this.currentDirection = 0;

      if (this.gameSettings[0].value) {
        this.sound.play('fail');
      }
      setTimeout(() => {
        this.scene.restart();
      }, 3000);
    }
  }
    restart(): void {

    this.levelTarget = 0;
    this.currentDirection = 0;
    this.loops = [];
    this.scene.restart();
  }
}

