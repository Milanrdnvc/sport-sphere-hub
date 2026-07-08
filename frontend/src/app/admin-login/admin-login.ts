import { Component, inject } from '@angular/core';
import { KorisnikService } from '../services/korisnik.service';
import { Admin } from '../models/Admin';
import { Msg } from '../models/Msg';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Korisnik } from '../models/Korisnik';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  private router = inject(Router);
  private korisnikService = inject(KorisnikService);

  kor_ime: string = '';
  lozinka: string = '';
  errMsg: string = '';

  idiNaPrijavu() {
    this.router.navigate(['login']);
  }

  idiNaRegistraciju() {
    this.router.navigate(['register']);
  }

  login() {
    if (this.kor_ime === '' || this.lozinka === '') {
      this.errMsg = 'Greska! Sva polja moraju biti popunjena.';
      return;
    }

    this.errMsg = '';

    this.korisnikService.adminLogin(this.kor_ime, this.lozinka).subscribe({
      next: (res) => {
        this.errMsg = '';

        const admin: Korisnik = res as Korisnik;

        console.log('Ulogovan: ', res);

        localStorage.setItem('ulogovan', JSON.stringify(admin));

        // this.router.navigate(['admin-upravljanje-korisnicima']);

        window.location.href = '/admin-upravljanje-korisnicima';
      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.error.msg;
      },
    });
  }
}
