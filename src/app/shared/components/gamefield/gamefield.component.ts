import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';


@Component({
  selector: 'app-gamefield',
  templateUrl: './gamefield.component.html',
  styleUrls: ['./gamefield.component.scss']
})
export class GamefieldComponent implements OnInit {

  game!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      scale: {
        parent: 'phaser',
        mode: Phaser.Scale.FIT,
        width: window.screen.width * 0.5,
        height: window.screen.width * 0.5,

      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }
        }
      }
    };
  }

  ngOnInit(): void {
    this.game = new Phaser.Game(this.config);
  }

  get field(): Phaser.Game {
    return this.game;
  }

}
