import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';
import { GameService, SceneConfig } from '../../services/game.service';
import { SettingsMenu } from '../../services/menu.service';

@Component({
  selector: 'app-level8',
  templateUrl: './level8.component.html',
  styleUrls: ['./level8.component.scss']
})

export class Level8Component implements AfterViewInit {

  @ViewChild(CodefieldComponent) codeField!: CodefieldComponent;
  @ViewChild(GamefieldComponent) gameField!: GamefieldComponent;

  sceneConfig: SceneConfig = {
    levelNumber: 8,
    codeField: this.codeField,
    tileMap: {
      key: 'map',
      path: 'level8/level8.json'
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
    this.gameField.field.scene.add('level8', this.scene, true);
    this.gameField.field.scene.add('settings', this.settingsMenu, false);
    this.isLoading = false;
  }

}
