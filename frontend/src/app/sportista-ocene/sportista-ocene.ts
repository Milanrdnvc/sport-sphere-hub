import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { FormsModule } from '@angular/forms';
import { RecenzijaService } from '../services/recenzija.service';

@Component({
  selector: 'app-sportista-ocene',
  imports: [FormsModule],
  templateUrl: './sportista-ocene.html',
  styleUrl: './sportista-ocene.css',
})
export class SportistaOcene implements OnInit {
  ngOnInit(): void {
    this.ulogovanSportista = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.sportskiObjekatService.dohvSveAktivne(false).subscribe({
      next: (o) => {
        this.sviAktivniObjekti = o as SportskiObjekatSaRecenzijama[];

        console.log(o);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private sportskiObjekatService = inject(SportskiObjekatService);
  private recenzijaService = inject(RecenzijaService);

  ulogovanSportista: Korisnik = new Korisnik();

  sviAktivniObjekti: SportskiObjekatSaRecenzijama[] = [];

  komentar: string = '';
  like: string = '';
  dislike: string = '';
  objekat_id: string = '';

  errMsg: string = '';

  ostaviRecenziju() {
    if ((!this.like && !this.dislike) || !this.objekat_id) {
      this.errMsg = 'Greska! Morate izabrati objekat i ostaviti reakciju.';
      return;
    }

    this.recenzijaService
      .ostaviRecenziju(
        this.ulogovanSportista._id,
        this.objekat_id,
        this.like || this.dislike,
        this.komentar,
      )
      .subscribe({
        next: (m) => {
          console.log(m);

          this.komentar = '';
          this.like = '';
          this.dislike = '';
          this.objekat_id = '';
        },
        error: (err) => {
          this.errMsg = err.error.msg;
          console.log(err);
        },
      });
  }
}
