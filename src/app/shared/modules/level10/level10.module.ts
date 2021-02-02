import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level10Component } from './level10.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: '', component: Level10Component}
];

@NgModule({
  declarations: [
    Level10Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Level10Module { }
