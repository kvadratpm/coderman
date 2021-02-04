import * as Phaser from 'phaser';
export class Button extends Phaser.GameObjects.Container {
  targetScene: any;
  currentText: any;
  savedGame!: any;
  scene!: any;

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
          this.scene.scene.start(targetScene);
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
