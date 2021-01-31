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
    { setting: 'music', value: true },
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
      frameRate: 5, repeat: -1 });
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
    if (this.gameSettings === null || this.gameSettings.length <= 0) {
      localStorage.setItem('myGameSettings', JSON.stringify(this.defaultSettings));
      this.gameSettings = this.defaultSettings;
      console.log(this.gameSettings)
    }

    const settingsButton = new Button(this, 310, 7, '#000', 'button', 'button_pressed', 'Settings', 'navigation', 'settings', 'settings');

    const music = this.sound.add('backgroundMusic', {
      mute: false,
      volume: 0.2,
      rate: 1,
      loop: true,
      delay: 200
    });



    if (this.gameSettings[0].value) {
      console.log(this.gameSettings[0].value)
      music.play();
    } else if (!this.gameSettings[0].value) {
      music.stop()
      this.sound.stopAll()
      console.log(this.gameSettings[0].value);
    }
  }

  playButtonSound() {
    if (this.gameSettings[1].value) {
      this.sound.play('buttonSound');
    }
  }



  update(): void {
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.SpawnX, this.SpawnY);
    if (this.player.body.speed > 0 && distance < 7) {
      this.player.body.reset(this.SpawnX, this.SpawnY);
      this.player.stop(true, null);
      console.log("STOP")
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
    }
    this.checkIfSuccess();
  }

  checkIfSuccess(): void {
    if (this.levelTarget === 0) {
      alert('win!');
    } else {
      alert(this.levelTarget);
    }
    this.scene.restart();
  }

  restart(): void {
    this.isRestart = true;
    this.scene.restart();
  }
}

export class SettingsMenu extends Phaser.Scene {
  gameSettings!: any;

  constructor() {
    super({ key: 'settings' });
  }
  create(): void {
    this.gameSettings = JSON.parse(localStorage.getItem('myGameSettings') || '{}');
    this.add.text(250, 40, 'Settings', {
      fontSize: '56px', color: '#ffffff'
    });
    this.add.text(200, 220, 'Sound Effects',
      { fontSize: '28px', color: '#ffffff' });
    const soundFxButton = new Button(this, 300, 115, '#000', 'button', 'button_pressed', this.gameSettings[1].value === true ? 'On' : 'Off', 'toggle', 'sfx');
    this.add.text(200, 350, 'Music',
      { fontSize: '28px', color: '#ffffff' });
    const musicButton = new Button(this, 300, 180, '#000', 'button', 'button_pressed', this.gameSettings[0].value === true ? 'On' : 'Off', 'toggle', 'music');
    const backButton = new Button(this, 180, 230, '#000', 'button', 'button_pressed', 'Back', 'navigation', 'back', 'main');
  }

  playButtonSound(): void {
    if (this.gameSettings[1].value) {
      this.sound.play('buttonSound');
    } else { this.sound.pauseAll(); }
  }

  toggleItem(button: { name: string; }, text: string): void {
    if (button.name === 'sfx') {
      this.gameSettings[1].value = text === 'On' ? true : false;
    } else if (button.name === 'music') {
      this.gameSettings[0].value = text === 'On' ? true : false;
    }
    localStorage.setItem('myGameSettings',
      JSON.stringify(this.gameSettings));
  }
}

class Button extends Phaser.GameObjects.Container {
  targetScene: any;
  currentText: any;
  scene!: any;
  constructor(
    scene1: Phaser.Scene,
    x: number, y: number,
    fontColor: any, key1: string | Phaser.Textures.Texture,
    key2: string, text: string | string[], type: string, name: string, targetScene?: string) {
    super(scene1);
    this.scene = scene1;
    this.x = x;
    this.y = y;
    this.name = name;
    if (type === 'navigation') {
      this.targetScene = targetScene;
    } else if (type === 'toggle') {
      this.currentText = text;
    }
    const button = this.scene.add.image(x, y, key1).setInteractive();
    button.setScale(0.5 * window.screen.width * 0.5 / 650);
    const buttonText = this.scene.add.text(x, y, text, {
      fontSize: '16px', color: fontColor
    });

    Phaser.Display.Align.In.Center(buttonText, button);
    this.add(button);
    this.add(buttonText);
    button.on('pointerdown', () => {
      button.setTexture(key2);
      this.scene.playButtonSound();
    });
    button.on('pointerup', () => {
      button.setTexture(key1);
      if (this.targetScene) {
        setTimeout(() => {
          this.scene.scene.launch(targetScene);
          this.scene.scene.stop(this.scene);
        }, 300);
      } else if (this.currentText) {
        buttonText.text = buttonText.text === 'On' ? 'Off' : 'On';
        this.scene.toggleItem(this, buttonText.text);
      }
    });
    this.scene.add.existing(this);
  }
}
