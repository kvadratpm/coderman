import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrialLevelComponent } from './trial-level.component';
import { RouterModule, Routes } from '@angular/router';
import { CodefieldComponent } from '../../components/codefield/codefield.component';
import { GamefieldComponent } from '../../components/gamefield/gamefield.component';

const routes: Routes = [
  {path: 'trial-level', component: TrialLevelComponent}
];


@NgModule({
  declarations: [
    TrialLevelComponent,
    CodefieldComponent,
    GamefieldComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TrialLevelModule { }
