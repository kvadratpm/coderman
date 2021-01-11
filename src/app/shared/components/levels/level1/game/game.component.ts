import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as ex from 'excalibur';
import * as ace from 'ace-builds';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})


export class GameComponent implements OnInit, AfterViewInit {

  player!: ex.Actor;

  currentDirection!: number;

  @ViewChild('editor') private editor!: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit(): void {
    this.currentDirection = 0;
    const engine = new ex.Engine({
      canvasElementId: 'game',
      width: window.screen.width * 0.5,
      height: window.screen.height * 0.8
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
  }

  ngAfterViewInit(): void {
    ace.config.set('fontSize', '14px');
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
    const editor = ace.edit(this.editor.nativeElement);
    editor.session.setValue('<h1>Ace Editor works great in Angular!</h1>');
    editor.setTheme('ace/theme/twilight');
    editor.session.setMode('ace/mode/html');
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
