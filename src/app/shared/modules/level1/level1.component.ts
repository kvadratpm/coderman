import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';
import { GameService, SceneConfig, SettingsMenu} from '../../services/game.service';

@Component({
  selector: 'app-level1',
  templateUrl: './level1.component.html',
  styleUrls: ['./level1.component.scss']
})

export class Level1Component implements AfterViewInit {

  sceneConfig: SceneConfig = {
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
    this.gameField.field.scene.add('level1', this.scene, true);
    this.gameField.field.scene.add('settings', this.settingsMenu, false);

  }

}
