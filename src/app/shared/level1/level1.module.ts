import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeFieldComponent } from './code-field/code-field.component';
import { GameFieldComponent } from './game-field/game-field.component';



@NgModule({
  declarations: [CodeFieldComponent, GameFieldComponent],
  imports: [
    CommonModule
  ]
})
export class Level1Module { }
