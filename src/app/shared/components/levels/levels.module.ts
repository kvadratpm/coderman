import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LevelsComponent } from './levels.component';
import { FormsModule } from '@angular/forms';
import {TrialLevelComponent} from '../../modules/trial-level/trial-level.component';
import {PhaserLevelComponent} from '../../modules/phaser-level/phaser-level.component';


const routes: Routes = [
  {path: 'levels', component: LevelsComponent, children: [
    {path: 'level1', component: TrialLevelComponent},
    {path: 'level2', component: PhaserLevelComponent},
  ]}
];

@NgModule({
  declarations: [
    LevelsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports: [RouterModule]
})
export class LevelsModule { }
