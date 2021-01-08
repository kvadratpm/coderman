import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LevelsComponent } from './shared/components/levels/levels.component';
import { StartPageComponent } from './shared/components/start-page/start-page.component';

const routes: Routes = [
  {path: '', component: StartPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
