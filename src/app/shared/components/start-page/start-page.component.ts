import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow'

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  constructor(private wowService: NgwWowService) {
    this.wowService.init();
   }

  ngOnInit(): void {
    

  }



}
