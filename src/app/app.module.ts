import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartPageComponent } from './shared/components/start-page/start-page.component';
import { LevelsModule } from './shared/components/levels/levels.module';

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LevelsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
