import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level4Component } from './level4.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: '', component: Level4Component}
];

@NgModule({
  declarations: [
    Level4Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Level4Module { }
