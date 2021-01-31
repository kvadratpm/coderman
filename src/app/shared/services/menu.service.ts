import * as Phaser from 'phaser';
import {Button} from './button.service'
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

