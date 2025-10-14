// centers.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DataService } from '../../shared/data.service';
import {FormsModule} from '@angular/forms'

@Component({
  standalone: true,
  selector: 'centers-page',
  imports: [CommonModule, RouterModule, CardModule, TagModule, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './centers.page.html',
  styleUrls: ['./centers.page.scss'],
})
export class CentersPage {
  query = '';
  constructor(public data: DataService, private router: Router) {}
  open(id:number){ this.router.navigate(['/centers', id]); }

  ngOnInit() {
    this.query = this.data.query();   // синхронизация начального значения
  }

  onQueryChange(v: string) {
    this.data.query.set(v);
  }
}
