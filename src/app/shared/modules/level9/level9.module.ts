import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level9Component } from './level9.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: '', component: Level9Component}
];

@NgModule({
  declarations: [
    Level9Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Level9Module { }
