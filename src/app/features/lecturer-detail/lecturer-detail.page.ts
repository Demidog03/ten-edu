import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';

type Prog = { id:number; title:string; center:string; price:number; date:string; duration:string };

@Component({
  standalone: true,
  selector: 'lecturer-detail-page',
  imports: [CommonModule, RouterModule, CardModule, TagModule, ChipModule, ButtonModule, DividerModule, AvatarModule],
  templateUrl: './lecturer-detail.page.html',
  styleUrls: ['./lecturer-detail.page.scss']
})
export class LecturerDetailPage {
  // статичный лектор (для примера)
  lecturer = {
    id: 21,
    name: 'Искандер Смагулов',
    role: 'Теплотехника',
    city: 'Алматы',
    rating: 4.9,
    students: 820,
    avatar: this.makeAvatar('Искандер Смагулов'),
    bio: `Инженер-теплотехник с 12+ годами практики на ТЭЦ. Автор курсов по котельным
установкам, тепловым сетям и промышленной безопасности. Помогает центрам строить
модульные программы и внедрять симуляторы.`,
    skills: [
      'Теплотехника', 'Котельные установки', 'Тепловые сети',
      'АСУ ТП', 'Охрана труда', 'Промбезопасность'
    ],
    contacts: {
      email: 'iskander@tenedu.kz',
      telegram: '@iskander_heat',
      phone: '+7 700 000 00 00'
    }
  };

  // несколько «курсов» для карточек
  programs: Prog[] = [
    { id: 101, title: 'Теплотехника: базовый интенсив', center: 'Energy School', price: 120_000, date: '15 марта', duration: '3 дня' },
    { id: 102, title: 'Котельные установки и эксплуатация', center: 'Heat Pro', price: 180_000, date: '28 марта', duration: '5 дней' },
    { id: 103, title: 'Тепловые сети: расчёт и диагностика', center: 'Prime Institute', price: 160_000, date: '10 апреля', duration: '4 дня' }
  ];

  constructor(private router: Router) {}

  goProgram(id: number) {
    // если позже появится настоящая страница программ — просто заменишь маршрут
    this.router.navigateByUrl(`/programs`);
  }
  goCenters()  { this.router.navigateByUrl('/centers'); }
  goPrograms() { this.router.navigateByUrl('/programs'); }

  private makeAvatar(name: string) {
    const initials = name.split(/\s+/).map(s => s[0] ?? '').join('').slice(0,2).toUpperCase();
    // детерминированный цвет
    let hash = 0; for (const ch of name) hash = ((hash<<5)-hash)+ch.charCodeAt(0);
    const hue = Math.abs(hash) % 360;
    const bg = `hsl(${hue} 60% 42%)`;
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
        <rect width="100%" height="100%" rx="80" fill="${bg}"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
              font-family="Inter, system-ui, Arial" font-size="64" font-weight="700"
              fill="#fff">${initials}</text>
      </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
}
