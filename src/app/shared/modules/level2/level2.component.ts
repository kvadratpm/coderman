import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';
import { GameService } from '../../services/game.service';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-level2',
  templateUrl: './level2.component.html',
  styleUrls: ['./level2.component.scss'],
  providers: [GameService]
})
export class Level2Component implements AfterViewInit {

  @ViewChild(CodefieldComponent) codeField!: CodefieldComponent;
  @ViewChild(GamefieldComponent) gameField!: GamefieldComponent;

  constructor(public gameService: GameService) { }

  ngAfterViewInit(): void {
    this.gameService.startGame(this.gameField.field, 0, 1, 1);
  }

}
