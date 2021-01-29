import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';
import { GameService, SceneConfig } from '../../services/game.service';

@Component({
  selector: 'app-trial-level',
  templateUrl: './trial-level.component.html',
  styleUrls: ['./trial-level.component.scss'],
})

export class TrialLevelComponent implements AfterViewInit {

  sceneConfig: SceneConfig = {
    tileMap: {
      key: 'map',
      path: 'assets/phaser1/level1.json',
    },
    hero: {
      key: 'hero1',
      pngPath: 'assets/phaser1/hero1.png',
      jsonPath: 'assets/phaser1/hero1.json'
    }
  };

  scene: GameService = new GameService(this.sceneConfig);

  @ViewChild(CodefieldComponent) codeField!: CodefieldComponent;
  @ViewChild(GamefieldComponent) gameField!: GamefieldComponent;

  constructor() { }

  ngAfterViewInit(): void {
    this.gameField.field.scene.add('trial-level', this.scene, true);
  }

}

/*
    this.load.image('tiles', 'assets/phaser1/back9.png'); // изображение с тайлами
    this.load.tilemapTiledJSON('map', 'assets/phaser1/level1.json'); // тайлмэп текущего уровня
    this.load.atlas('hero1', 'assets/phaser1/hero1.png', 'assets/phaser1/hero1.json'); // json hero animation */
