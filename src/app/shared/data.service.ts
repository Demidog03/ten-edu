import { Injectable, signal, computed } from '@angular/core';

export interface Center { id:number; name:string; city:string; programs:number; about?:string; }
export interface Program { id:number; title:string; price:number; centerId:number; center:string; lecturer:string; }
export interface Lecturer { id:number; name:string; role:string; }
export interface Center {
  id: number;
  name: string;
  city: string;
  programs: number;
  about?: string;
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  // поисковый запрос и выбранный город
  query = signal('');
  city = signal<string | null>(null);

  /** ----------------------- Генерация детерминированных моков ----------------------- */
  private readonly cities = [
    'Астана','Алматы','Шымкент','Караганда','Актобе','Атырау',
    'Павлодар','Усть-Каменогорск','Кокшетау','Костанай','Семей','Тараз'
  ];

  private readonly directions = [
    { role:'Теплотехника',                 topics:['Теплотехника базовый','Котельные установки','Тепловые сети','ТЭЦ: эксплуатация'] },
    { role:'Электроэнергетика',            topics:['Подстанции 110/220кВ','Релейная защита и автоматика','Схемы и первичка','Наладка вторичных цепей'] },
    { role:'Охрана труда',                 topics:['Охрана труда на ТЭЦ','Промышленная безопасность','Пожарная безопасность','Работы на высоте'] },
    { role:'Автоматизация и АСУ ТП',       topics:['SCADA/PLC','АСУ ТП ТЭЦ','ПИД-регулирование','Метрология и КИПиА'] },
    { role:'Возобновляемая энергетика',    topics:['Солнечные станции','Ветроэнергетика','Гибридные решения','Микрогриды'] },
    { role:'Проектный менеджмент в энергетике', topics:['PMI/Agile для энергетиков','Сметы и планирование','Управление рисками','Договорная работа'] }
  ];

  private rng = this.makeRng(202501); // фиксированный seed => стабильные данные

