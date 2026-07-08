import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { FormsModule } from '@angular/forms';
import { SportService } from '../services/sport.service';
import { Sport } from '../models/Sport';
import { KorisnikService } from '../services/korisnik.service';
import { RezervacijaService } from '../services/rezervacija.service';
import { RezervacijaZaSportistu } from '../models/RezervacijaZaSportistu';
import { Narudzbina } from '../models/Narudzbina';
import { NarudzbinaService } from '../services/narudzbina.service';

@Component({
  selector: 'app-sportista-profil',
  imports: [FormsModule],
  templateUrl: './sportista-profil.html',
  styleUrl: './sportista-profil.css',
})
export class SportistaProfil implements OnInit {
  ngOnInit(): void {
    this.sportService.dohvSve().subscribe((s) => {
      if (s instanceof Array) {
        this.dostupniSportovi = s;
      }
    });

    this.ulogovanSportista = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.ulogovanSportistaPfp = `http://localhost:4000${this.ulogovanSportista.pfp}?t=${new Date().getTime()}`;

    // this.rezervacijaService.dohvSveZaSportistu(this.ulogovanSportista._id).subscribe({
    //   next: (r) => {
    //     this.rezervacije = r as RezervacijaZaSportistu[];
    //     console.log(this.rezervacije);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });

    this.dohvSveRezervacijeZaSportistu();

    this.dohvSveNarudzbine();
  }

  private sportService = inject(SportService);
  private korisnikService = inject(KorisnikService);
  private rezervacijaService = inject(RezervacijaService);
  private narudzbinaService = inject(NarudzbinaService);

  ulogovanSportista: Korisnik = new Korisnik();
  dostupniSportovi: Sport[] = [];
  errMsg: string = '';
  rezervacije: RezervacijaZaSportistu[] = [];
  narudzbine: Narudzbina[] = [];

  novaLozinka: string = '';
  pfp: File | null = null;

  ulogovanSportistaPfp: string = '';

  dohvSveRezervacijeZaSportistu() {
    this.rezervacijaService.dohvSveZaSportistu(this.ulogovanSportista._id).subscribe({
      next: (r) => {
        this.rezervacije = r as RezervacijaZaSportistu[];
        console.log(this.rezervacije);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  dohvSveNarudzbine() {
    this.narudzbinaService.dohvSve().subscribe({
      next: (n) => {
        this.narudzbine = n as Narudzbina[];
        this.narudzbine = this.narudzbine.filter((n) => {
          return n.sportista_id === this.ulogovanSportista._id;
        });

        console.log('narudzbine: ', this.narudzbine);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private prethodniIzbor: string[] = [];
  proveriLimitSportova(noviIzbor: string[]) {
    if (noviIzbor.length > 5) {
      this.ulogovanSportista.sportovi = [...this.prethodniIzbor];
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
      !this.ulogovanSportista.ime ||
      !this.ulogovanSportista.prezime ||
      !this.ulogovanSportista.email ||
      !this.ulogovanSportista.kontakt_telefon ||
      this.ulogovanSportista.sportovi.length === 0
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
        this.ulogovanSportista.lozinka = this.novaLozinka;
        this.errMsg = '';
      }
    }

    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.ulogovanSportista.email)) {
      this.errMsg = 'Greska! Email nije u ispravnom formatu.';
      return;
    }

    if (!/^(\+3816\d{8}|06\d{8})$/.test(this.ulogovanSportista.kontakt_telefon)) {
      this.errMsg = 'Greska! Broj telefona nije u ispravnom formatu.';
      return;
    }

    this.errMsg = '';

    if (this.pfp) {
      this.korisnikService.uploadPfp(this.ulogovanSportista.kor_ime, this.pfp).subscribe({
        next: (m) => {
          this.errMsg = '';
          console.log(m);

          this.korisnikService.azurirajProfil(this.ulogovanSportista).subscribe({
            next: (k) => {
              console.log(k);

              localStorage.setItem('ulogovan', JSON.stringify(k));
              this.ulogovanSportista = JSON.parse(
                localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
              );

              this.ulogovanSportistaPfp = `http://localhost:4000${this.ulogovanSportista.pfp}?t=${new Date().getTime()}`;
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
      this.korisnikService.azurirajProfil(this.ulogovanSportista).subscribe({
        next: (k) => {
          console.log(k);

          localStorage.setItem('ulogovan', JSON.stringify(k));
          this.ulogovanSportista = JSON.parse(
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

  // PO TEKSTU PROJEKTA
  // "Дугме „Откажи“ постоји само за резервације које почињу за 12 и више сати, а ако резервација почиње за мање од 12 сати,
  // отказивање није дозвољено." => samo one koje zadovoljavaju uslov (na_cekanju, dolazak, nedolazak), ali dolazak i nedolazak
  // je moguc samo 10 minuta po pocetku termina (ovo radi zaposleni) => samo ostaju na_cekanju ali za njih pise ovo dole:
  // "Спортиста може да откаже и резервације које запослени још увек није потврдио." => sve takve? bez obzira na vreme?
  mozeOtkazati(r: RezervacijaZaSportistu) {
    if (r.status === 'otkazan' || r.status === 'nedolazak' || r.status === 'dolazak') {
      return false;
    }

    if (r.status === 'na_cekanju') return true;

    let vremeStr = r.termin_od.toString().trim();
    if (!vremeStr.includes(':')) {
      vremeStr = `${vremeStr.padStart(2, '0')}:00:00`;
    } else {
      if (vremeStr.split(':').length === 2) {
        vremeStr = `${vremeStr}:00`;
      }
    }

    const pocetakRezervacije = new Date(`${r.datum}T${vremeStr}`);
    const sada = new Date();

    const razlikaUSatima = (pocetakRezervacije.getTime() - sada.getTime()) / (1000 * 60 * 60);

    return razlikaUSatima >= 12;
  }

  otkaziRezervaciju(id: string) {
    this.rezervacijaService.otkazi(id, this.ulogovanSportista._id).subscribe({
      next: (m) => {
        console.log(m);

        this.dohvSveRezervacijeZaSportistu();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  trenutnaKolona: string = '';
  smerSortiranja: 'asc' | 'desc' = 'asc';

  sortiraj(kljuc: string) {
    if (this.trenutnaKolona === kljuc) {
      this.smerSortiranja = this.smerSortiranja === 'asc' ? 'desc' : 'asc';
    } else {
      this.trenutnaKolona = kljuc;
      this.smerSortiranja = 'asc';
    }

    this.rezervacije.sort((a: any, b: any) => {
      let vrednostA = a[kljuc];
      let vrednostB = b[kljuc];

      if (kljuc === 'termin_od') {
        const pad = (h: any) => String(h).padStart(2, '0');
        vrednostA = `${a.datum}_${pad(a.termin_od)}_${pad(a.termin_do)}`;
        vrednostB = `${b.datum}_${pad(b.termin_od)}_${pad(b.termin_do)}`;
      }

      return this.smerSortiranja === 'asc'
        ? vrednostA.localeCompare(vrednostB)
        : vrednostB.localeCompare(vrednostA);
    });
  }

  otkaziNarudzbiu(narudzbina_id: string) {
    this.narudzbinaService.otkazi(narudzbina_id).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveNarudzbine();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
