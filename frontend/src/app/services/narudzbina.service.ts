import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Narudzbina } from '../models/Narudzbina';
import { Msg } from '../models/Msg';

@Injectable({
  providedIn: 'root',
})
export class NarudzbinaService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/narudzbina';

  dohvSve() {
    return this.http.get<Narudzbina[] | Msg>(`${this.uri}/dohvSve`);
  }

  otkazi(narudzbina_id: string) {
    const data = {
      narudzbina_id,
    };

    return this.http.post<Msg>(`${this.uri}/otkazi`, data);
  }

  prihvati(n: Narudzbina) {
    return this.http.post<Msg>(`${this.uri}/prihvati`, n);
  }

  preuzeto(n: Narudzbina) {
    return this.http.post<Msg>(`${this.uri}/preuzeto`, n);
  }

  naruci(n: Narudzbina) {
    return this.http.post<Msg>(`${this.uri}/naruci`, n);
  }

  generisiIzvestajPrometOpreme(objekat_id: string, mesec: string) {
    const body = {
      objekat_id,
      mesec,
    };

    return this.http.post(`${this.uri}/generisiIzvestajPrometOpreme`, body, {
      responseType: 'blob',
    });
  }
}
