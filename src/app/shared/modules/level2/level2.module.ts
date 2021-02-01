import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level2Component } from './level2.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: '', component: Level2Component}
];

@NgModule({
  declarations: [
    Level2Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Level2Module { }
