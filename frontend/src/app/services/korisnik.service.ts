import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Msg } from '../models/Msg';
import { Korisnik } from '../models/Korisnik';
import { Admin } from '../models/Admin';
import { SportistaInfo } from '../models/SportistaInfo';
import { ZaposleniInfo } from '../models/ZaposleniInfo';

@Injectable({
  providedIn: 'root',
})
export class KorisnikService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/korisnik';

  register(k: Korisnik, mb: string, pib: string, nazivObjekta: string, adresaSedista: string) {
    const data = {
      mb,
      pib,
      nazivObjekta,
      adresaSedista,
      ...k,
    };

    return this.http.post<Msg>(`${this.uri}/register`, data);
  }

  uploadPfp(kor_ime: string, pfp: File | null) {
    const data = new FormData();
    pfp && data.append('pfp', pfp);
    data.append('kor_ime', kor_ime);
    return this.http.post<Msg>(`${this.uri}/uploadImg`, data);
  }

  login(kor_ime: string, lozinka: string) {
    const data = {
      kor_ime,
      lozinka,
    };

    return this.http.post<Korisnik | Msg>(`${this.uri}/login`, data);
  }

  adminLogin(kor_ime: string, lozinka: string) {
    const data = {
      kor_ime,
      lozinka,
    };

    return this.http.post<Admin | Msg>(`${this.uri}/adminLogin`, data);
  }

  azurirajProfil(k: Korisnik) {
    return this.http.post<Korisnik | Msg>(`${this.uri}/azurirajProfil`, k);
  }

  dohvSve() {
    return this.http.get<Korisnik[] | Msg>(`${this.uri}/dohvSve`);
  }

  resetujPfp(korisnikId: string) {
    const data = {
      _id: korisnikId,
    };
    return this.http.post<Msg>(`${this.uri}/resetujPfp`, data);
  }

  obrisiNalog(korisnikId: string) {
    const data = {
      _id: korisnikId,
    };
    return this.http.post<Msg>(`${this.uri}/obrisiNalog`, data);
  }

  odobriNalog(korisnikId: string) {
    const data = {
      _id: korisnikId,
    };
    return this.http.post<Msg>(`${this.uri}/odobriNalog`, data);
  }

  odbijNalog(korisnikId: string) {
    const data = {
      _id: korisnikId,
    };
    return this.http.post<Msg>(`${this.uri}/odbijNalog`, data);
  }

  zaboravljenaLozinka(kor_ime_ili_email: string) {
    const data = {
      kor_ime_ili_email,
    };

    return this.http.post<{ link: string } | Msg>(`${this.uri}/zaboravljenaLozinka`, data);
  }

  resetujLozinku(nova_lozinka: string, token: string) {
    const data = {
      nova_lozinka,
      token,
    };

    return this.http.post<Msg>(`${this.uri}/resetujLozinku`, data);
  }
}
