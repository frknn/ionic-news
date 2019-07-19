import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {


  $_route$: Subscription;
  
  @ViewChild('tabs') tabs: IonTabs
  constructor(private router: ActivatedRoute) { 
  }

  ngOnInit() {
    this.tabs.select('home');
  }

}
