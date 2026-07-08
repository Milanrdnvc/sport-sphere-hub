import { Component, inject } from '@angular/core';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { SportskiObjekat } from '../models/SportskiObjekat';

@Component({
  selector: 'app-admin-upravljanje-objektima',
  imports: [],
  templateUrl: './admin-upravljanje-objektima.html',
  styleUrl: './admin-upravljanje-objektima.css',
})
export class AdminUpravljanjeObjektima {
  ngOnInit(): void {
    this.dohvSveSportskeObjekte();
  }

  private sportskObjekatService = inject(SportskiObjekatService);

  dohvSveSportskeObjekte() {
    this.sportskObjekatService.dohvSve().subscribe({
      next: (k) => {
        this.sviObjekti = k as SportskiObjekat[];

        this.objektiNaCekanju = this.sviObjekti.filter((o) => {
          return o.status === 'na_cekanju';
        });

        console.log(this.objektiNaCekanju);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  sviObjekti: SportskiObjekat[] = [];
  objektiNaCekanju: SportskiObjekat[] = [];

  errMsg: string = '';

  odobri(objekatId: string) {
    this.sportskObjekatService.odobriObjekat(objekatId).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveSportskeObjekte();
      },
      error: (err) => {
        this.errMsg = err.error.msg;
        console.log(err);
      },
    });
  }

  odbij(objekatId: string) {
    this.sportskObjekatService.odbijObjekat(objekatId).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveSportskeObjekte();
      },
      error: (err) => {
        this.errMsg = err.error.msg;
        console.log(err);
      },
    });
  }
}
