import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartPageComponent } from './shared/components/start-page/start-page.component';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';
import { FormsModule } from '@angular/forms';
import { TrialLevelModule } from './shared/modules/trial-level/trial-level.module';
import { SharedModule } from './shared/modules/shared.module';
import { PhaserLevelModule } from './shared/modules/phaser-level/phaser-level.module';
import { NavpanelComponent } from './shared/components/navpanel/navpanel.component';
import { Phaser1Module } from './shared/modules/phaser1/phaser1.module';
import { FooterComponent } from './shared/components/footer/footer.component';
import { Level1Module } from './shared/modules/level1/level1.module';

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    NavpanelComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AceEditorModule,
    FormsModule,
    TrialLevelModule,
    PhaserLevelModule,
    SharedModule,
    Phaser1Module,
    Level1Module
  ],
  exports: [
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
