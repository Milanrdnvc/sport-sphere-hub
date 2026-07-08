import { Component, inject, OnInit } from '@angular/core';
import { SportService } from '../services/sport.service';
import { FormsModule } from '@angular/forms';
import { OglasService } from '../services/oglas.service';
import { Oglas } from '../models/Oglas';
import { Korisnik } from '../models/Korisnik';
import { OglasSaSportistima } from '../models/OglasSaSportistima';

@Component({
  selector: 'app-sportista-saigraci',
  imports: [FormsModule],
  templateUrl: './sportista-saigraci.html',
  styleUrl: './sportista-saigraci.css',
})
export class SportistaSaigraci implements OnInit {
  ngOnInit(): void {
    this.sportService.dohvSve().subscribe({
      next: (sport) => {
        console.log('sportovi: ', sport);

        if (sport instanceof Array) {
          sport.forEach((s) => this.sportovi.push(s.naziv));
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.ulogovanSportista = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    console.log(this.ulogovanSportista);

    this.dohvatiSveOglase();
  }

  private sportService = inject(SportService);
  private oglasService = inject(OglasService);

  ulogovanSportista: Korisnik = new Korisnik();

  sportovi: string[] = [];
  aktivniOglasiDrugih: OglasSaSportistima[] = [];
  aktivniOglasiSportiste: OglasSaSportistima[] = [];

  noviOglas: Oglas = new Oglas();

  errMsg: string = '';

  validanDatum(datumStr: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datumStr)) return false;

    const [godina, mesec, dan] = datumStr.split('-').map(Number);

    const d = new Date(godina, mesec - 1, dan);

    return d.getFullYear() === godina && d.getMonth() === mesec - 1 && d.getDate() === dan;
  }

  dohvatiSveOglase() {
    this.oglasService.dohvSveSaKorisnicima().subscribe({
      next: (o) => {
        const sviOglasi = o as OglasSaSportistima[];

        this.aktivniOglasiDrugih = sviOglasi.filter((ogl) => {
          return ogl.status === 'aktivan' && ogl.sportista_id._id !== this.ulogovanSportista._id;
        });

        this.aktivniOglasiSportiste = sviOglasi.filter((ogl) => {
          return ogl.status === 'aktivan' && ogl.sportista_id._id === this.ulogovanSportista._id;
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  postaviOglas() {
    if (
      !this.noviOglas.sport ||
      !this.noviOglas.grad ||
      !this.noviOglas.datum ||
      !this.noviOglas.termin_od ||
      !this.noviOglas.termin_do ||
      !this.noviOglas.potrebno_igraca
    ) {
      this.errMsg = 'Greska! Sva polja moraju biti ispravno popunjena.';
      return;
    }

    if (this.noviOglas.potrebno_igraca <= 0) {
      this.errMsg = 'Greska! Broj nedostajucih igraca mora biti veci od 0.';
      return;
    }

    if (
      this.noviOglas.termin_od < 0 ||
      this.noviOglas.termin_do > 23 ||
      this.noviOglas.termin_od < 0 ||
      this.noviOglas.termin_do > 23
    ) {
      this.errMsg = 'Greska! Vreme mora biti u opsegu od 0 do 23 casa.';
      return;
    }

    if (Number(this.noviOglas.termin_do) <= Number(this.noviOglas.termin_od)) {
      this.errMsg = 'Greska! Vreme zavrsetka mora biti nakon vremena pocetka.';
      return;
    }

    // const formatDatumaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!this.validanDatum(this.noviOglas.datum)) {
      this.errMsg = 'Greska! Datum mora vazeci i u formatu YYYY-MM-DD (npr. 2026-06-20).';
      return;
    }

    const satPocetka = String(this.noviOglas.termin_od).padStart(2, '0');

    const izabraniDatumIVreme = new Date(`${this.noviOglas.datum}T${satPocetka}:00:00`);

    if (izabraniDatumIVreme < new Date()) {
      this.errMsg = 'Greska! Datum i vreme moraju biti u buducnosti.';
      return;
    }

    this.errMsg = '';

    this.noviOglas.sportista_id = this.ulogovanSportista._id;

    this.oglasService.kreiraj(this.noviOglas).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvatiSveOglase();

        this.noviOglas = new Oglas();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  jePrijavljen(oglas: OglasSaSportistima): boolean {
    const uPrijavljenima = oglas.prijavljeni_sportisti_ids.some(
      (s) => s._id === this.ulogovanSportista._id,
    );
    const uPrihvacenima = oglas.prihvaceni_sportisti_ids.some(
      (s) => s._id === this.ulogovanSportista._id,
    );

    return uPrijavljenima || uPrihvacenima;
  }

  pridruziSe(oglas_id: string) {
    this.oglasService.pridruzi(oglas_id, this.ulogovanSportista._id).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvatiSveOglase();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  zatvori(oglas_id: string) {
    this.oglasService.zatvori(oglas_id, this.ulogovanSportista._id).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvatiSveOglase();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  odobri(oglas_id: string, sportista_id: string) {
    this.oglasService.odobri(oglas_id, sportista_id, this.ulogovanSportista._id).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvatiSveOglase();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  odbij(oglas_id: string, sportista_id: string) {
    this.oglasService.odbij(oglas_id, sportista_id, this.ulogovanSportista._id).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvatiSveOglase();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
