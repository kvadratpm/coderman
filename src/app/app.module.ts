import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgwWowModule } from 'ngx-wow';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartPageComponent } from './shared/components/start-page/start-page.component';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/modules/shared.module';
import { NavpanelComponent } from './shared/components/navpanel/navpanel.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { Level1Module } from './shared/modules/level1/level1.module';
import { Level2Module } from './shared/modules/level2/level2.module';

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
    SharedModule,
    NgwWowModule,
    Level1Module,
    Level2Module
  ],
  exports: [
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
