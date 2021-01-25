import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodefieldComponent } from '../components/codefield/codefield.component';
import { GamefieldComponent } from '../components/gamefield/gamefield.component';



@NgModule({
  declarations: [
    CodefieldComponent,
    GamefieldComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CodefieldComponent,
    GamefieldComponent
  ]
})
export class SharedModule { }
