import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';
import { GameService, SceneConfig, SettingsMenu} from '../../services/game.service';

@Component({
  selector: 'app-level2',
  templateUrl: './level2.component.html',
  styleUrls: ['./level2.component.scss']
})

export class Level2Component implements AfterViewInit {

  sceneConfig: SceneConfig = {
    levelNumber: 2,
    tileMap: {
      key: 'map',
      path: 'level1/level1.json'
    },
    hero: {
      key: 'hero1',
      pngPath: 'hero1.png',
      jsonPath: 'hero1.json'
    }
  };

  scene: GameService = new GameService(this.sceneConfig);
  settingsMenu: SettingsMenu = new SettingsMenu();

  @ViewChild(CodefieldComponent) codeField!: CodefieldComponent;
  @ViewChild(GamefieldComponent) gameField!: GamefieldComponent;

  constructor() { }

  ngAfterViewInit(): void {
    this.gameField.field.scene.add('level2', this.scene, true);
    this.gameField.field.scene.add('settings', this.settingsMenu, false);

  }

}
