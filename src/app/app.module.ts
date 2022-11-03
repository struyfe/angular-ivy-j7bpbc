import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RatingPaneComponent } from './ratingPane/ratingPane.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports:      [ BrowserModule, HttpClientModule, FormsModule ],
  declarations: [ AppComponent, RatingPaneComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
