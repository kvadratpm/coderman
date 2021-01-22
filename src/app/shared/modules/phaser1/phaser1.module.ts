import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Phaser1Component } from './phaser1.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: 'phaser1', component: Phaser1Component}
];
@NgModule({
  declarations: [Phaser1Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Phaser1Module { }
