import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RezervacijaZaSportistu } from '../models/RezervacijaZaSportistu';
import { Msg } from '../models/Msg';
import { Rezervacija } from '../models/Rezervacija';
import { ZaposleniInfo } from '../models/ZaposleniInfo';
import { RezervacijaObjekatElementSportista } from '../models/RezervacijaObjekatElementSportista';

@Injectable({
  providedIn: 'root',
})
export class RezervacijaService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/rezervacija';

  dohvSveZaSportistu(id: string) {
    const data = {
      _id: id,
    };
    return this.http.post<RezervacijaZaSportistu[] | Msg>(`${this.uri}/dohvSveZaSportistu`, data);
  }

  dohvSveZaZaposlenog(zaposleni_info: ZaposleniInfo) {
    const data = {
      zaposleni_info,
    };
    return this.http.post<RezervacijaObjekatElementSportista[] | Msg>(
      `${this.uri}/dohvSveZaZaposlenog`,
      data,
    );
  }

  otkazi(id: string, sportistaId: string) {
    const data = {
      _id: id,
      sportista_id: sportistaId,
    };

    return this.http.post<Msg>(`${this.uri}/otkazi`, data);
  }

  pomeriRezervaciju(_id: string, datum: string, termin_od: number, termin_do: number) {
    const data = {
      _id,
      datum,
      termin_od,
      termin_do,
    };

    return this.http.post<Msg>(`${this.uri}/pomeriRezervaciju`, data);
  }

  potvrdi(id: string) {
    const data = {
      _id: id,
    };

    return this.http.post<Msg>(`${this.uri}/potvrdi`, data);
  }

  odjavi(id: string) {
    const data = {
      _id: id,
    };

    return this.http.post<Msg>(`${this.uri}/odjavi`, data);
  }

  odobri(id: string) {
    const data = {
      _id: id,
    };

    return this.http.post<Msg>(`${this.uri}/odobri`, data);
  }

  dohvSveZaElement(id: string) {
    const data = {
      idElementa: id,
    };

    return this.http.post<Rezervacija[]>(`${this.uri}/dohvSveZaElement`, data);
  }

  nova(r: Rezervacija) {
    return this.http.post<Msg>(`${this.uri}/nova`, r);
  }

  generisiIzvestajPopunjenost(objekat_id: string, mesec: string) {
    const body = {
      objekat_id,
      mesec,
    };

    return this.http.post(`${this.uri}/generisiIzvestajPopunjenost`, body, {
      responseType: 'blob',
    });
  }
}
