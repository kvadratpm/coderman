import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level8Component } from './level8.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: '', component: Level8Component}
];

@NgModule({
  declarations: [
    Level8Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Level8Module { }
