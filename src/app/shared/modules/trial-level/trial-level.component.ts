import { ViewChild } from '@angular/core';
import { Component, ContentChild, OnInit } from '@angular/core';
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

  @ViewChild(CodefieldComponent) codeField!: CodefieldComponent;
  @ViewChild(GamefieldComponent) gameField!: GamefieldComponent;

  constructor(public gameService: GameService) { }

  ngAfterViewInit(): void {
    this.gameService.startGame(this.gameField.field, 0);
  }

}
