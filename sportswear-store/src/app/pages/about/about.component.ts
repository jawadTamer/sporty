// @ts-ignore: no types for aos
import * as AOS from 'aos';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-in-out',
    });
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }
}
