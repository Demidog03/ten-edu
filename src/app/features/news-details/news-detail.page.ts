import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../shared/data.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'news-detail-page',
  imports: [CommonModule, ButtonModule, TagModule, CardModule],
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage {
  id = signal<number | null>(null);

  item = computed(() => {
    const id = this.id();
    return id == null ? undefined : this.data.getNewsById(id);
  });

  // Готовый HTML с фолбэком
  html: () => SafeHtml | null = computed(() => {
    const n = this.item();
    if (!n) return null;
    const raw =
      (n.content && n.content.trim()) ||
      `<p>${n.excerpt || 'Подробности появятся позже.'}</p>`;
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public data: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(Number.isFinite(id) ? id : null);
  }

  back() {
    if (history.length > 1) history.back();
    else this.router.navigateByUrl('/');
  }

  protected readonly navigator = navigator
  protected readonly location = location
}
