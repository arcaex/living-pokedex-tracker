import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app.module';

/* Allow speed up */
enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
