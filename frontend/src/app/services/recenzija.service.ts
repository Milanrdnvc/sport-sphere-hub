import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Msg } from '../models/Msg';
import { Recenzija } from '../models/Recenzija';

@Injectable({
  providedIn: 'root',
})
export class RecenzijaService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/recenzija';

  dohvSveZaObjekat(objekat_id: string) {
    const data = {
      objekat_id,
    };

    return this.http.post<Recenzija[] | Msg>(`${this.uri}/dohvZaObjekat`, data);
  }

  ostaviRecenziju(sportista_id: string, objekat_id: string, reakcija: string, komentar: string) {
    const data = {
      sportista_id,
      objekat_id,
      reakcija,
      komentar,
    };

    return this.http.post<Msg>(`${this.uri}/ostaviRecenziju`, data);
  }
}
