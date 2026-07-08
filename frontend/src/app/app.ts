import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Korisnik } from './models/Korisnik';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  ngOnInit(): void {
    this.ulogovanKorisnik = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    if (window.location.pathname === '/' || window.location.pathname === '/guest')
      if (this.ulogovanKorisnik.tip) {
        if (this.ulogovanKorisnik.tip === 'sportista') {
          this.router.navigate(['sportista-profil']);
        } else if (this.ulogovanKorisnik.tip === 'zaposleni') {
          this.router.navigate(['zaposleni-profil']);
        }
      } else if (this.ulogovanKorisnik.kor_ime) {
        this.router.navigate(['admin-upravljanje-korisnicima']);
      } else {
        this.router.navigate(['guest']);
      }
  }

  private router = inject(Router);

  ulogovanKorisnik: Korisnik = new Korisnik();

  title = 'SportSphere Hub';
}
