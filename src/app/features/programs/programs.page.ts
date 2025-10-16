import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import {PaginatorModule, PaginatorState} from 'primeng/paginator'
import { Router } from '@angular/router';
import { DataService } from '../../shared/data.service';

@Component({
  standalone: true,
  selector: 'programs-page',
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonModule, TagModule, PaginatorModule],
  templateUrl: './programs.page.html',
  styleUrls: ['./programs.page.scss'],
})
export class ProgramsPage {
  constructor(public data: DataService, private router: Router) {}

  // поиск (синхронизация с сервисом)
  query = '';
  ngOnInit() { this.query = this.data.query(); }
  onQueryChange(v: string) { this.data.query.set(v); }

  // пагинация
  page = signal(0);          // номер страницы (0-based)
  pageSize = signal(12);     // размер страницы
  total = computed(() => this.data.filteredPrograms().length);

  pagedPrograms = computed(() => {
    const all = this.data.filteredPrograms();
    const start = this.page() * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  onPageChange(e: PaginatorState) {
    // rows может прийти undefined — берём текущее значение
    const rows = e.rows ?? this.pageSize();

    // page может не прийти — считаем из first/rows
    const page =
      e.page ??
      Math.floor(((e.first ?? (this.page() * rows)) as number) / rows);

    if (this.pageSize() !== rows) this.pageSize.set(rows);
    this.page.set(page);

    // плавный скролл к началу списка
    setTimeout(
      () => document.querySelector('.grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      0
    );
  }

  // подсказка «Показаны X–Y из N»
  firstItemIndex = () => this.page() * this.pageSize();
  lastItemIndex  = () => Math.min(this.firstItemIndex() + this.pageSize(), this.total());

  openProgram(id: number) { this.router.navigate(['/programs', id]); }
}
