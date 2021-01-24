import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';
import { GameService } from '../../services/game.service';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-trial-level',
  templateUrl: './trial-level.component.html',
  styleUrls: ['./trial-level.component.scss'],
  providers: [GameService]
})

export class TrialLevelComponent implements AfterViewInit {

  scene: GameService = new GameService();
  @ViewChild(CodefieldComponent) codeField!: CodefieldComponent;
  @ViewChild(GamefieldComponent) gameField!: GamefieldComponent;

  constructor() { }

  ngAfterViewInit(): void {
    this.gameField.field.scene.add('trial-level', this.scene, true);
  }

}
