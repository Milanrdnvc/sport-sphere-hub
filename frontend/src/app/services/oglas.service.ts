import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Oglas } from '../models/Oglas';
import { Msg } from '../models/Msg';
import { OglasSaSportistima } from '../models/OglasSaSportistima';

@Injectable({
  providedIn: 'root',
})
export class OglasService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/oglas';

  dohvSve() {
    return this.http.get<Oglas[] | Msg>(`${this.uri}/dohvSve`);
  }

  dohvSveSaKorisnicima() {
    return this.http.get<OglasSaSportistima[] | Msg>(`${this.uri}/dohvSveSaKorisnicima`);
  }

  kreiraj(o: Oglas) {
    return this.http.post<Msg>(`${this.uri}/kreiraj`, o);
  }

  pridruzi(oglas_id: string, sportista_id: string) {
    const data = {
      oglas_id,
      sportista_id,
    };

    return this.http.post<Msg>(`${this.uri}/pridruzi`, data);
  }

  odobri(oglas_id: string, sportista_id: string, vlasnik_id: string) {
    const data = {
      oglas_id,
      sportista_id,
      vlasnik_id,
    };

    return this.http.post<Msg>(`${this.uri}/odobri`, data);
  }

  odbij(oglas_id: string, sportista_id: string, vlasnik_id: string) {
    const data = {
      oglas_id,
      sportista_id,
      vlasnik_id,
    };

    return this.http.post<Msg>(`${this.uri}/odbij`, data);
  }

  zatvori(oglas_id: string, sportista_id: string) {
    const data = {
      oglas_id,
      sportista_id,
    };

    return this.http.post<Msg>(`${this.uri}/zatvori`, data);
  }
}
