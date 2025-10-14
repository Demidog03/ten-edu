import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../../shared/data.service';

@Component({
  standalone: true,
  selector: 'center-detail-page',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
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
}
