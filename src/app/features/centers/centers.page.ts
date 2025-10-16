// centers.page.ts
import {Component, computed, signal} from '@angular/core'
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DataService } from '../../shared/data.service';
import {FormsModule} from '@angular/forms'
import {Paginator, PaginatorState} from 'primeng/paginator'

@Component({
  standalone: true,
  selector: 'centers-page',
  imports: [CommonModule, RouterModule, CardModule, TagModule, ButtonModule, InputTextModule, FormsModule, Paginator],
  templateUrl: './centers.page.html',
  styleUrls: ['./centers.page.scss'],
})
export class CentersPage {
  query = '';
  constructor(public data: DataService, private router: Router) {}

  ngOnInit() {
    this.query = this.data.query();   // синхронизация начального значения
  }

  page = signal(0);
  pageSize = signal(12);

  total = computed(() => this.data.filteredCenters().length);

  pagedCenters = computed(() => {
    const all = this.data.filteredCenters();
    const start = this.page() * this.pageSize();
    const end   = Math.min(start + this.pageSize(), all.length);
    return all.slice(start, end);
  });

  firstItemIndex = () => this.page() * this.pageSize();
  lastItemIndex  = () => Math.min(this.firstItemIndex() + this.pageSize(), this.total());

  onPageChange(e: PaginatorState) {
    if (typeof e.page === 'number') this.page.set(e.page);
    if (typeof e.rows === 'number') this.pageSize.set(e.rows);
    // опционально: скроллим к началу списка
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Сброс при изменении фильтров ---
  onQueryChange(v: string) {
    this.data.query.set(v);
    this.page.set(0);
  }

  setCity(city: string | null) {
    this.data.city.set(city);
    this.page.set(0);
  }

  open(id:number){ this.router.navigate(['/centers', id]); }
}
