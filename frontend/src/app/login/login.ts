import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../services/korisnik.service';
import { Router } from '@angular/router';
import { Korisnik } from '../models/Korisnik';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private korisnikService = inject(KorisnikService);
  private router = inject(Router);

  kor_ime: string = '';
  lozinka: string = '';
  errMsg: string = '';

  linkZaResetLozinke: string = '';

  idiNaAdminPrijavu() {
    this.router.navigate(['admin-login']);
  }

  idiNaRegistraciju() {
    this.router.navigate(['register']);
  }

  resetLozinke() {
    this.router.navigate(['reset-lozinke']);
  }

  login() {
    if (this.kor_ime === '' || this.lozinka === '') {
      this.errMsg = 'Greska! Sva polja moraju biti popunjena.';
      return;
    }

    this.errMsg = '';

    this.korisnikService.login(this.kor_ime, this.lozinka).subscribe({
      next: (res) => {
        this.errMsg = '';

        const korisnik: Korisnik = res as Korisnik;

        console.log('Ulogovan: ', res);

        localStorage.setItem('ulogovan', JSON.stringify(korisnik));

        if (korisnik.tip === 'sportista') {
          // this.router.navigate(['sportista-profil']);
          window.location.href = '/sportista-profil';
        } else if (korisnik.tip === 'zaposleni') {
          window.location.href = '/zaposleni-profil';
          // this.router.navigate(['zaposleni-profil']);
        }
      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.error.msg;
      },
    });
  }
}
