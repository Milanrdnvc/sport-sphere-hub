import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Statistika } from '../models/Statistika';
import { Msg } from '../models/Msg';

@Injectable({
  providedIn: 'root',
})
export class StatistikaService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/statistika';

  dohvStatistiku() {
    return this.http.get<Statistika | Msg>(`${this.uri}/dohvStatistiku`);
  }
}
