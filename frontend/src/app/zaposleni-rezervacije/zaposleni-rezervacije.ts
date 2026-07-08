import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { RezervacijaService } from '../services/rezervacija.service';
import { Rezervacija } from '../models/Rezervacija';
import { RezervacijaObjekatElementSportista } from '../models/RezervacijaObjekatElementSportista';

@Component({
  selector: 'app-zaposleni-rezervacije',
  imports: [],
  templateUrl: './zaposleni-rezervacije.html',
  styleUrl: './zaposleni-rezervacije.css',
})
export class ZaposleniRezervacije implements OnInit {
  ngOnInit(): void {
    this.ulogovanZaposleni = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.dohvSveRezevacijeZaZaposlenog();
  }

  private rezervacijaService = inject(RezervacijaService);

  ulogovanZaposleni: Korisnik = new Korisnik();
  sveRezervacijeZaZaposlenog: RezervacijaObjekatElementSportista[] = [];

  dohvSveRezevacijeZaZaposlenog() {
    this.rezervacijaService.dohvSveZaZaposlenog(this.ulogovanZaposleni.zaposleni_info).subscribe({
      next: (r) => {
        this.sveRezervacijeZaZaposlenog = r as RezervacijaObjekatElementSportista[];

        console.log(this.sveRezervacijeZaZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  mozeDaSeCekira(rezervacija: RezervacijaObjekatElementSportista) {
    if (
      rezervacija.status === 'dolazak' ||
      rezervacija.status === 'nedolazak' ||
      rezervacija.status === 'otkazan'
    ) {
      return false;
    }

    const [godina, mesec, dan] = rezervacija.datum.split('-').map(Number);
    const sati = rezervacija.termin_od;
    const pocetakTermina = new Date(godina, mesec - 1, dan, sati, 0, 0);
    const rokZaCekiranje = new Date(pocetakTermina.getTime() + 10 * 60 * 1000);
    const sada = new Date();

    return sada <= rokZaCekiranje && sada >= pocetakTermina;
    // return true;
  }

  mozeDaSeOdobri(rezervacija: RezervacijaObjekatElementSportista) {
    if (rezervacija.status !== 'na_cekanju') {
      return false;
    }

    const [godina, mesec, dan] = rezervacija.datum.split('-').map(Number);
    const sati = rezervacija.termin_od;
    const pocetakTermina = new Date(godina, mesec - 1, dan, sati, 0, 0);
    const rokZaCekiranje = new Date(pocetakTermina.getTime() + 10 * 60 * 1000);
    const sada = new Date();

    return sada <= rokZaCekiranje;
  }

  potvrdi(rezervacijaId: string) {
    this.rezervacijaService.potvrdi(rezervacijaId).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveRezevacijeZaZaposlenog();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  odjavi(rezervacijaId: string) {
    this.rezervacijaService.odjavi(rezervacijaId).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveRezevacijeZaZaposlenog();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  odobri(rezervacijaId: string) {
    this.rezervacijaService.odobri(rezervacijaId).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveRezevacijeZaZaposlenog();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
