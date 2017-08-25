import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { PokedexPage } from '../pages/pokedex/pokedex';
import { ActionsPage } from '../pages/actions/actions';
import { FormsPage } from '../pages/forms/forms';
import { DetailPage } from '../pages/detail/detail';

import { Tabs } from '../pages/tabs/tabs';

import { Pokemon } from '../components/pokemon/pokemon';

import { ConfigProvider } from '../providers/config/config';
import { DataProvider } from '../providers/data/data';
import { PokedexProvider } from '../providers/pokedex/pokedex';

@NgModule({
  declarations: [
    MyApp,
    PokedexPage,
    DetailPage,
    ActionsPage,
    Tabs,
    FormsPage,
    Pokemon
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
    PokedexPage,
    DetailPage,
    ActionsPage,
    Tabs,
    FormsPage,
    Pokemon
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
