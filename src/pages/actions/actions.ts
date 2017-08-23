import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-actions',
    templateUrl: 'actions.html',
})
export class ActionsPage {

    constructor(public navCtrl:NavController, public navParams:NavParams, public alertCtrl:AlertController) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ActionsPage');
    }

    resetConfigs() {
        let alert = this.alertCtrl.create({
            title:"Confirmation",
            message:"Are you sure you want to <strong>reset</strong> all the data? <br /><br /><strong>This operation is irreversible!</strong>",
            buttons: [
                {
                    "text": "No",
                    "role": "cancel"
                },
                {
                    "text": "Yes",
                    handler: () => {
                        console.log("OK");
                    }
                }
            ]
        });
        alert.present();
    }

    mark(state) {
        let alert = this.alertCtrl.create({
            title:"Confirmation",
            message:"Are you sure you want to <strong>" + (state ? "mark" : "unmark") + "</strong> all visible Pokemons",
            buttons: [
                {
                    "text": "No",
                    "role": "cancel"
                },
                {
                    "text": "Yes",
                    handler: () => {
                        console.log("OK");
                    }
                }
            ]
        });
        alert.present();
    }

}
