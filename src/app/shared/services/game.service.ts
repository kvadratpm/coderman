import { Injectable } from '@angular/core';
import * as ex from 'excalibur';

export interface TargetAtr {
  x: number;
  y: number;
}

@Injectable()
export class GameService {

  player!: ex.Actor;

  targets!: ex.Actor[];

  plW!: number;

  plH!: number;

  currentDirection!: number;

  constructor() { }

  startGame(engine: ex.Engine, direction: number, playerX: number = 0, playerY: number = 0, targetsPos: TargetAtr[] = []): void {
    this.currentDirection = direction;
    this.plW = engine.drawWidth / 13;
    this.plH = engine.drawHeight / 13;
    this.player = new ex.Actor({
      width: this.plW,
      height: this.plH,
      x: engine.drawWidth - this.plW / 2 - this.plW * playerX,
      y: engine.drawHeight - this.plH / 2 - this.plH * playerY
    });
    this.player.color = ex.Color.Magenta;
    this.player.body.collider.type = ex.CollisionType.Fixed;
    targetsPos.forEach((elem) => {
      const target = new ex.Actor({
        width: this.plW,
        height: this.plH,
        x: engine.drawWidth - this.plW / 2 - this.plW * elem.x,
        y: engine.drawHeight - this.plH / 2 - this.plH * elem.y
      });
      target.color = ex.Color.Black;
      target.body.collider.type = ex.CollisionType.Fixed;
      engine.add(target);
    });
    engine.add(this.player);
    engine.backgroundColor = ex.Color.Azure.clone();

    // here
    const map = new ex.TileMap(0, 0, engine.drawWidth / 13, engine.drawHeight / 13, 13, 13);
    engine.add(map);

    engine.start();
  }

  async movePlayer(direction: number): Promise<void> {
    return new Promise((res) => {
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

  async startTurn(cmd: string[]): Promise<void> {
    for (const elem of cmd) {
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
  }
}
