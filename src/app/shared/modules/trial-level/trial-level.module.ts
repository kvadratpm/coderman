import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrialLevelComponent } from './trial-level.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {path: 'trial-level', component: TrialLevelComponent}
];


@NgModule({
  declarations: [
    TrialLevelComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class TrialLevelModule { }
