import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { SportService } from '../services/sport.service';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';

@Component({
  selector: 'app-sportista-rezervacija',
  imports: [FormsModule],
  templateUrl: './sportista-rezervacija.html',
  styleUrl: './sportista-rezervacija.css',
})
export class SportistaRezervacija {
  ngOnInit(): void {
    this.sportskiObjekatService.dohvSveAktivne(false).subscribe({
      next: (s) => {
        console.log(s);
        this.aktivniSportskiObjekti = s as SportskiObjekatSaRecenzijama[];
        this.aktivniSportskiObjektiFiltrirani = s as SportskiObjekatSaRecenzijama[];

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

    this.sportskiObjekatService.dohvSveAktivne(true).subscribe({
      next: (s) => {
        console.log('slobodni termini danas', s);
        this.aktivniSportskiObjektiSlobodnoDanas = s as SportskiObjekatSaRecenzijama[];
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
  }

  private router = inject(Router);
  private sportskiObjekatService = inject(SportskiObjekatService);
  private sportService = inject(SportService);

  aktivniSportskiObjekti: SportskiObjekatSaRecenzijama[] = [];
  aktivniSportskiObjektiSlobodnoDanas: SportskiObjekatSaRecenzijama[] = [];
  gradovi: string[] = [];
  sportovi: string[] = [];

  unetNaziv: string = '';
  izabraniGrad: string = '';
  izabraniSport: string = '';
  izabraniTipTerena: string = '';
  slobodnoDanas: boolean = false;

  aktivniSportskiObjektiFiltrirani: SportskiObjekatSaRecenzijama[] = [];

  pretrazi() {
    const objektiZaFiltriranje = this.slobodnoDanas
      ? this.aktivniSportskiObjektiSlobodnoDanas
      : this.aktivniSportskiObjekti;

    this.aktivniSportskiObjektiFiltrirani = objektiZaFiltriranje.filter((obj) => {
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

    this.router.navigate(['sportista-detalji-objekta']);
  }
}
