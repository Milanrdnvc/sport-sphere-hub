import { Component, inject, OnInit } from '@angular/core';
import { TrenerService } from '../services/trener.service';
import { TrenerSaObjektom } from '../models/TrenerSaObjektom';
import { FormsModule } from '@angular/forms';
import { RezervacijaService } from '../services/rezervacija.service';
import { Rezervacija } from '../models/Rezervacija';
import { Korisnik } from '../models/Korisnik';

@Component({
  selector: 'app-sportista-trening',
  imports: [FormsModule],
  templateUrl: './sportista-trening.html',
  styleUrl: './sportista-trening.css',
})
export class SportistaTrening implements OnInit {
  ngOnInit(): void {
    this.trenerService.dohvSve().subscribe({
      next: (t) => {
        console.log(t);
        this.sviTreneri = t as TrenerSaObjektom[];

        this.pretrazi();

        this.sviTreneri.forEach((t) => {
          if (!this.dostupniSportovi.includes(t.specijalizacija))
            this.dostupniSportovi.push(t.specijalizacija);

          if (!this.dostupniObjekti.includes(t.objekat_id.naziv)) {
            this.dostupniObjekti.push(t.objekat_id.naziv);
          }

          this.sviTreneri.forEach((t) => {
            if (!this.noviTreninzi[t._id]) {
              this.noviTreninzi[t._id] = new Rezervacija();
            }
          });
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.ulogovanSportista = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );
  }

  private trenerService = inject(TrenerService);
  private rezervacijaService = inject(RezervacijaService);

  ulogovanSportista: Korisnik = new Korisnik();

  sviTreneri: TrenerSaObjektom[] = [];
  dostupniSportovi: string[] = [];
  dostupniObjekti: string[] = [];

  izabraniObjekat: string = '';
  izabraniSport: string = '';
  pronadjeniTreneri: TrenerSaObjektom[] = [];

  noviTreninzi: { [rezervacijaId: string]: Rezervacija } = {};

  errMsg: string = '';

  validanDatum(datumStr: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datumStr)) return false;

    const [godina, mesec, dan] = datumStr.split('-').map(Number);

    const d = new Date(godina, mesec - 1, dan);

    return d.getFullYear() === godina && d.getMonth() === mesec - 1 && d.getDate() === dan;
  }

  pretrazi() {
    this.pronadjeniTreneri = this.sviTreneri.filter((t) => {
      const poklapaSeSport = !this.izabraniSport || this.izabraniSport === t.specijalizacija;
      const poklapaSeObjekat = !this.izabraniObjekat || this.izabraniObjekat === t.objekat_id.naziv;

      return poklapaSeObjekat && poklapaSeSport;
    });

    console.log(this.pronadjeniTreneri);
  }

  zakaziTreninig(pT: TrenerSaObjektom) {
    const noviTreningRezervacija: Rezervacija = this.noviTreninzi[pT._id];

    if (
      !noviTreningRezervacija.datum ||
      !noviTreningRezervacija.termin_od ||
      !noviTreningRezervacija.termin_do
    ) {
      this.errMsg = 'Greska! Sva polja moraju biti ispravno popunjena.';
      return;
    }

    if (
      noviTreningRezervacija.termin_od < 0 ||
      noviTreningRezervacija.termin_do > 23 ||
      noviTreningRezervacija.termin_od < 0 ||
      noviTreningRezervacija.termin_do > 23
    ) {
      this.errMsg = 'Greska! Vreme mora biti u opsegu od 0 do 23 casa.';
      return;
    }

    if (noviTreningRezervacija.termin_do <= noviTreningRezervacija.termin_od) {
      this.errMsg = 'Greska! Vreme zavrsetka mora biti nakon vremena pocetka.';
      return;
    }

    // const formatDatumaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!this.validanDatum(noviTreningRezervacija.datum)) {
      this.errMsg = 'Greska! Datum mora vazeci i u formatu YYYY-MM-DD (npr. 2026-06-20).';
      return;
    }

    const selektovaniDatum = new Date(noviTreningRezervacija.datum);
    selektovaniDatum.setHours(0, 0, 0, 0);
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);

    if (selektovaniDatum < danas) {
      this.errMsg = 'Greska! Datum ne moze biti u proslosti.';
      return;
    }

    this.errMsg = '';

    noviTreningRezervacija.objekat_id = pT.objekat_id._id;
    noviTreningRezervacija.sportista_id = this.ulogovanSportista._id;
    noviTreningRezervacija.sport = pT.specijalizacija;
    noviTreningRezervacija.trener_id = pT._id;
    noviTreningRezervacija.tip = 'trening';

    this.rezervacijaService.nova(noviTreningRezervacija).subscribe({
      next: (m) => {
        console.log(m);

        this.noviTreninzi[pT._id] = new Rezervacija();
      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.error.msg;
      },
    });
  }
}
