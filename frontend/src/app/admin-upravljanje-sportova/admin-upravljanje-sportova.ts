import { Component, inject, OnInit } from '@angular/core';
import { Sport } from '../models/Sport';
import { SportService } from '../services/sport.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-upravljanje-sportova',
  imports: [FormsModule],
  templateUrl: './admin-upravljanje-sportova.html',
  styleUrl: './admin-upravljanje-sportova.css',
})
export class AdminUpravljanjeSportova implements OnInit {
  ngOnInit(): void {
    this.dohvSveSportove();
  }

  private sportService = inject(SportService);

  sviSportovi: Sport[] = [];

  noviSport: Sport = new Sport();

  errMsg: string = '';

  dohvSveSportove() {
    this.sportService.dohvSve().subscribe({
      next: (s) => {
        this.sviSportovi = s as Sport[];

        console.log(this.sviSportovi);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  kreiraj() {
    if (!this.noviSport.naziv) {
      this.errMsg = 'Greska! Naziv sporta je obavezan.';
      return;
    }

    this.errMsg = '';

    this.sportService.kreiraj(this.noviSport).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveSportove();

        this.noviSport = new Sport();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  obrisi(sportId: string) {
    this.sportService.obrisi(sportId).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveSportove();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
