import { Injectable } from '@angular/core';

export interface HttpMetric {
  url: string;
  status: number;
  ms: number;
  ts?: number;
}

@Injectable({ providedIn: 'root' })
export class Metrics {
  private ring: HttpMetric[] = [];
  private limit = 300;

  log(event: HttpMetric) {
    const item = { ...event, ts: Date.now() };
    this.ring.push(item);
    if (this.ring.length > this.limit) this.ring.shift();
    // для dev можно подсматривать:
    if (typeof ngDevMode !== 'undefined' && ngDevMode) console.table([item]);
  }

  recent() { return [...this.ring]; }
}
