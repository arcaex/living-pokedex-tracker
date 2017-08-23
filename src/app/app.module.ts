import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { ActionsPage } from '../pages/actions/actions';
import { DetailPage } from '../pages/detail/detail';

import { ConfigProvider } from '../providers/config/config';
import { DataProvider } from '../providers/data/data';
import { PokedexProvider } from '../providers/pokedex/pokedex';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailPage,
    ActionsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailPage,
    ActionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider,
    DataProvider,
    PokedexProvider
  ]
})
export class AppModule {}