  private makeRng(seed: number) {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  private pick<T>(arr: T[]) { return arr[Math.floor(this.rng() * arr.length)]; }

  private slug(s: string) {
    // делаем безопасный seed: убираем кириллицу/символы
    return s.normalize('NFKD').replace(/[^\w]+/g, '-').toLowerCase();
  }

  private imageFor(dir: string, city: string, i: number) {
    const seed = this.slug(`${dir}-${city}-${i}`);
    // стабильная картинка 600x400
    return `https://picsum.photos/seed/${seed}/600/400`;
  }

  private makeCenters(count = 24): Center[] {
    const prefixes = ['Energy','Power','Heat','Tech','Grid','Volt','Steam','Smart','Prime','Core','Quantum','Best'];
    const suffixes = ['Academy','Learn','School','Institute','Center','Lab','Workshop','Campus','College','Pro'];
    const aboutSnippets = [
      'Практические курсы с кейсами из отрасли.',
      'Сильные преподаватели-практики и наставники.',
      'Подготовка к сертификации и стажировки.',
      'Модульные программы и микро-курсы.',
      'Лабораторные стенды и симуляторы.'
    ];

    const centers: Center[] = [];
    for (let i = 1; i <= count; i++) {
      const name = `${this.pick(prefixes)} ${this.pick(suffixes)}`;
      const city = this.pick(this.cities);
      const programs = 8 + Math.floor(this.rng() * 8); // 8..15
      const dir = this.pick(this.directions).role;     // тематика центра
      const about = `${dir}. ${this.pick(aboutSnippets)}`;

      centers.push({
        id: i,
        name,
        city,
        programs,
        about,
        image: this.imageFor(dir, city, i) // ← добавили
      });
    }

    // уникализация имён на случай совпадений
    const used = new Set<string>();
    centers.forEach(c => {
      let base = c.name, k = 2;
      while (used.has(c.name)) c.name = `${base} ${k++}`;
      used.add(c.name);
    });

    return centers;
  }

  private makeLecturers(centers: Center[]): Lecturer[] {
    const first = ['Искандер','Айдар','Нурлан','Данияр','Али','Марат','Сергей','Елена','Асел','Руслан','Ерлан','Ирина'];
    const last  = ['Смагулов','Омаров','Алиев','Сатпаев','Тлеулин','Ахметов','Поляков','Петрова','Касенова','Калымжанов','Жаксылыков','Назарова'];

    const lecturers: Lecturer[] = [];
    let id = 1;
    centers.forEach(() => {
      // по 3 лектора «на центр», но центры здесь только источник ролей/
      // тематик — сами лекторы «общие» для платформы.
      for (let i = 0; i < 3; i++) {
        const role = this.pick(this.directions).role;
        const name = `${this.pick(first)} ${this.pick(last)}`;
        lecturers.push({ id: id++, name, role });
      }
    });
    // уникализация имён
    const seen = new Set<string>();
    lecturers.forEach(l => {
      let base = l.name, k = 2;
      while (seen.has(l.name)) l.name = `${base} ${k++}`;
      seen.add(l.name);
    });
    return lecturers;
  }

  private makePrograms(centers: Center[], lecturers: Lecturer[]): Program[] {
    const programs: Program[] = [];
    let id = 1;

    centers.forEach(center => {
      const perCenter = Math.max(10, Math.min(16, center.programs)); // ~10-16 на центр
      for (let i = 0; i < perCenter; i++) {
        const dir = this.pick(this.directions);
        const title = this.pick(dir.topics);
        const price = 60_000 + Math.floor(this.rng() * 240_000 / 10) * 10_000; // 60k..300k кратно 10k
        const lecturer = this.pick(
          lecturers.filter(l => l.role === dir.role) // стараемся подбирать профильного
            .slice(0, 6) // чуть ограничим выбор
            .concat(this.pick(lecturers) as any) // и на всякий случай добавим fallback
        ).name;

        programs.push({
          id: id++,
          title,
          price,
          centerId: center.id,
          center: center.name,
          lecturer
        });
      }
    });

    // небольшая уникализация в пределах центра (если темы совпали)
    const byCenter = new Map<number, Set<string>>();
    programs.forEach(p => {
      const set = byCenter.get(p.centerId) ?? new Set<string>();
      if (!byCenter.has(p.centerId)) byCenter.set(p.centerId, set);
      if (set.has(p.title)) {
        p.title = `${p.title} — модуль ${1 + Math.floor(this.rng()*4)}`;
      }
      set.add(p.title);
    });

    return programs;
  }

  /** ----------------------- Сгенерированные массивы ----------------------- */
  private readonly _centers = this.makeCenters(24);
  private readonly _lecturers = this.makeLecturers(this._centers);
  private readonly _programs = this.makePrograms(this._centers, this._lecturers);

  /** ----------------------- Публичные сигналы ----------------------- */
  centers = signal<Center[]>(this._centers);
  programs = signal<Program[]>(this._programs);
  lecturers = signal<Lecturer[]>(this._lecturers);

  /** ----------------------- Витрины с фильтрами ----------------------- */
  filteredCenters = computed(() => {
    const q = this.query().toLowerCase();
    const city = this.city();
    return this.centers().filter(c =>
      (!city || c.city === city) &&
      (!q || c.name.toLowerCase().includes(q) || (c.about ?? '').toLowerCase().includes(q))
    );
  });

  filteredPrograms = computed(() => {
    const q = this.query().toLowerCase();
    const city = this.city();
    return this.programs().filter(p => {
      const centerCity = this.centers().find(c => c.id === p.centerId)?.city;
      return (!q || p.title.toLowerCase().includes(q) || p.center.toLowerCase().includes(q) || p.lecturer.toLowerCase().includes(q)) &&
        (!city || centerCity === city);
    });
  });
}
