import { Component, OnInit } from '@angular/core';
import * as ex from 'excalibur';

@Component({
  selector: 'app-gamefield',
  templateUrl: './gamefield.component.html',
  styleUrls: ['./gamefield.component.scss']
})
export class GamefieldComponent implements OnInit {

  engine!: ex.Engine;

  constructor() { }

  ngOnInit(): void {
    this.engine = new ex.Engine({
      canvasElementId: 'game',
      width: window.screen.width * 0.5,
      height: window.screen.height * 0.8
    });
  }

  get field(): ex.Engine {
    return this.engine;
  }

}
