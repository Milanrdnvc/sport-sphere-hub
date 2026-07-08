import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { Korisnik } from '../models/Korisnik';
import { SportskiObjekat } from '../models/SportskiObjekat';
import { RezervacijaService } from '../services/rezervacija.service';
import { NarudzbinaService } from '../services/narudzbina.service';

@Component({
  selector: 'app-zaposleni-izvestaji',
  imports: [FormsModule],
  templateUrl: './zaposleni-izvestaji.html',
  styleUrl: './zaposleni-izvestaji.css',
})
export class ZaposleniIzvestaji implements OnInit {
  ngOnInit(): void {
    this.ulogovanZaposleni = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.sportskiObjekatService.dohvSveAktivne(false).subscribe({
      next: (o) => {
        const objekti = o as SportskiObjekatSaRecenzijama[];
        objekti.forEach((obj) => {
          if (this.ulogovanZaposleni.zaposleni_info.objekat_ids.includes(obj.detalji_objekta._id)) {
            this.sviAktivniObjektiZaZaposlenog.push(obj);
          }
        });

        console.log(this.sviAktivniObjektiZaZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private sportskiObjekatService = inject(SportskiObjekatService);
  private rezervacijaService = inject(RezervacijaService);
  private narudzbinaSerivce = inject(NarudzbinaService);

  sviAktivniObjektiZaZaposlenog: SportskiObjekatSaRecenzijama[] = [];

  ulogovanZaposleni: Korisnik = new Korisnik();

  izabraniMesec: string = '';

  izabranObjekat: string = '';

  errMsg: string = '';

  validirajIzvestaj() {
    if (!this.izabranObjekat) {
      this.errMsg = 'Greska! Morate izabrati sportski objekat.';
      return false;
    }
    if (!this.izabraniMesec) {
      this.errMsg = 'Greska! Morate izabrati mesec za izveštaj.';
      return false;
    }

    const formatMesecaRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!formatMesecaRegex.test(this.izabraniMesec)) {
      this.errMsg = 'Greska! Neispravan format meseca (mora biti GGGG-MM).';
      return false;
    }

    this.errMsg = '';
    return true;
  }

  preuzmiPopunjenost() {
    if (!this.validirajIzvestaj()) return;

    this.rezervacijaService
      .generisiIzvestajPopunjenost(this.izabranObjekat, this.izabraniMesec)
      .subscribe({
        next: (izv) => {
          this.skiniPdf(izv, `popunjenost-${this.izabraniMesec}.pdf`);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  preuzmiPromet() {
    if (!this.validirajIzvestaj()) return;

    this.narudzbinaSerivce
      .generisiIzvestajPrometOpreme(this.izabranObjekat, this.izabraniMesec)
      .subscribe({
        next: (izv) => {
          this.skiniPdf(izv, `promet-opreme-${this.izabraniMesec}.pdf`);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  skiniPdf(blob: Blob, nazivFajla: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nazivFajla;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
