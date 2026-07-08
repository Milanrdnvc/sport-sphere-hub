import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Msg } from '../models/Msg';
import { TrenerSaObjektom } from '../models/TrenerSaObjektom';
import { Trener } from '../models/Trener';

@Injectable({
  providedIn: 'root',
})
export class TrenerService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/trener';

  dohvSve() {
    return this.http.get<TrenerSaObjektom[] | Msg>(`${this.uri}/dohvSve`);
  }

  deaktiviraj(trenerId: string) {
    const data = {
      _id: trenerId,
    };

    return this.http.post<Msg>(`${this.uri}/deaktiviraj`, data);
  }

  kreiraj(t: Trener) {
    return this.http.post<Msg>(`${this.uri}/kreiraj`, t);
  }
}
