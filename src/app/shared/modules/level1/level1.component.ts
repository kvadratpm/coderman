import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';
import { GameService, SceneConfig } from '../../services/game.service';

@Component({
  selector: 'app-level1',
  templateUrl: './level1.component.html',
  styleUrls: ['./level1.component.scss']
})

export class Level1Component implements AfterViewInit {

  sceneConfig: SceneConfig = {
    tileMap: {
      key: 'map',
      path: 'assets/level1/level1.json',
      layers: []
    },
    hero: {
      key: 'hero1',
      pngPath: 'assets/hero/hero1.png',
      jsonPath: 'assets/hero/hero1.json'
    }
  };

  scene: GameService = new GameService(this.sceneConfig);

  @ViewChild(CodefieldComponent) codeField!: CodefieldComponent;
  @ViewChild(GamefieldComponent) gameField!: GamefieldComponent;

  constructor() { }

  ngAfterViewInit(): void {
    this.gameField.field.scene.add('level1', this.scene, true);
  }

}
