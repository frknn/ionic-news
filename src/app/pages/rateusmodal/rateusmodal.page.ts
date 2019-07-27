import { Component, OnInit } from '@angular/core';
import { ViewController } from '@ionic/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { async } from 'q';

@Component({
  selector: 'app-rateusmodal',
  templateUrl: './rateusmodal.page.html',
  styleUrls: ['./rateusmodal.page.scss'],
})
export class RateusmodalPage implements OnInit {

  constructor(private modalController: ModalController, 
    private afs: AngularFirestore, 
    private alertController:AlertController, 
    private router: Router,
    private loadingController: LoadingController) { }
  private content;

  ngOnInit() {
  }
  closeModal(){
    this.modalController.dismiss()
  }
  async kaydet(){
    this.presentLoading();
    /* if(this.content!=="" || this.content!== undefined){
      
      await this.afs.collection('rate').add({content:this.content})
          .then(res => {
            this.ShowAlert("Teşekkürler","Değerlendirmenizi bizimle paylaştığınız için teşekkürler")
          });
    } */
  }
  

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Hellooo',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    this.loadingController.dismiss();
  }
  
  async ShowAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {text:'OK!',
          handler: res=>{
            this.modalController.dismiss()
            }
      }]
    })

    await alert.present();
  }
}
