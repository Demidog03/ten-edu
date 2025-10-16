import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../../shared/data.service';
import {Tag} from 'primeng/tag'

@Component({
  standalone: true,
  selector: 'center-detail-page',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, Tag],
  templateUrl: './center-detail.page.html',
  styleUrls: ['./center-detail.page.scss'],
})
export class CenterDetailPage {
  id!: number;
  center = computed(() => this.data.centers().find(c => c.id === this.id));
  programs = computed(() => this.data.programs().filter(p => p.centerId === this.id));

  constructor(private route: ActivatedRoute, public data: DataService, private router: Router) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
  }

  back(){ this.router.navigateByUrl('/centers'); }

  // picsum helper: подставляет seed (id/строка) и делает HD/ретину
  picSum(seedOrId: string | number, w: number, h: number, dpr = 1): string {
    const seed = String(seedOrId).replace(/^https?:.*\/seed\/([^/]+)\/.*$/, '$1'); // если пришёл полный url — вытащим seed
    const ww = Math.round(w * dpr);
    const hh = Math.round(h * dpr);
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${ww}/${hh}?dpr=${dpr}`;
  }

// переход в детали программы
  openProgram(id: number) {
    this.router.navigate(['/programs', id]);
  }

}
