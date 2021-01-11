import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as ex from 'excalibur';
import ace from 'ace-builds/src-noconflict/ace.js';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})


export class GameComponent implements OnInit {

  player!: ex.Actor;

  currentDirection!: number;

  constructor() { }

  ngOnInit(): void {
    this.currentDirection = 0;
    const engine = new ex.Engine({
      canvasElementId: 'game',
      width: window.screen.height * 0.8,
      height: window.screen.width * 0.5
    });
    const txPlayer = new ex.Texture('/assets/bomberman.png');
    engine.backgroundColor = ex.Color.Azure.clone();
    this.player = new ex.Actor({
      width: 50,
      height: 100,
      x: engine.drawWidth - 60,
      y: engine.drawHeight - 60
    });
    this.player.color = ex.Color.Magenta;
    this.player.body.collider.type = ex.CollisionType.Fixed;
    this.player.on('postupdate', () => {
      if (this.player.pos.x + this.player.width > engine.drawWidth) {
        this.player.vel.setTo(0, 0);
      }
    });
    engine.add(this.player);
    engine.start();
    const editor = ace.edit('code-editor');
    editor.setTheme('ace/theme/monokai');
    editor.getSession().setMode('ace/mode/javascript');
  }

  movePlayer(direction: number): void {
    console.log(direction);
    switch (direction) {
      case 0:
        this.player.vel.setTo(0, -100);
        break;
      case 90:
        this.player.vel.setTo(100, 0);
        break;
      case 180:
        this.player.vel.setTo(0, 100);
        break;
      case 270:
        this.player.vel.setTo(-100, 0);
        break;
    }
    setTimeout(() => this.player.vel.setTo(0, 0), 1000);
  }

  rotateRight(): void {
    this.player.rotation += 90 * Math.PI / 180;
    this.currentDirection = this.currentDirection === 270 ? 0 : this.currentDirection + 90;
  }
  rotateLeft(): void {
    this.player.rotation += 90 * Math.PI / 180;
    this.currentDirection = this.currentDirection === 0 ? 270 : this.currentDirection - 90;
  }
}
