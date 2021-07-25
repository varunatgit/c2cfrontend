import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-slideout-panel',
  templateUrl: './slideout-panel.component.html',
  styleUrls: ['./slideout-panel.component.scss']
})
export class SlideoutPanelComponent implements OnInit {

  currentTab!:number;

  constructor(private activatedRoute:ActivatedRoute,private router:Router) { 
    this.activatedRoute.paramMap.subscribe(params => {
      this.currentTab = parseInt(params.get('actionNo')!); 
    });
  }

  setCurrentTab(tab:number){
    //this.currentTab = tab;
    this.router.navigateByUrl('my-stats/action/'+tab);
  }

  ngOnInit(): void {
  }
}
