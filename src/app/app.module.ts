import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RatingPaneComponent } from './ratingPane/ratingPane.component';
import { lfmMasterComponent } from './lfm-master/lfm-master.component';
import { TopBarComponent } from './top-bar/top-bar.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports:      [ BrowserModule, HttpClientModule, FormsModule ],
  declarations: [ AppComponent, RatingPaneComponent, lfmMasterComponent, TopBarComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
