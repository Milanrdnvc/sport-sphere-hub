import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  ngOnInit(): void {
    this.ulogovanKorisnik = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.uloga = this.ulogovanKorisnik.tip;
  }

  private router = inject(Router);

  ulogovanKorisnik: Korisnik = new Korisnik();
  uloga: string = '';

  idiNaPocetnu(): string {
    if (this.uloga === 'sportista') return '/sportista-profil';
    if (this.uloga === 'zaposleni') return '/zaposleni-profil';
    if (!this.uloga && this.ulogovanKorisnik.kor_ime) return '/admin-upravljanje-korisnicima';
    return '/guest'; // Ako niko nije ulogovan
  }

  izlogujSe(): void {
    localStorage.removeItem('ulogovan');
    this.router.navigate(['/login']);

    this.ngOnInit();
  }
}
