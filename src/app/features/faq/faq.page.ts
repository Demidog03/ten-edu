import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import { Select } from 'primeng/select';

interface FaqItem { q: string; a: string; }
interface FaqCategory { id: string; name: string; items: FaqItem[] }

@Component({
  standalone: true,
  selector: 'app-faq',
  imports: [CommonModule, FormsModule, Accordion, AccordionPanel, AccordionHeader, AccordionContent, CardModule, InputTextModule, DividerModule, InputGroup, InputGroupAddon, Select],
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss']
})
export class FaqPage {
  // Search query and selected category (signals for reactive updates without change detection hassle)
  query = signal<string>('');
  categories = signal<FaqCategory[]>([
    {
      id: 'general',
      name: 'Общее',
      items: [
        { q: 'Как зарегистрироваться на платформе?', a: 'Нажмите «Войти» в верхнем меню и выберите «Регистрация». Заполните форму, подтвердите email и войдите в личный кабинет.' },
        { q: 'Сколько стоит обучение?', a: 'Стоимость зависит от программы. На странице «Программы» у каждой карточки указана актуальная цена и варианты оплаты.' },
        { q: 'Какие форматы обучения доступны?', a: 'Онлайн и офлайн в центрах. Некоторые программы предлагают смешанный формат.' }
      ]
    },
    {
      id: 'programs',
      name: 'Программы',
      items: [
        { q: 'Как записаться на программу?', a: 'Перейдите в раздел «Программы», выберите интересующую программу и нажмите «Записаться». Если требуется, авторизуйтесь.' },
        { q: 'Есть ли вступительные требования?', a: 'Для отдельных программ могут быть требования. Они указаны на странице конкретной программы.' },
        { q: 'Где найти материалы после занятия?', a: 'Материалы и записи доступны в личном кабинете в разделе «Мои программы».' }
      ]
    },
    {
      id: 'centers',
      name: 'Центры',
      items: [
        { q: 'Как выбрать центр обучения?', a: 'В разделе «Центры» вы можете сравнить расположение, оснащение и рейтинги центров.' },
        { q: 'Можно ли перевестись в другой центр?', a: 'Да, при наличии мест. Обратитесь в поддержку или к администратору текущего центра.' }
      ]
    },
    {
      id: 'payments',
      name: 'Оплата и возвраты',
      items: [
        { q: 'Можно ли вернуть оплату?', a: 'Условия возврата указаны в договоре‑оферте. В общих случаях возврат возможен до начала обучения. Свяжитесь с поддержкой.' },
        { q: 'Какие способы оплаты доступны?', a: 'Банковские карты, безналичный расчет для юрлиц, рассрочка у партнеров (если доступна для программы).' }
      ]
    },
    {
      id: 'account',
      name: 'Аккаунт и поддержка',
      items: [
        { q: 'Как восстановить пароль?', a: 'На экране входа нажмите «Забыли пароль?» и следуйте инструкциям на email.' },
        { q: 'Поддержка и контакты', a: 'Напишите нам через WhatsApp на главной странице или используйте форму обратной связи в разделе «Центры».' }
      ]
    }
  ]);

  // Selected category (id) or 'all'
  selectedCategory = signal<string>('all');

  // Derived filtered categories/items
  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const selected = this.selectedCategory();
    const cats = this.categories();

    const matches = (text: string) => text.toLowerCase().includes(q);

    const filteredCats: FaqCategory[] = cats
      .filter(c => selected === 'all' || c.id === selected)
      .map(c => ({
        ...c,
        items: c.items.filter(item => q === '' || matches(item.q) || matches(item.a))
      }))
      .filter(c => c.items.length > 0 || q === '' );

    return filteredCats;
  });

  // Options for dropdown
  readonly categoryOptions = computed(() => [
    { label: 'Все категории', value: 'all' },
    ...this.categories().map(c => ({ label: c.name, value: c.id }))
  ]);
}
