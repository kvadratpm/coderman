import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level7Component } from './level7.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: '', component: Level7Component}
];

@NgModule({
  declarations: [
    Level7Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Level7Module { }
