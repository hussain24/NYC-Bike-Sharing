import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppMapComponent } from './Views/app-map/app-map.component';
import { AgmCoreModule } from '@agm/core';
import { NycBikeService } from './Services/nycBikeService.service';
import { httpService } from './Services/httpService.service';
import { HttpClientModule } from '@angular/common/http';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { AppChartsComponent } from './Views/app-charts/app-charts.component';

@NgModule({
  declarations: [
    AppComponent,
    AppMapComponent,
    AppChartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBa9LaTnWMk7VJpXEScJYwL3eF8caJ7-WU',
      libraries: ['geometry']
    }),
    AutocompleteLibModule,
    ChartsModule,
    FormsModule
  ],
  providers: [httpService,
    NycBikeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
