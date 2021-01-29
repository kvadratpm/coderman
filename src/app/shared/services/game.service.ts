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
  gameSettings!: any;
  defaultSettings: any = [
    { setting: 'music', value: true },
    { setting: 'sfx', value: true }
  ];


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
  isSuccess = false

  //временно
  orc1!: any
  orc2!: any
  hero2!: any
  hero3!: any
  shield!: any
  head!: any
  sword!: any
  finish!: any
  //********* */

  constructor(config: SceneConfig) {
    super({ key: 'main' });
    this.sceneConfig = config;
  }

  preload(): void {
    //*****MeNU*****
    this.load.image('button', 'assets/button/button.png');
    this.load.image('button_pressed', 'assets/button/button_pressed.png');
    this.load.audio('buttonSound', 'assets/audio/putNlay.mp3');
    this.load.audio('backgroundMusic', 'assets/audio/second.mp3');
    //****************************

    this.load.atlas('gems', 'assets/phaser1/gems1.png', 'assets/phaser1/gems1.json');
    this.load.image('tiles', 'assets/map/tiles.png'); // изображение с тайлами - оно одно везде?
    this.load.image('point', 'assets/phaser1/lighter1.png');
    this.load.tilemapTiledJSON(this.sceneConfig.tileMap.key, this.sceneConfig.tileMap.path); // тайлмэп текущего уровня
    this.load.atlas(this.sceneConfig.hero.key, this.sceneConfig.hero.pngPath, this.sceneConfig.hero.jsonPath); // json hero animation

    //**************временные текстуры***************
    this.load.atlas('orc1', 'assets/enemies/orc1.png', 'assets/enemies/orc1.json'); // черт1
    this.load.atlas('orc2', 'assets/enemies/orc2.png', 'assets/enemies/orc2.json'); // черт2
    this.load.atlas('hero2', 'assets/heroes/hero1.png', 'assets/heroes/hero1.json')// hero2
    this.load.atlas('hero3', 'assets/heroes/warrior2.png', 'assets/heroes/warrior2.json') // hero3
    this.load.image('sword', 'assets/armour/sword.png'); // меч
    this.load.image('head', 'assets/armour/head.png'); // шлем
    this.load.image('shield', 'assets/armour/shield.png'); // щит
    this.load.image('finish', 'assets/phaser1/finish.png'); // finish point
    //******************************** */
  }

  create(): void {
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
    this.target = this.physics.add.image(this.SpawnX, this.SpawnY, 'point')
    this.target.setScale(this.scaleCoef);
    this.player = this.physics.add
      .sprite(spawnPoint.x! * this.scaleCoef, spawnPoint.y! * this.scaleCoef, this.sceneConfig.hero.key, 'front')
      .setSize(50, 60)
      .setOffset(0, 24)
      .setScale(window.screen.width * 0.5 / 650);
    this.physics.add.collider(this.player, layer);
    const anims = this.anims;
    anims.create({ key: 'left', frames: anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'left.', start: 0, end: 3, zeroPad: 3 }), frameRate: 10, repeat: -1 });
    anims.create({ key: 'right', frames: anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'right.', start: 0, end: 3, zeroPad: 3 }), frameRate: 10, repeat: -1 });
    anims.create({ key: 'front', frames: anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'front.', start: 0, end: 3, zeroPad: 3 }), frameRate: 10, repeat: -1 });
    anims.create({ key: 'back', frames: anims.generateFrameNames(this.sceneConfig.hero.key, { prefix: 'back.', start: 0, end: 3, zeroPad: 3 }), frameRate: 10, repeat: -1 });

    //*********временные текстуры**********************************
    this.anims.create({ key: 'stand1', frames: this.anims.generateFrameNames('orc1', { prefix: 'stand1.', start: 0, end: 13, zeroPad: 3 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'lay1', frames: this.anims.generateFrameNames('orc1', { prefix: 'lay1.', start: 0, end: 11, zeroPad: 3 }) });
    this.anims.create({ key: 'stand2', frames: this.anims.generateFrameNames('orc2', { prefix: 'stand2.', start: 0, end: 15, zeroPad: 3 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'lay2', frames: this.anims.generateFrameNames('orc2', { prefix: 'lay2.', start: 0, end: 14, zeroPad: 3 }) });
    anims.create({ key: 'left2', frames: anims.generateFrameNames('hero2', { prefix: 'left2.', start: 0, end: 3, zeroPad: 3 }), frameRate: 10, repeat: -1 });
    anims.create({ key: 'right2', frames: anims.generateFrameNames('hero2', { prefix: 'right2.', start: 0, end: 3, zeroPad: 3 }), frameRate: 10, repeat: -1 });
    anims.create({ key: 'front2', frames: anims.generateFrameNames('hero2', { prefix: 'front2.', start: 0, end: 3, zeroPad: 3 }), frameRate: 10, repeat: -1 });
    anims.create({ key: 'back2', frames: anims.generateFrameNames('hero2', { prefix: 'back2.', start: 0, end: 3, zeroPad: 3 }), frameRate: 10, repeat: -1 });
    anims.create({ key: 'wait', frames: anims.generateFrameNames('hero3', { prefix: 'wait.', start: 0, end: 19, zeroPad: 3 }), frameRate: 10, repeat: -1 });


    this.orc1 = this.physics.add
      .sprite(100 * this.scaleCoef, 100 * this.scaleCoef, 'orc1', 'stand1')
      .setScale(window.screen.width * 0.5 / 650);
    this.orc1.play('stand1')
    this.orc2 = this.physics.add
      .sprite(200 * this.scaleCoef, 100 * this.scaleCoef, 'orc2', 'stand2')
      .setScale(window.screen.width * 0.5 / 650);
    this.orc2.play('lay2')
    this.hero2 = this.physics.add
      .sprite(300 * this.scaleCoef, 100 * this.scaleCoef, 'hero2', 'front2')
      .setScale(window.screen.width * 0.5 / 650);
    this.hero3 = this.physics.add
      .sprite(400 * this.scaleCoef, 100 * this.scaleCoef, 'hero3', 'wait')
      .setScale(window.screen.width * 0.5 / 650);
    this.hero3.play('wait')
    this.sword = this.physics.add.image(500 * this.scaleCoef, 100 * this.scaleCoef, 'sword')
    this.sword.setScale(this.scaleCoef)
    this.head = this.physics.add.image(200 * this.scaleCoef, 200 * this.scaleCoef, 'head')
    this.head.setScale(this.scaleCoef)
    this.shield = this.physics.add.image(300 * this.scaleCoef, 200 * this.scaleCoef, 'shield')
    this.shield.setScale(this.scaleCoef)
    this.finish = this.physics.add.image(325 * this.scaleCoef, 325 * this.scaleCoef, 'finish')
    this.finish.setScale(this.scaleCoef)

    //*******************************************
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
      this.physics.add.overlap(this.player, coin, () => {
        coin.disableBody(true, true)

        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
        if (this.score === 2) {
          this.isSuccess = true
          this.checkIfSuccess()
        }
      }, () => { return }, this)
    })
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px' })

    //menu********************************
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

    //**********************************************************************
  }

  update(): void {
    var distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.SpawnX, this.SpawnY);
    if (this.player.body.speed > 0 && distance < 7) {
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
          this.physics.moveToObject(this.player, this.target, 80)
          this.player.play('back', true);
          break;
        case 90:
          this.SpawnX += this.cell
          this.target.setPosition(this.SpawnX, this.SpawnY)
          this.physics.moveToObject(this.player, this.target, 80)
          this.player.play('right', true);
          break;
        case 180:
          this.SpawnY += this.cell
          this.target.setPosition(this.SpawnX, this.SpawnY)
          this.player.play('front', true);
          this.physics.moveToObject(this.player, this.target, 80)
          break;
        case 270:
          this.SpawnX -= this.cell
          this.target.setPosition(this.SpawnX, this.SpawnY)
          this.physics.moveToObject(this.player, this.target, 80)

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

  checkIfSuccess() {
    this.isSuccess ? console.log('winnn') : console.log("fail")
  }
}

export class SettingsMenu extends Phaser.Scene {
  gameSettings!: any;

  constructor() {
    super({ key: 'settings' });
  }
  create() {
    this.gameSettings = JSON.parse(localStorage.getItem('myGameSettings')|| '{}');
    this.add.text(250, 40, 'Settings', {
      fontSize: '56px', color: '#ffffff'
    });
    this.add.text(200, 220, 'Sound Effects',
      { fontSize: '28px', color: '#ffffff' });
    const soundFxButton = new Button(this, 300, 115, '#000', 'button', 'button_pressed', this.gameSettings[1].value === true ? 'On' : 'Off', 'toggle', 'sfx');
    this.add.text(200, 350, 'Music',
      { fontSize: '28px', color: '#ffffff' });
    const musicButton = new Button(this, 300, 180, '#000', 'button', 'button_pressed', this.gameSettings[0].value === true ? 'On' : 'Off', 'toggle', 'music');
    const backButton = new Button(this, 180, 230, '#000', 'button', 'button_pressed', 'Back', 'navigation', 'back', 'main')}

  playButtonSound() {
    if (this.gameSettings[1].value) {
      this.sound.play('buttonSound');
    } else { this.sound.stopAll() }
  }

  toggleItem(button: { name: string; }, text: string) {
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
  scene!: any
  constructor(scene1: Phaser.Scene, x: number, y: number, fontColor: any, key1: string | Phaser.Textures.Texture, key2: string, text: string | string[], type: string, name: string, targetScene?: string) {
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
    button.setScale(0.5*window.screen.width * 0.5 / 650)
    // tslint:disable-next-line:prefer-const
    let buttonText = this.scene.add.text(x, y, text, {
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
