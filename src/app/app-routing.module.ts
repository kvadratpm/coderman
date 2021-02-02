import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { StartPageComponent } from './shared/components/start-page/start-page.component';
import {LevelsGuard} from './levels.guard';

const routes: Routes = [
  {path: '', component: StartPageComponent},
  {path: 'level1', loadChildren: () => import ('./shared/modules/level1/level1.module'). then(m => m.Level1Module)},
  {path: 'level2', loadChildren: () => import ('./shared/modules/level2/level2.module'). then(m => m.Level2Module), canActivate: [LevelsGuard]},
  {path: 'level3', loadChildren: () => import ('./shared/modules/level3/level3.module'). then(m => m.Level3Module), canActivate: [LevelsGuard]},
  {path: 'level4', loadChildren: () => import ('./shared/modules/level4/level4.module'). then(m => m.Level4Module), canActivate: [LevelsGuard]},
  {path: 'level5', loadChildren: () => import ('./shared/modules/level5/level5.module'). then(m => m.Level5Module), canActivate: [LevelsGuard]},
  {path: 'level6', loadChildren: () => import ('./shared/modules/level6/level6.module'). then(m => m.Level6Module), canActivate: [LevelsGuard]},
  {path: 'level7', loadChildren: () => import ('./shared/modules/level7/level7.module'). then(m => m.Level7Module), canActivate: [LevelsGuard]},
  {path: 'level8', loadChildren: () => import ('./shared/modules/level8/level8.module'). then(m => m.Level8Module), canActivate: [LevelsGuard]},
  {path: 'level9', loadChildren: () => import ('./shared/modules/level9/level9.module'). then(m => m.Level9Module), canActivate: [LevelsGuard]},
  {path: 'level10', loadChildren: () => import ('./shared/modules/level10/level10.module'). then(m => m.Level10Module), canActivate: [LevelsGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
