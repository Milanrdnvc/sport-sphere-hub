import { Component, inject, OnInit } from '@angular/core';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalji-objekta',
  imports: [],
  templateUrl: './detalji-objekta.html',
  styleUrl: './detalji-objekta.css',
})
export class DetaljiObjekta implements OnInit {
  ngOnInit(): void {
    this.selektovanObjekat = JSON.parse(
      localStorage.getItem('selektovanObjekat') ||
        JSON.stringify(new SportskiObjekatSaRecenzijama()),
    );

    console.log(this.selektovanObjekat);
  }

  private router = inject(Router);

  nazad() {
    this.router.navigate(['guest']);
  }

  selektovanObjekat: SportskiObjekatSaRecenzijama = new SportskiObjekatSaRecenzijama();
}
