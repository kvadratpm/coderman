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

  plW!: number;

  plH!: number;

  currentDirection!: number;

  @ViewChild('editor') private editor!: ElementRef<HTMLElement>;

  aceEditor!: any;


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
    this.plW = engine.drawWidth / 13;
    this.plH = engine.drawHeight / 13;
    this.player = new ex.Actor({
      width: this.plW,
      height: this.plH,
      x: engine.drawWidth - this.plW / 2 + 1,
      y: engine.drawHeight - this.plH / 2 + 1
    });
    this.player.color = ex.Color.Magenta;
    this.player.body.collider.type = ex.CollisionType.Fixed;
    engine.add(this.player);
    engine.start();
  }

  ngAfterViewInit(): void {
    ace.config.set('fontSize', '20px');
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.setReadOnly(false);
    this.aceEditor.setTheme('ace/theme/twilight');
  }

  updateEditor(event: string): void {
    this.aceEditor.insert(`${event}\n`, false);
    this.aceEditor.navigateFileEnd();
  }

  async movePlayer(direction: number): Promise<void> {
    return new Promise((res) => {
      console.log(direction);
      switch (direction) {
        case 0:
          this.player.vel.setTo(0, -this.plH);
          break;
        case 90:
          this.player.vel.setTo(this.plW, 0);
          break;
        case 180:
          this.player.vel.setTo(0, this.plH);
          break;
        case 270:
          this.player.vel.setTo(-this.plW, 0);
          break;
      }
      setTimeout(() => {
        this.player.vel.setTo(0, 0);
        res();
      }, 1000);
    });
  }

  async rotateRight(): Promise<void> {
    return new Promise((res) => {
      this.player.rotation += 90 * Math.PI / 180;
      this.currentDirection = this.currentDirection === 270 ? 0 : this.currentDirection + 90;
      res();
    });
  }
  async rotateLeft(): Promise<void> {
    return new Promise((res) => {
      this.player.rotation += 90 * Math.PI / 180;
      this.currentDirection = this.currentDirection === 0 ? 270 : this.currentDirection - 90;
      res();
    });
  }

  async start(): Promise<void> {
    const turn = this.aceEditor.getValue().split('\n');
    for (const elem of turn) {
      if (elem === 'movePlayer()') {
        await this.movePlayer(this.currentDirection);
      }
      if (elem === 'rotateRight()') {
        await this.rotateRight();
      }
      if (elem === 'rotateLeft()') {
        await this.rotateLeft();
      }
    }
    console.log('done');
  }
}
