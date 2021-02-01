import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { StartPageComponent } from './shared/components/start-page/start-page.component';

const routes: Routes = [
  {path: '', component: StartPageComponent},
  {path: 'level1', loadChildren: () => import ('./shared/modules/level1/level1.module'). then(m => m.Level1Module)},
  {path: 'level2', loadChildren: () => import ('./shared/modules/level2/level2.module'). then(m => m.Level2Module)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
