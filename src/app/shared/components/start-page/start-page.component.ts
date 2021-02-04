import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgwWowService } from 'ngx-wow';

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
<<<<<<< HEAD
    const currentLevel = parseInt(localStorage.getItem('currentLevel') as string, 10) ? parseInt(localStorage.getItem('currentLevel') as string, 10) : 1;
    this.router.navigate([`/level${currentLevel}`]);
=======
    if (localStorage.getItem('currentLevel')) {
      const currentLevel =  parseInt(localStorage.getItem('currentLevel') as string, 10);
      this.router.navigate([`/level${currentLevel}`]);
    } else {
      this.router.navigate([`/level1`]);
    }
>>>>>>> 001fd23c4fdf90f6913e787cbc151fb1bc215a7a
  }



}
