import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { SportskiObjekat } from '../models/SportskiObjekat';
import { Msg } from '../models/Msg';

@Injectable({
  providedIn: 'root',
})
export class SportskiObjekatService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/sportskiObjekat';

  dohvSve() {
    return this.http.get<SportskiObjekat[] | Msg>(`${this.uri}/dohvSve`);
  }

  dohvSveAktivne(slobodnoDanas: boolean) {
    const data = {
      slobodnoDanas,
    };
    return this.http.post<SportskiObjekatSaRecenzijama[] | Msg>(`${this.uri}/dohvSveAktivne`, data);
  }

  kreirajNovi(zaposleniId: string, o: SportskiObjekat) {
    const data = {
      ...o,
      zaposleniId,
    };
    return this.http.post<SportskiObjekat | Msg>(`${this.uri}/kreirajNovi`, data);
  }

  azurirajPostojeci(o: SportskiObjekat) {
    return this.http.post<SportskiObjekat | Msg>(`${this.uri}/azuriraj`, o);
  }

  uploadGalerija(objekat_id: string, slike: File[]) {
    const data = new FormData();
    for (let i = 0; i < slike.length; i++) {
      data.append('galerija', slike[i]);
    }
    data.append('objekat_id', objekat_id);
    return this.http.post<Msg>(`${this.uri}/uploadGalerija`, data);
  }

  odobriObjekat(korisnikId: string) {
    const data = {
      _id: korisnikId,
    };
    return this.http.post<Msg>(`${this.uri}/odobriObjekat`, data);
  }

  odbijObjekat(korisnikId: string) {
    const data = {
      _id: korisnikId,
    };
    return this.http.post<Msg>(`${this.uri}/odbijObjekat`, data);
  }
}
