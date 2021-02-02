import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';
import { GameService, SceneConfig } from '../../services/game.service';
import { SettingsMenu } from '../../services/menu.service';

@Component({
  selector: 'app-level5',
  templateUrl: './level5.component.html',
  styleUrls: ['./level5.component.scss']
})

export class Level5Component implements AfterViewInit {

  @ViewChild(CodefieldComponent) codeField!: CodefieldComponent;
  @ViewChild(GamefieldComponent) gameField!: GamefieldComponent;

  sceneConfig: SceneConfig = {
    levelNumber: 5,
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
  isLoading = true;



  constructor(private router: Router) { }

  ngAfterViewInit(): void {
    this.gameField.field.scene.add('level5', this.scene, true);
    this.gameField.field.scene.add('settings', this.settingsMenu, false);
    this.isLoading = false;
  }

}
