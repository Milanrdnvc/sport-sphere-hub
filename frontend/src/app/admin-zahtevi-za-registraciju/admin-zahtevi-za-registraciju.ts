import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-admin-zahtevi-za-registraciju',
  imports: [],
  templateUrl: './admin-zahtevi-za-registraciju.html',
  styleUrl: './admin-zahtevi-za-registraciju.css',
})
export class AdminZahteviZaRegistraciju implements OnInit {
  ngOnInit(): void {
    this.dohvSveKorisnike();
  }

  private korisnikService = inject(KorisnikService);

  dohvSveKorisnike() {
    this.korisnikService.dohvSve().subscribe({
      next: (k) => {
        this.sviKorisnici = k as Korisnik[];

        this.korisniciNaCekanju = this.sviKorisnici.filter((kor) => {
          return kor.status === 'na_cekanju';
        });

        console.log(this.korisniciNaCekanju);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  sviKorisnici: Korisnik[] = [];
  korisniciNaCekanju: Korisnik[] = [];

  errMsg: string = '';

  odobri(korisnikId: string) {
    this.korisnikService.odobriNalog(korisnikId).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveKorisnike();
      },
      error: (err) => {
        this.errMsg = err.error.msg;
        console.log(err);
      },
    });
  }

  odbij(korisnikId: string) {
    this.korisnikService.odbijNalog(korisnikId).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveKorisnike();
      },
      error: (err) => {
        this.errMsg = err.error.msg;
        console.log(err);
      },
    });
  }
}
