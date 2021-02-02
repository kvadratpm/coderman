import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';
import { GameService, SceneConfig } from '../../services/game.service';
import { SettingsMenu } from '../../services/menu.service';

@Component({
  selector: 'app-level9',
  templateUrl: './level9.component.html',
  styleUrls: ['./level9.component.scss']
})

export class Level9Component implements AfterViewInit {

  @ViewChild(CodefieldComponent) codeField!: CodefieldComponent;
  @ViewChild(GamefieldComponent) gameField!: GamefieldComponent;

  sceneConfig: SceneConfig = {
    levelNumber: 9,
    codeField: this.codeField,
    tileMap: {
      key: 'map',
      path: 'level9/level9.json'
    },
    hero: {
      key: 'hero1',
      pngPath: 'hero1.png',
      jsonPath: 'hero1.json'
    }
  };

  scene: GameService = new GameService(this.sceneConfig);
  settingsMenu: SettingsMenu = new SettingsMenu();
  isLoading = true;



  constructor(private router: Router) { }

  ngAfterViewInit(): void {
    this.gameField.field.scene.add('level9', this.scene, true);
    this.gameField.field.scene.add('settings', this.settingsMenu, false);
    this.isLoading = false;
  }

}
