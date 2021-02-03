import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgwWowService } from 'ngx-wow'

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  constructor(private wowService: NgwWowService, private router: Router) {
    this.wowService.init();
   }

  ngOnInit(): void {


  }

  startGame(): void {
    const currentLevel =  parseInt(localStorage.getItem('currentLevel') as string, 10);
    this.router.navigate([`/level${currentLevel}`]);
  }



}
