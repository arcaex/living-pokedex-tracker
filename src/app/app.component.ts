import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ConfigProvider } from '../providers/config/config';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any;

    constructor(platform:Platform, statusBar:StatusBar, splashScreen:SplashScreen, public config:ConfigProvider) {

        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();

            /* Load the configs */
            this.config.load().then(result => {
                this.rootPage = HomePage;
            });
        });
    }

    configChanged(ev, type) {
        console.log("CONFIG CHANGED: " + ev);
        this.config.save();
    }
}

