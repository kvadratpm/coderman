import * as Phaser from 'phaser';
import {Button} from './button.service'
export class SettingsMenu extends Phaser.Scene {
  gameSettings!: any;
  scaleCoef = window.screen.width * 0.5 / 650;
  constructor() {
    super({ key: 'settings' });
  }
  create(): void {
    this.gameSettings = JSON.parse(localStorage.getItem('myGameSettings') || '{}');
    this.add.text(250*this.scaleCoef, 40*this.scaleCoef, 'Menu', {
      fontSize: '56px', color: '#ffffff'
    });
    this.add.text(100*this.scaleCoef, 220*this.scaleCoef, 'Sound Effects',
      { fontSize: '28px', color: '#ffffff' });
    const soundFxButton = new Button(this, 250*this.scaleCoef, 115*this.scaleCoef, '#000', 'button', 'button_pressed', this.gameSettings[1].value === true ? 'On' : 'Off', 'toggle', 'sfx');
    this.add.text(100*this.scaleCoef, 280*this.scaleCoef, 'Music',
      { fontSize: '28px', color: '#ffffff' });
      const musicButton = new Button(this, 250*this.scaleCoef, 150*this.scaleCoef, '#000', 'button', 'button_pressed', this.gameSettings[0].value === true ? 'On' : 'Off', 'toggle', 'music');
      this.add.text(100*this.scaleCoef, 360*this.scaleCoef, 'Save current level',
      { fontSize: '28px', color: '#ffffff' });
      const save = new Button(this, 250*this.scaleCoef, 185*this.scaleCoef, '#000', 'button', 'button_pressed', 'Save', 'save', 'back', 'main');
      this.add.text(100*this.scaleCoef, 420*this.scaleCoef, 'Load saved level',
      { fontSize: '28px', color: '#ffffff' });
      const load = new Button(this, 250*this.scaleCoef, 220*this.scaleCoef, '#000', 'button', 'button_pressed', 'Load', 'load', 'back', 'main');
      const backButton = new Button(this, 180*this.scaleCoef, 260*this.scaleCoef, '#000', 'button', 'button_pressed', 'Back', 'navigation', 'back', 'main');
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

