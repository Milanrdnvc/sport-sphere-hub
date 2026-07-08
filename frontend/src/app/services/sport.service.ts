import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Sport } from '../models/Sport';
import { Msg } from '../models/Msg';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/sport';

  dohvSve() {
    return this.http.get<Sport[] | Msg>(`${this.uri}/dohvSve`);
  }

  kreiraj(s: Sport) {
    return this.http.post<Msg>(`${this.uri}/kreiraj`, s);
  }

  obrisi(sportId: string) {
    const data = {
      _id: sportId,
    };
    return this.http.post<Msg>(`${this.uri}/obrisi`, data);
  }
}
