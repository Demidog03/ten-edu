import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../../shared/data.service';

@Component({
  standalone: true,
  selector: 'programs-page',
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonModule],
  templateUrl: './programs.page.html',
  styleUrls: ['./programs.page.scss'],
})
export class ProgramsPage {
  query = '';

  ngOnInit() {
    this.query = this.data.query();   // синхронизация начального значения
  }

  onQueryChange(v: string) {
    this.data.query.set(v);
  }
  constructor(public data: DataService) {}
}
