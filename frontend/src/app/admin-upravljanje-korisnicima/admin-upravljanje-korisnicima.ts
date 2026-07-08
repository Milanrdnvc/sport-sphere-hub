import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { KorisnikService } from '../services/korisnik.service';
import { FormsModule } from '@angular/forms';
import { SportService } from '../services/sport.service';
import { Sport } from '../models/Sport';

@Component({
  selector: 'app-admin-upravljanje-korisnicima',
  imports: [FormsModule],
  templateUrl: './admin-upravljanje-korisnicima.html',
  styleUrl: './admin-upravljanje-korisnicima.css',
})
export class AdminUpravljanjeKorisnicima implements OnInit {
  ngOnInit(): void {
    this.dohvSveKorisnike();

    this.sportService.dohvSve().subscribe((s) => {
      if (s instanceof Array) {
        this.dostupniSportovi = s;
      }
    });
  }

  private korisnikService = inject(KorisnikService);
  private sportService = inject(SportService);

  sviKorisnici: Korisnik[] = [];

  dostupniSportovi: Sport[] = [];

  errMsgAzuriranje: { [key: string]: string } = {};

  dohvSveKorisnike() {
    this.korisnikService.dohvSve().subscribe({
      next: (k) => {
        this.sviKorisnici = k as Korisnik[];

        console.log(this.sviKorisnici);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private prethodniIzbor: string[] = [];
  proveriLimitSportova(noviIzbor: string[], k: Korisnik) {
    if (noviIzbor.length > 5) {
      k.sportovi = [...this.prethodniIzbor];
      this.errMsgAzuriranje[k._id] = 'Greska! Mozete izabrati maksimalno 5 sportova.';
    } else {
      this.errMsgAzuriranje[k._id] = '';
      this.prethodniIzbor = [...noviIzbor];
    }
  }

  azurirajProfil(k: Korisnik) {
    const poljaNisuUneta =
      !k.ime || !k.prezime || !k.email || !k.kontakt_telefon || k.sportovi.length === 0;

    if (poljaNisuUneta) {
      this.errMsgAzuriranje[k._id] = 'Greska! Sva polja moraju biti ispravno popunjena.';
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(k.email)) {
      this.errMsgAzuriranje[k._id] = 'Greska! Email nije u ispravnom formatu.';
      return;
    }

    const telefonRegex = /^(\+3816\d{8}|06\d{8})$/;
    if (!telefonRegex.test(k.kontakt_telefon)) {
      this.errMsgAzuriranje[k._id] = 'Greska! Broj telefona nije u ispravnom formatu.';
      return;
    }

    this.errMsgAzuriranje[k._id] = '';

    this.korisnikService.azurirajProfil(k).subscribe({
      next: (kor) => {
        console.log(kor);
        this.dohvSveKorisnike();
      },
      error: (err) => {
        this.errMsgAzuriranje[k._id] = err.error.msg;
        console.log(err);
      },
    });
  }

  resetujPfp(korisnikId: string) {
    this.korisnikService.resetujPfp(korisnikId).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveKorisnike();
      },
      error: (err) => {
        this.errMsgAzuriranje[korisnikId] = err.error.msg;
        console.log(err);
      },
    });
  }

  obrisiNalog(korisnikId: string) {
    this.korisnikService.obrisiNalog(korisnikId).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveKorisnike();
      },
      error: (err) => {
        this.errMsgAzuriranje[korisnikId] = err.error.msg;
        console.log(err);
      },
    });
  }
}
