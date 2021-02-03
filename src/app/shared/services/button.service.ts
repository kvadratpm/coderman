import * as Phaser from 'phaser';
import {GameService} from 'src/app/shared/services/game.service'
export class Button extends Phaser.GameObjects.Container {
  targetScene: any;
  currentText: any;
  savedGame!:any
  scene!: any;
  config=JSON.parse(localStorage.getItem('myGameSettings') || '{}')
  levelNum!:any

  constructor(

    scene1: Phaser.Scene,
    x: number, y: number,
    fontColor: any, key1: string | Phaser.Textures.Texture,
    key2: string, text: any, type: string, name: string, targetScene?: string) {
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
    this.levelNum = JSON.parse(localStorage.getItem('saved game') || '{}')
    this.config[2].value.levelNumber = this.levelNum
    this.config[2].value.tileMap.path = `level${this.levelNum}/level${this.levelNum}.json`
    if(this.levelNum<=5){
     this.config[2].value.hero.key = "emptyhero"
     this.config[2].value.hero.pngPath = "emptyhero.png"
     this.config[2].value.hero.jsonPath = "emptyhero.json"
    }else{
     this.config[2].value.hero.key = "hero1"
     this.config[2].value.hero.pngPath = "hero1.png"
     this.config[2].value.hero.jsonPath = "hero1.json"
    }
    console.log(this.config)
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
    button.on('pointerup', ()=>{
      if (type === 'save') {
        localStorage.setItem('saved game', JSON.stringify(JSON.parse(localStorage.getItem('currentLevel') || '{}')))
      }else if (type === 'load') {
        console.log(this.config)

        setTimeout(() => {
          this.scene.scene.stop(this.scene);
          const load = new GameService (this.config)
        }, 300);

      }

    })
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
