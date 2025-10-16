import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DataService, Lecturer } from '../../shared/data.service';
import { Router } from '@angular/router';
import { Tag } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'lecturers-page',
  imports: [CommonModule, AvatarModule, CardModule, PaginatorModule, Tag],
  templateUrl: './lecturers.page.html',
  styleUrls: ['./lecturers.page.scss'],
})
export class LecturersPage {
  constructor(public data: DataService, private router: Router) {}

  // --- пагинация
  page = signal(0);
  pageSize = signal(12);
  total = computed(() => this.data.lecturers().length);

  pageLecturers = computed(() => {
    const start = this.page() * this.pageSize();
    return this.data.lecturers().slice(start, start + this.pageSize());
  });

  onPageChange(e: PaginatorState) {
    const rows = e.rows ?? this.pageSize();
    const page =
      e.page ??
      Math.floor(((e.first ?? (this.page() * rows)) as number) / rows);

    if (this.pageSize() !== rows) this.pageSize.set(rows);
    this.page.set(page);

    // скролл к началу списка
    setTimeout(() =>
      document.querySelector('.lect-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  }

  // --- существующая логика
  avatar(l: Lecturer): string {
    return `https://i.pravatar.cc/200?u=${encodeURIComponent(l.name + '|' + l.id)}`;
  }

  programCount(l: Lecturer): number {
    return this.data.programs().filter(p => p.lecturer === l.name).length;
  }

  openLecturer(id: number) {
    this.router.navigate(['/lecturers', id]);
  }

  protected readonly Math = Math
}
