import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Level1Component } from './level1/level1.component';
import { Level2Component } from './level2/level2.component';
import { LevelsComponent } from './levels.component';
import { GameComponent } from './level1/game/game.component';

const routes: Routes = [
  {path: 'levels', component: LevelsComponent, children: [
    {path: 'level1', component: Level1Component},
    {path: 'level2', component: Level2Component}
  ]}
];

@NgModule({
  declarations: [
    LevelsComponent,
    Level1Component,
    Level2Component,
    GameComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LevelsModule { }
