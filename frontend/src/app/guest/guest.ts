import { Component, inject, OnInit } from '@angular/core';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { SportService } from '../services/sport.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PromocijaService } from '../services/promocija.service';
import { PromocijaSaObjektom } from '../models/PromocijaSaObjektom';

@Component({
  selector: 'app-guest',
  imports: [FormsModule],
  templateUrl: './guest.html',
  styleUrl: './guest.css',
})
export class Guest implements OnInit {
  ngOnInit(): void {
    this.sportskiObjekatService.dohvSveAktivne(false).subscribe({
      next: (s) => {
        console.log(s);
        this.aktivniSportskiObjekti = s as SportskiObjekatSaRecenzijama[];
        this.aktivniSportskiObjektiFiltrirani = s as SportskiObjekatSaRecenzijama[];

        this.top3 = (s as SportskiObjekatSaRecenzijama[]).slice(0, 3);

        this.aktivniSportskiObjekti.forEach((obj) => {
          if (!this.gradovi.includes(obj.detalji_objekta.grad)) {
            this.gradovi.push(obj.detalji_objekta.grad);
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sportService.dohvSve().subscribe({
      next: (sport) => {
        console.log(sport);

        if (sport instanceof Array) {
          sport.forEach((s) => this.sportovi.push(s.naziv));
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.promocijaService.dohvDo3Aktuelne().subscribe({
      next: (p) => {
        console.log(p);

        this.do3Promocije = p as PromocijaSaObjektom[];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private router = inject(Router);
  private sportskiObjekatService = inject(SportskiObjekatService);
  private sportService = inject(SportService);
  private promocijaService = inject(PromocijaService);

  aktivniSportskiObjekti: SportskiObjekatSaRecenzijama[] = [];
  top3: SportskiObjekatSaRecenzijama[] = [];
  do3Promocije: PromocijaSaObjektom[] = [];
  gradovi: string[] = [];
  sportovi: string[] = [];

  unetNaziv: string = '';
  izabraniGrad: string = '';
  izabraniSport: string = '';
  izabraniTipTerena: string = '';

  aktivniSportskiObjektiFiltrirani: SportskiObjekatSaRecenzijama[] = [];

  trenutnaKolona: string = '';
  smerSortiranja: 'asc' | 'desc' = 'asc';

  idiNaPrijavu() {
    this.router.navigate(['login']);
  }

  idiNaRegistraciju() {
    this.router.navigate(['register']);
  }

  sortiraj(kljuc: string) {
    if (this.trenutnaKolona === kljuc) {
      this.smerSortiranja = this.smerSortiranja === 'asc' ? 'desc' : 'asc';
    } else {
      this.trenutnaKolona = kljuc;
      this.smerSortiranja = 'asc';
    }

    this.aktivniSportskiObjektiFiltrirani.sort((a: any, b: any) => {
      let vrednostA = '';
      let vrednostB = '';

      if (kljuc === 'vrste_sportova') {
        vrednostA = a.detalji_objekta.vrste_sportova.join(', ') || '';
        vrednostB = b.detalji_objekta.vrste_sportova.join(', ') || '';
      } else {
        vrednostA = a.detalji_objekta?.[kljuc] || '';
        vrednostB = b.detalji_objekta?.[kljuc] || '';
      }

      return this.smerSortiranja === 'asc'
        ? vrednostA.localeCompare(vrednostB)
        : vrednostB.localeCompare(vrednostA);
    });
  }

  pretrazi() {
    this.aktivniSportskiObjektiFiltrirani = this.aktivniSportskiObjekti.filter((obj) => {
      const poklapaSeGrad = !this.izabraniGrad || obj.detalji_objekta.grad === this.izabraniGrad;

      const poklapaSeTekst =
        !this.unetNaziv ||
        obj.detalji_objekta.naziv.toLowerCase().includes(this.unetNaziv.toLowerCase());

      const poklapaSeSport =
        !this.izabraniSport || obj.detalji_objekta.vrste_sportova.includes(this.izabraniSport);

      const poklapaSeTipTerena =
        !this.izabraniTipTerena ||
        obj.detalji_objekta.elementi.some((el: any) => {
          if (this.izabraniTipTerena === 'zatvorena_hala' && el.tip === 'dvorana') return true;
          return el.tip === this.izabraniTipTerena;
        });

      return poklapaSeGrad && poklapaSeSport && poklapaSeTekst && poklapaSeTipTerena;
    });
  }

  detalji(o: SportskiObjekatSaRecenzijama) {
    localStorage.setItem('selektovanObjekat', JSON.stringify(o));

    this.router.navigate(['detalji-objekta']);
  }
}
