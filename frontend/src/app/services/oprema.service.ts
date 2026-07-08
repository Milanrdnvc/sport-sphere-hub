import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Msg } from '../models/Msg';
import { Oprema } from '../models/Oprema';

@Injectable({
  providedIn: 'root',
})
export class OpremaService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/oprema';

  dohvSve() {
    return this.http.get<Oprema[] | Msg>(`${this.uri}/dohvSve`);
  }

  uploadSlikaOpreme(_id: string, pfp: File | null) {
    const data = new FormData();
    pfp && data.append('slikaOpreme', pfp);
    data.append('_id', _id);
    return this.http.post<Msg>(`${this.uri}/uploadSlikaOpreme`, data);
  }

  kreirajNovu(o: Oprema) {
    return this.http.post<Oprema | Msg>(`${this.uri}/kreirajNovu`, o);
  }

  azurirajPostojecu(o: Oprema) {
    return this.http.post<Msg>(`${this.uri}/azurirajPostojecu`, o);
  }
}
