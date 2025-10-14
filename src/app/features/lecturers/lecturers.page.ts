import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DataService } from '../../shared/data.service';

@Component({
  standalone: true,
  selector: 'lecturers-page',
  imports: [CommonModule, AvatarModule, CardModule],
  templateUrl: './lecturers.page.html',
  styleUrls: ['./lecturers.page.scss'],
})
export class LecturersPage {
  constructor(public data: DataService) {}
}
