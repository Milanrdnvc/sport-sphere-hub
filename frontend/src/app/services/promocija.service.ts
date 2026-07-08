import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ZaposleniInfo } from '../models/ZaposleniInfo';
import { Promocija } from '../models/Promocija';
import { Msg } from '../models/Msg';
import { PromocijaSaObjektom } from '../models/PromocijaSaObjektom';

@Injectable({
  providedIn: 'root',
})
export class PromocijaService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/promocija';

  dohvSveZaZaposlenog(zaposleni_info: ZaposleniInfo) {
    const data = {
      zaposleni_info,
    };
    return this.http.post<Promocija[] | Msg>(`${this.uri}/dohvSveZaZaposlenog`, data);
  }

  kreirajNovu(p: Promocija) {
    return this.http.post<Msg>(`${this.uri}/kreirajNovu`, p);
  }

  azurirajPostojecu(p: Promocija) {
    return this.http.post<Msg>(`${this.uri}/azurirajPostojecu`, p);
  }

  dohvDo3Aktuelne() {
    return this.http.get<PromocijaSaObjektom[] | Msg>(`${this.uri}/dohvDo3Aktuelne`);
  }
}
