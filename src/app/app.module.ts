import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { ActionsPage } from '../pages/actions/actions';
import { DetailPage } from '../pages/detail/detail';

import { Tabs } from '../pages/tabs/tabs';
import { PokemonsPage } from '../pages/pokemons/pokemons';

import { Pokemon } from '../components/pokemon/pokemon';

import { ConfigProvider } from '../providers/config/config';
import { DataProvider } from '../providers/data/data';
import { PokedexProvider } from '../providers/pokedex/pokedex';

import { SearchFilter } from '../pipes/search/search';
import { FilterPipe } from '../pipes/filter/filter';

@NgModule({
  declarations: [
    MyApp,
    PokemonsPage,
    DetailPage,
    ActionsPage,
    Tabs,
    Pokemon,
    SearchFilter,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PokemonsPage,
    DetailPage,
    ActionsPage,
    Tabs,
    Pokemon
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider,
    DataProvider,
    PokedexProvider,
    SocialSharing
  ]
})
export class AppModule {}
