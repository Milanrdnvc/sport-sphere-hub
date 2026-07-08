import { Component, inject, OnInit } from '@angular/core';
import { TrenerSaObjektom } from '../models/TrenerSaObjektom';
import { TrenerService } from '../services/trener.service';
import { Trener } from '../models/Trener';
import { SportskiObjekat } from '../models/SportskiObjekat';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { SportService } from '../services/sport.service';
import { Sport } from '../models/Sport';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-upravljanje-trenera',
  imports: [FormsModule],
  templateUrl: './admin-upravljanje-trenera.html',
  styleUrl: './admin-upravljanje-trenera.css',
})
export class AdminUpravljanjeTrenera implements OnInit {
  ngOnInit(): void {
    this.dohvSveTrenere();

    this.sportskiObjekatService.dohvSve().subscribe({
      next: (o) => {
        this.sviSportskiObjekti = o as SportskiObjekat[];

        console.log(this.sviSportskiObjekti);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sportService.dohvSve().subscribe({
      next: (s) => {
        this.sviSportovi = (s as Sport[]).map((sp) => sp.naziv);

        console.log(this.sviSportovi);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private sportskiObjekatService = inject(SportskiObjekatService);
  private trenerService = inject(TrenerService);
  private sportService = inject(SportService);

  sviTreneri: TrenerSaObjektom[] = [];
  sviSportskiObjekti: SportskiObjekat[] = [];
  sviSportovi: string[] = [];

  noviTrener: Trener = new Trener();

  errMsg: string = '';

  dohvSveTrenere() {
    this.trenerService.dohvSve().subscribe({
      next: (t) => {
        this.sviTreneri = t as TrenerSaObjektom[];

        console.log(this.sviTreneri);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deaktivirajTrenera(trenerId: string) {
    this.trenerService.deaktiviraj(trenerId).subscribe({
      next: (m) => {
        console.log(m);

        this.dohvSveTrenere();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  dodajNovog() {
    if (
      !this.noviTrener.ime_prezime ||
      !this.noviTrener.specijalizacija ||
      !this.noviTrener.objekat_id ||
      this.noviTrener.cena_po_satu == null ||
      this.noviTrener.prosecna_ocena == null
    ) {
      this.errMsg = 'Greska! Sva polja moraju biti ispravno popunjena.';
      return;
    }

    if (this.noviTrener.cena_po_satu <= 0) {
      this.errMsg = 'Greska! Cena po satu mora biti veca od 0.';
      return;
    }

    if (this.noviTrener.prosecna_ocena < 1 || this.noviTrener.prosecna_ocena > 5) {
      this.errMsg = 'Greska! Prosečna ocena mora biti izmedju 1 i 5.';
      return;
    }

    this.errMsg = '';

    this.trenerService.kreiraj(this.noviTrener).subscribe({
      next: (m) => {
        console.log(m);
        this.noviTrener = new Trener();
        this.dohvSveTrenere();
      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.error.msg;
      },
    });
  }
}
