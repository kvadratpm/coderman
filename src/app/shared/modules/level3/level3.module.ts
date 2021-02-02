import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level3Component } from './level3.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: '', component: Level3Component}
];

@NgModule({
  declarations: [
    Level3Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Level3Module { }
