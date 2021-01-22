import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaserLevelComponent } from './phaser-level.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: 'phaser-level', component: PhaserLevelComponent}
];

@NgModule({
  declarations: [PhaserLevelComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PhaserLevelModule { }
