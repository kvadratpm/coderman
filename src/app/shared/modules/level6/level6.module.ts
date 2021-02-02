import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level6Component } from './level6.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: '', component: Level6Component}
];

@NgModule({
  declarations: [
    Level6Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Level6Module { }
