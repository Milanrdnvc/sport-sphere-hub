import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { Oprema } from '../models/Oprema';
import { OpremaService } from '../services/oprema.service';
import { SportService } from '../services/sport.service';
import { Sport } from '../models/Sport';
import { FormsModule } from '@angular/forms';
import { Narudzbina } from '../models/Narudzbina';
import { NarudzbinaService } from '../services/narudzbina.service';
import { SportskiObjekat } from '../models/SportskiObjekat';
import { Stavka } from '../models/Stavka';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';

@Component({
  selector: 'app-sportista-prodavnica',
  imports: [FormsModule],
  templateUrl: './sportista-prodavnica.html',
  styleUrl: './sportista-prodavnica.css',
})
export class SportistaProdavnica implements OnInit {
  ngOnInit(): void {
    this.ulogovanSportista = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.dohvatiSvuOpremu();

    this.sportService.dohvSve().subscribe({
      next: (s) => {
        console.log(s);
        const sportovi: Sport[] = s as Sport[];
        sportovi.forEach((sp) => {
          this.sviSportovi.push(sp.naziv);
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sportskiObjekatService.dohvSveAktivne(false).subscribe({
      next: (o) => {
        const sviSportskiObjektiSaRecenzijama = o as SportskiObjekatSaRecenzijama[];
        this.sviSportskiObjekti = sviSportskiObjektiSaRecenzijama.map((so) => {
          return so.detalji_objekta;
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private opremaService = inject(OpremaService);
  private sportService = inject(SportService);
  private narudzbinaService = inject(NarudzbinaService);
  private sportskiObjekatService = inject(SportskiObjekatService);

  ulogovanSportista: Korisnik = new Korisnik();
  svaOprema: Oprema[] = [];
  sviSportovi: string[] = [];
  sviSportskiObjekti: SportskiObjekat[] = [];

  izabraniSport: string = '';
  izabraniObjekatId: string = '';
  filtriranaOprema: Oprema[] = [];

  kolicine: { [id_opreme: string]: number } = {};

  novaNarudzbina: Narudzbina = new Narudzbina();

  ukupnaCena: number = 0;

  objekatId: string = '';

  errMsg: string = '';

  dohvatiSvuOpremu() {
    this.opremaService.dohvSve().subscribe({
      next: (o) => {
        console.log(o);
        this.svaOprema = o as Oprema[];
        this.filtriranaOprema = this.svaOprema;

        // ovo sam imao pre kada sam dovlacio sportske objekte preko opreme
        // this.svaOprema.forEach((o) => {
        //   const vecPostoji = this.sviSportskiObjekti.some((obj) => {
        //     return obj._id === o.objekat_id;
        //   });

        //   if (!vecPostoji) this.sviSportskiObjekti.push(o.objekat_id);
        // });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  pretrazi() {
    this.filtriranaOprema = this.svaOprema.filter((o) => {
      const poklapaSeSport = !this.izabraniSport || o.vrsta_sporta === this.izabraniSport;
      const poklapaSeObjekat = !this.izabraniObjekatId || o.objekat_id === this.izabraniObjekatId;

      return poklapaSeSport && poklapaSeObjekat;
    });
  }

  dodajUKorpu(o: Oprema) {
    if (this.objekatId && this.objekatId !== o.objekat_id) {
      this.errMsg = 'Greska! U korpi mogu biti samo proizvodi koje prodaje isti sportski objekat.';
      return;
    }

    if (!this.kolicine[o._id] || this.kolicine[o._id] <= 0) {
      this.errMsg = 'Greska! Kolicina mora biti barem 1.';
      return;
    }

    this.errMsg = '';

    this.objekatId = o.objekat_id;

    const novaStavka = new Stavka();
    novaStavka.naziv = o.naziv;
    novaStavka.artikal_id = o._id;
    novaStavka.cena_u_trenutku_kupovine = o.cena;
    novaStavka.kolicina = this.kolicine[o._id];
    this.novaNarudzbina.stavke.push(novaStavka);

    this.ukupnaCena += novaStavka.cena_u_trenutku_kupovine * novaStavka.kolicina;
  }

  ukloniIzKorpe(i: number) {
    this.ukupnaCena -=
      this.novaNarudzbina.stavke[i].cena_u_trenutku_kupovine *
      this.novaNarudzbina.stavke[i].kolicina;
    this.novaNarudzbina.stavke.splice(i, 1);
  }

  naruci() {
    if (this.novaNarudzbina.stavke.length === 0) {
      this.errMsg = 'Greska! Narudzbina mora imati barem jednu stavku.';
      return;
    }

    this.novaNarudzbina.sportista_id = this.ulogovanSportista._id;
    this.novaNarudzbina.objekat_id = this.objekatId;

    console.log(this.novaNarudzbina);

    this.narudzbinaService.naruci(this.novaNarudzbina).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvatiSvuOpremu();
        this.novaNarudzbina = new Narudzbina();
        this.ukupnaCena = 0;
      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.error.msg;
      },
    });
  }
}
