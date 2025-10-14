import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'not-found-page',
  imports: [CommonModule, ButtonModule],
  templateUrl: './not-found.page.html'
})
export class NotFoundPage {
  constructor(private router: Router) {}
  goHome(){ this.router.navigateByUrl('/'); }
}
