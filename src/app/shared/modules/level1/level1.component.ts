import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';
import { GameService, SceneConfig } from '../../services/game.service';
import { SettingsMenu } from '../../services/menu.service';

@Component({
  selector: 'app-level1',
  templateUrl: './level1.component.html',
  styleUrls: ['./level1.component.scss']
})

export class Level1Component implements AfterViewInit {

  @ViewChild(CodefieldComponent) codeField!: CodefieldComponent;
  @ViewChild(GamefieldComponent) gameField!: GamefieldComponent;

  sceneConfig: SceneConfig = {
    // score: 0,
    levelNumber: 1,
    codeField: this.codeField,
    tileMap: {
      key: 'map',
      path: 'level5/level5.json'
    },
    hero: {
      key: 'emptyhero',
      pngPath: 'emptyhero.png',
      jsonPath: 'emptyhero.json'
    }
  };

  scene: GameService = new GameService(this.sceneConfig);
  settingsMenu: SettingsMenu = new SettingsMenu();



  constructor(private router: Router) { }

  ngAfterViewInit(): void {
    this.gameField.field.scene.add('level1', this.scene, true);
    this.gameField.field.scene.add('settings', this.settingsMenu, false);

  }

}
