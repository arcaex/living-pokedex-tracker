import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ConfigProvider } from '../../providers/config/config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl:NavController, public config:ConfigProvider) {

  }

}
