import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../services/korisnik.service';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { Sport } from '../models/Sport';
import { SportService } from '../services/sport.service';

@Component({
  selector: 'app-zaposleni-profil',
  imports: [FormsModule],
  templateUrl: './zaposleni-profil.html',
  styleUrl: './zaposleni-profil.css',
})
export class ZaposleniProfil implements OnInit {
  ngOnInit(): void {
    this.sportService.dohvSve().subscribe((s) => {
      if (s instanceof Array) {
        this.dostupniSportovi = s;
      }
    });

    this.ulogovanZaposleni = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.ulogovanZaposleniPfp = `http://localhost:4000${this.ulogovanZaposleni.pfp}?t=${new Date().getTime()}`;

    this.sportskiObjekatService.dohvSveAktivne(false).subscribe({
      next: (s) => {
        console.log(s);

        this.aktivniSportskiObjekti = s as SportskiObjekatSaRecenzijama[];
        this.aktivniSportskiObjektiZaposlenog = this.aktivniSportskiObjekti.filter((so) => {
          if (this.ulogovanZaposleni.zaposleni_info.objekat_ids.includes(so.detalji_objekta._id))
            return true;
          return false;
        });

        console.log(this.aktivniSportskiObjektiZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private sportService = inject(SportService);
  private korisnikService = inject(KorisnikService);
  private sportskiObjekatService = inject(SportskiObjekatService);

  ulogovanZaposleni: Korisnik = new Korisnik();
  errMsg: string = '';

  aktivniSportskiObjekti: SportskiObjekatSaRecenzijama[] = [];
  aktivniSportskiObjektiZaposlenog: SportskiObjekatSaRecenzijama[] = [];
  dostupniSportovi: Sport[] = [];

  novaLozinka: string = '';
  pfp: File | null = null;

  ulogovanZaposleniPfp: string = '';

  private prethodniIzbor: string[] = [];
  proveriLimitSportova(noviIzbor: string[]) {
    if (noviIzbor.length > 5) {
      this.ulogovanZaposleni.sportovi = [...this.prethodniIzbor];
      this.errMsg = 'Greska! Mozete izabrati maksimalno 5 sportova.';
    } else {
      this.errMsg = '';
      this.prethodniIzbor = [...noviIzbor];
    }
  }

  izaberiSliku(e: any) {
    const fajl: File = e.target.files[0];

    if (fajl) {
      this.pfp = fajl;

      const slika = new Image();

      slika.onload = () => {
        if (slika.width < 100 || slika.height < 100 || slika.width > 300 || slika.height > 300) {
          this.errMsg = 'Slika mora biti između 100x100 i 300x300 px!';
          this.pfp = null;
        }
      };

      slika.src = URL.createObjectURL(fajl);
    }
  }

  azurirajProfil() {
    if (
      !this.ulogovanZaposleni.ime ||
      !this.ulogovanZaposleni.prezime ||
      !this.ulogovanZaposleni.email ||
      !this.ulogovanZaposleni.kontakt_telefon ||
      this.ulogovanZaposleni.sportovi.length === 0
    ) {
      this.errMsg = 'Greska! Sva polja moraju biti ispravno popunjena.';
      return;
    }

    if (this.novaLozinka.length > 0) {
      if (
        !/^[A-Za-z][A-Za-z0-9!@#$%^&*]{7,11}$/.test(this.novaLozinka) ||
        (this.novaLozinka.match(/[A-Z]/g) || []).length < 1 ||
        (this.novaLozinka.match(/[0-9]/g) || []).length < 1 ||
        (this.novaLozinka.match(/[!@#$%^&*]/g) || []).length < 1
      ) {
        this.errMsg = 'Greska! Lozinka nije u ispravnom formatu.';
        return;
      } else {
        this.ulogovanZaposleni.lozinka = this.novaLozinka;
        this.errMsg = '';
      }
    }

    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.ulogovanZaposleni.email)) {
      this.errMsg = 'Greska! Email nije u ispravnom formatu.';
      return;
    }

    if (!/^(\+3816\d{8}|06\d{8})$/.test(this.ulogovanZaposleni.kontakt_telefon)) {
      this.errMsg = 'Greska! Broj telefona nije u ispravnom formatu.';
      return;
    }

    this.errMsg = '';

    if (this.pfp) {
      this.korisnikService.uploadPfp(this.ulogovanZaposleni.kor_ime, this.pfp).subscribe({
        next: (m) => {
          this.errMsg = '';
          console.log(m);

          this.korisnikService.azurirajProfil(this.ulogovanZaposleni).subscribe({
            next: (k) => {
              localStorage.setItem('ulogovan', JSON.stringify(k));
              this.ulogovanZaposleni = JSON.parse(
                localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
              );

              this.ulogovanZaposleniPfp = `http://localhost:4000${this.ulogovanZaposleni.pfp}?t=${new Date().getTime()}`;
            },
            error: (err) => {
              this.errMsg = err.error.msg;
              console.log(err);
            },
          });
        },
        error: (err) => {
          console.log(err);
          this.errMsg = err.error.msg;
        },
      });
    } else {
      this.korisnikService.azurirajProfil(this.ulogovanZaposleni).subscribe({
        next: (k) => {
          localStorage.setItem('ulogovan', JSON.stringify(k));
          this.ulogovanZaposleni = JSON.parse(
            localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
          );
        },
        error: (err) => {
          this.errMsg = err.error.msg;
          console.log(err);
        },
      });
    }
  }
}
