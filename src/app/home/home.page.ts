import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  progress = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.progress = 0;
    const interval = setInterval(() => {
      this.progress += 10; 
      if (this.progress >= 100) {
        clearInterval(interval);
        this.router.navigate(['/menu']); 
      }
    }, 100);
  }
}
