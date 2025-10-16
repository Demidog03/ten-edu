import { Injectable, signal, computed } from '@angular/core';

export interface Center { id:number; name:string; city:string; programs:number; about?:string; }
export interface Program {
  id: number;
  title: string;
  price: number;
  centerId: number;
  center: string;
  lecturer: string;

  // ── новые поля ──────────────────────────────
  level: 'Начальный' | 'Средний' | 'Продвинутый';
  mode: 'Онлайн' | 'Офлайн' | 'Смешанный';
  durationHours: number;        // длительность, часов
  start: string;                // ISO дата старта
  seats: number;                // всего мест
  enrolled: number;             // занято мест
  rating: number;               // 3.5..5.0
  language: 'RU' | 'KZ' | 'RU/KZ';
  certificate: boolean;
  image?: string;               // обложка
  topics: string[];             // основные темы
}
export interface Lecturer { id:number; name:string; role:string; avatar?: string; }
export interface Center {
  id: number;
  name: string;
  city: string;
  programs: number;
  about?: string;
  image?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;   // ISO
  tag: string;
  url?: string;
  content?: string;
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

  private makePrograms(centers: Center[], lecturers: Lecturer[]): Program[] {
    const programs: Program[] = [];
    let id = 1;

    const levels: Program['level'][] = ['Начальный','Средний','Продвинутый'];
    const modes: Program['mode'][] = ['Онлайн','Офлайн','Смешанный'];

    centers.forEach(center => {
      const perCenter = Math.max(10, Math.min(16, center.programs));
      for (let i = 0; i < perCenter; i++) {
        const dir = this.pick(this.directions);
        const title = this.pick(dir.topics);
        const price = 60_000 + Math.floor(this.rng() * 240_000 / 10) * 10_000;

        const lecturer = this.pick(
          lecturers.filter(l => l.role === dir.role).slice(0, 6).concat(this.pick(lecturers) as any)
        ).name;

        const duration = 16 + Math.floor(this.rng()*40); // 16..55 ч
        const start = new Date(Date.now() + Math.floor(this.rng()*45)*86400000); // в течение 45 дней
        const seats = 12 + Math.floor(this.rng()*10);   // 12..21
        const enrolled = Math.min(seats-1, Math.floor(this.rng()*seats));
        const rating = Math.round((3.6 + this.rng()*1.4)*10)/10; // 3.6..5.0
        const image = `https://picsum.photos/seed/prog${id}/800/400`; // стабильная обложка

        programs.push({
          id: id++,
          title,
          price,
          centerId: center.id,
          center: center.name,
          lecturer,
          level: this.pick(levels),
          mode: this.pick(modes),
          durationHours: duration,
          start: start.toISOString(),
          seats,
          enrolled,
          rating,
          language: this.rng() > .2 ? 'RU' : (this.rng() > .5 ? 'KZ' : 'RU/KZ'),
          certificate: this.rng() > .25,
          image,
          topics: Array.from({length: 4}, () => this.pick(dir.topics))
        });
      }
    });

    // уникализация названий в пределах центра
    const byCenter = new Map<number, Set<string>>();
    programs.forEach(p => {
      const set = byCenter.get(p.centerId) ?? new Set<string>();
      if (!byCenter.has(p.centerId)) byCenter.set(p.centerId, set);
      if (set.has(p.title)) p.title = `${p.title} — модуль ${1 + Math.floor(this.rng()*4)}`;
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

  private avatarFor(name: string) {
    const initials = name
      .split(/\s+/)
      .map(p => p[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase();

    // детерминированный цвет из «rng»
    const hue = Math.floor(this.rng() * 360);
    const bg = `hsl(${hue} 60% 40%)`;
    const fg = '#ffffff';

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
        <rect width="100%" height="100%" rx="80" fill="${bg}"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
              font-family="Inter, system-ui, Arial" font-size="64" font-weight="700"
              fill="${fg}">${initials}</text>
      </svg>`;

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  private makeLecturers(centers: Center[]): Lecturer[] {
    const first = ['Искандер','Айдар','Нурлан','Данияр','Али','Марат','Сергей','Елена','Асел','Руслан','Ерлан','Ирина'];
    const last  = ['Смагулов','Омаров','Алиев','Сатпаев','Тлеулин','Ахметов','Поляков','Петрова','Касенова','Калымжанов','Жаксылыков','Назарова'];

    const lecturers: Lecturer[] = [];
    let id = 1;
    centers.forEach(() => {
      for (let i = 0; i < 3; i++) {
        const role = this.pick(this.directions).role;
        const name = `${this.pick(first)} ${this.pick(last)}`;
        lecturers.push({ id: id++, name, role, avatar: this.avatarFor(name) }); // ← аватар
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

  // ---- новости (моки) ----
  private makeNews(): NewsItem[] {
    const tags = ['Анонс', 'Интервью', 'Гид', 'Событие', 'Обновление'];
    const titles = [
      'Запуск новых программ по релейной защите',
      'Как выбрать курс по теплотехнике: 5 советов',
      'Интервью с экспертом по АСУ ТП',
      'Практика на ТЭЦ: кейс от Energy Academy',
      'Онлайн-формат: как проходят занятия',
      'Гранты для слушателей — что нужно знать',
      'Микрогриды и ВИЭ: интенсив для инженеров',
      'Обновление платформы: быстрый поиск и фильтры'
    ];
    return titles.map((t, i) => ({
      id: i + 1,
      title: t,
      excerpt: 'Коротко о главном: темы, формат, условия участия и ссылки на регистрацию.',
      image: `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=${i}`,
      date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
      tag: tags[i % tags.length],
      url: '#'
    }));
  }

  news = signal<NewsItem[]>(this.makeNews());

  private readonly _news: NewsItem[] = [
    {
      id: 1,
      title: 'Запуск новых программ по релейной защите',
      excerpt: 'Коротко о главном: темы, формат, условия участия и ссылки на регистрацию.',
      image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1600&auto=format&fit=crop',
      tag: 'Событие',
      date: '2025-10-16',
      content: `
      <p>Мы запускаем обновлённую линейку программ по релейной защите и автоматике (РЗА).
      Учебные модули переработаны на основе обратной связи выпускников и запросов
      предприятий генерации и сетевых компаний. В курсах стало больше практики,
      лабораторных стендов и ситуационных задач.</p>

      <h3>Зачем мы всё обновили</h3>
      <p>За последние два года в отрасли заметно вырос спрос на специалистов, которые
      одинаково уверенно чувствуют себя в «классике» и в цифровых решениях: МЭК 61850,
      цифровые подстанции, инженерные расчёты и тестирование защит на реальном оборудовании.
      Мы свели всё это в компактные треки, где теория сразу закрепляется практикой.</p>

      <h3>Что нового в программах</h3>
      <ul>
        <li><strong>Модули по цифровым подстанциям.</strong> Практика конфигурирования,
        анализ GOOSE/SV-сообщений, отладка логики.</li>
        <li><strong>Стенды и испытания.</strong> Режимы КЗ, опробование, проверка уставок, работа с тест-комплектами.</li>
        <li><strong>Разбор «боевых» кейсов.</strong> Инциденты, типовые ошибки, расследования и корректные сценарии действий.</li>
        <li><strong>Домашние задания с обратной связью.</strong> Каждый модуль завершается практической работой и мини-тестом.</li>
      </ul>

      <h3>Структура трека (пример)</h3>
      <ol>
        <li>Основы РЗА: принципы, терминология, типовые функции защит.</li>
        <li>Трансформаторы тока/напряжения, схемы соединений, методики проверки.</li>
        <li>Линейные и дифзащиты: уставки, алгоритмы, селективность.</li>
        <li>Цифровая подстанция и МЭК 61850: модели, коммуникации, GOOSE/SV.</li>
        <li>Наладка и испытания на стендах. Отчётность и оформление результатов.</li>
      </ol>

      <blockquote>«Сильная команда наставников и реальные задачи — вот что отличает
      обновлённые программы», — руководитель направления РЗА.</blockquote>

      <h3>Для кого подойдёт</h3>
      <p>Инженерам-электрикам, наладчикам, специалистам РЗА и релейщикам с опытом 0–5 лет,
      а также тем, кто переходит из эксплуатационных служб в наладку/проектирование.</p>

      <h3>Формат и сроки</h3>
      <ul>
        <li>Гибрид: онлайн-лекции + офлайн-практика на стендах (по желанию).</li>
        <li>Длительность базового трека — 6 недель, занятия 2–3 раза в неделю.</li>
        <li>Доступ к записям и материалам — навсегда.</li>
      </ul>

      <h3>Результат</h3>
      <p>Выпускники уверенно настраивают/проверяют защиты, составляют отчёты и
      понимают, как внедрять цифровые решения на подстанциях.</p>

      <h3>FAQ</h3>
      <p><strong>Нужен ли опыт?</strong> Базовые знания электроэнергетики полезны,
      но часть потоков рассчитана на начинающих.</p>
      <p><strong>Будет сертификат?</strong> Да, именной сертификат с перечислением компетенций.</p>

      <p><em>Старт ближайшего потока — <strong>16 ноября</strong>. Количество мест ограничено.</em></p>
    `
    },
    {
      id: 2,
      title: 'Как выбрать курс по теплотехнике: 5 советов',
      excerpt: 'Критерии выбора: результаты, формат, нагрузка и поддержка наставников.',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop',
      tag: 'Инсайт',
      date: '2025-10-13',
      content: `
      <p>Теплотехника — фундаментальное направление для ТЭЦ и промышленных объектов.
      Ошибка при выборе программы приводит к лишним тратам времени и денег.
      Ниже — пять практичных ориентиров, которые помогут быстро отобрать «свои» курсы.</p>

      <h3>1) Чёткие результаты и практика</h3>
      <p>В описании должны быть сформулированы <em>измеримые</em> результаты:
      «проведёт тепловой расчёт котла», «составит тепловой баланс», «рассчитает
      коэффициенты и подберёт оборудование». Чем больше практики (кейсы, расчёты,
      задания на данных предприятия), тем лучше.</p>

      <h3>2) Наставники и обратная связь</h3>
      <p>Сильный курс — это всегда эксперты-практики и проверка работ.
      Узнайте, как быстро отвечают в чате, кто рецензирует домашние задания
      и можно ли защитить мини-проект.</p>

      <h3>3) Нагрузка и расписание</h3>
      <p>Соотнесите график: оптимально 2–3 занятия в неделю по 1,5–2 часа.
      Обратите внимание на сложность домашних заданий и требуемый софт
      (например, Excel/Mathcad/CAE-пакеты).</p>

      <h3>4) Отзывы и портфолио выпускников</h3>
      <p>Смотрите реальные кейсы: расчёт теплообменников, оптимизация работы
      сетей, повышение КПД. Если есть портфолио выпускников — это плюс.</p>

      <h3>5) Итоговая аттестация</h3>
      <p>Лучший формат — защита финального мини-проекта: вы покажете навык,
      получите комментарии и готовый артефакт в резюме.</p>

      <h3>Бонус: на что ещё обратить внимание</h3>
      <ul>
        <li>Доступ к записям и материалам после выпуска.</li>
        <li>Наличие консультаций 1-на-1 по расчётам.</li>
        <li>Поддержка карьерного центра (поиск стажировок/вакансий).</li>
      </ul>

      <blockquote>«Правильно выбранная программа экономит месяцы самостоятельного
      поиска, а практический проект окупает обучение уже на работе».</blockquote>

      <p><em>Если нужен быстрый старт — ориентируйтесь на треки с практикумами
      и обязательной защитой проекта: так компетенции закрепляются надёжнее.</em></p>
    `
    },
    {
      id: 3,
      title: 'Интервью с экспертом по АСУ ТП',
      excerpt: 'Говорим о трендах и востребованных компетенциях.',
      image: 'https://images.unsplash.com/photo-1551836022-3b11d0b4e3a0?q=80&w=1600&auto=format&fit=crop',
      tag: 'Объявление',
      date: '2025-10-10',
      content: `
      <p>В свежем интервью мы поговорили с приглашённым экспертом по АСУ ТП
      о том, как меняются промышленные системы управления, какие навыки
      востребованы у инженеров сегодня и что изучать в первую очередь.</p>

      <h3>Главные тренды</h3>
      <ul>
        <li><strong>Интеграция OT/IT.</strong> Больше данных, аналитики и
        взаимодействия с корпоративными системами.</li>
        <li><strong>Кибербезопасность.</strong> Практики защиты на уровне
        сети, контроллеров и рабочих станций.</li>
        <li><strong>Унификация протоколов.</strong> Рост роли стандартов и
        совместимости в мультивендорных средах.</li>
      </ul>

      <h3>Какие компетенции ценятся</h3>
      <ol>
        <li>Понимание архитектур АСУ ТП (PLC/SCADA/DCS, уровни, роли).</li>
        <li>Опыт миграции и модернизации систем без остановки производства.</li>
        <li>Навыки безопасной сети: сегментация, журналы, мониторинг инцидентов.</li>
        <li>Практика сопровождения: документация, тест-планы, регламенты.</li>
      </ol>

      <blockquote>«Лучшие инженеры — те, кто умеют говорить на языке производства
      и бизнеса одновременно: считать, объяснять и проектировать изменения».</blockquote>

      <h3>Что слушать/смотреть</h3>
      <p>Мы собрали плейлист с разбором реальных кейсов, «подводных камней»
      и чек-листами для аудита существующих решений. Доступ — свободный.</p>

      <h3>Как присоединиться к обсуждению</h3>
      <p>Подписывайтесь на наш телеграм-канал, задавайте вопросы и делитесь
      своей практикой — лучшие истории мы пригласим в следующий выпуск.</p>

      <p><em>Полная версия интервью доступна в блоге и в видеоплеере на странице выпуска.</em></p>
    `
    }
  ];


  getNewsById(id: number): NewsItem | undefined {
    return this._news.find(n => n.id === id);
  }
}
