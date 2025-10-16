import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { DataService } from '../../shared/data.service';

@Component({
  standalone: true,
  selector: 'program-detail-page',
  imports: [CommonModule, RouterModule, CardModule, TagModule, ChipModule, ButtonModule, DividerModule, AccordionModule, AvatarModule],
  templateUrl: './program-detail.page.html',
  styleUrls: ['./program-detail.page.scss']
})
export class ProgramDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  data = inject(DataService);

  pid = Number(this.route.snapshot.paramMap.get('id') || 0);

  prog = computed(() => this.data.programs().find(p => p.id === this.pid));

  center = computed(() => this.data.centers().find(c => c.id === this.prog()?.centerId));
  lecturerName = computed(() => this.prog()?.lecturer || '');
  lecturerAvatar = computed(() => {
    const name = this.lecturerName();
    const ini = name.split(/\s+/).map(s=>s[0]??'').join('').slice(0,2).toUpperCase();
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
        <rect width="100%" height="100%" rx="60" fill="hsl(190 60% 45%)"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
          font-family="Inter, Arial" font-size="48" font-weight="700" fill="#fff">${ini}</text>
      </svg>`
    );
  });

  backToPrograms() { this.router.navigateByUrl('/programs'); }

  hd(src?: string): string {
    if (!src) return '';
    // извлекаем id из source.unsplash.com/600x400/?photo=xxxx
    const match = src.match(/unsplash\.com\/photo-(\w+)/);
    if (match) {
      const id = match[1];
      return `https://images.unsplash.com/photo-${id}?w=1920&h=800&fit=crop&q=90&auto=format`;
    }

    // если это просто поиск по теме
    if (src.includes('source.unsplash.com')) {
      return src.replace(/\/\d+x\d+\//, '/1920x800/');
    }

    return src;
  }
  picSum(seedOrUrl: string, w: number, h: number, dpr = 1): string {
    // если прилетел полный url, вытащим seed
    let seed = seedOrUrl;
    const m = seedOrUrl.match(/\/seed\/([^/]+)/);
    if (m) seed = m[1];

    // нормальная ширина для десктопа — 1920+, а для ретины dpr=2
    const ww = Math.round(w * dpr);
    const hh = Math.round(h * dpr);
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${ww}/${hh}?dpr=${dpr}`;
  }
}
