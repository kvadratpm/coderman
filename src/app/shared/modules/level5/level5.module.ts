import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level5Component } from './level5.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: '', component: Level5Component}
];

@NgModule({
  declarations: [
    Level5Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Level5Module { }
