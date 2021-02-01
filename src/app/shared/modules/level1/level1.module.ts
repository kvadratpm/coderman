import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level1Component } from './level1.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: '', component: Level1Component}
];

@NgModule({
  declarations: [
    Level1Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Level1Module { }
