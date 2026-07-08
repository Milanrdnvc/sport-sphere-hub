import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { SportistaInfo } from '../models/SportistaInfo';
import { ZaposleniInfo } from '../models/ZaposleniInfo';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../services/korisnik.service';
import { Sport } from '../models/Sport';
import { SportService } from '../services/sport.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  ngOnInit(): void {
    this.sportService.dohvSve().subscribe({
      next: (s) => {
        this.sviSportovi = s as Sport[];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private korisnikService = inject(KorisnikService);
  private sportService = inject(SportService);
  private router = inject(Router);

  sviSportovi: Sport[] = [];

  noviKorisnik: Korisnik = new Korisnik();

  unetNazivObjekta: string = '';
  unetaAdresaSedista: string = '';
  unetMaticniBroj: string = '';
  unetPib: string = '';

  pfp: File | null = null;

  avatarPrikazUrl: string = '';
  avatarFile: File | null = null;

  errMsg: string = '';

  idiNaAdminPrijavu() {
    this.router.navigate(['admin-login']);
  }

  idiNaPrijavu() {
    this.router.navigate(['login']);
  }

  generisiAvatar() {
    const seed = Math.random().toString(36).substring(7);
    this.avatarPrikazUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;
  }

  async sacuvajAvatar() {
    if (!this.avatarPrikazUrl) return;

    try {
      const response = await fetch(this.avatarPrikazUrl);
      const blob = await response.blob();
      this.avatarFile = new File([blob], 'avatar.png', { type: 'image/png' });
    } catch (err) {
      console.log(err);
    }
  }

  izaberiSliku(e: any) {
    const fajl: File = e.target.files[0];

    if (fajl) {
      this.pfp = fajl;

      const slika = new Image();

      slika.onload = () => {
        if (slika.width < 100 || slika.height < 100 || slika.width > 300 || slika.height > 300) {
          this.errMsg = 'Slika mora biti između 100x100 i 300x300 px!';
          this.pfp = null;
        } else this.errMsg = '';
      };

      slika.src = URL.createObjectURL(fajl);
    }
  }

  private prethodniIzbor: string[] = [];
  proveriLimitSportova(noviIzbor: string[]) {
    if (noviIzbor.length > 5) {
      this.noviKorisnik.sportovi = [...this.prethodniIzbor];
      this.errMsg = 'Greska! Mozete izabrati maksimalno 5 sportova.';
    } else {
      this.errMsg = '';
      this.prethodniIzbor = [...noviIzbor];
    }
  }

  register() {
    if (
      this.noviKorisnik.kor_ime == '' ||
      this.noviKorisnik.lozinka == '' ||
      this.noviKorisnik.ime == '' ||
      this.noviKorisnik.prezime == '' ||
      this.noviKorisnik.kontakt_telefon == '' ||
      this.noviKorisnik.email == '' ||
      this.noviKorisnik.tip == '' ||
      (this.noviKorisnik.tip == 'zaposleni' &&
        (this.unetNazivObjekta == '' ||
          this.unetMaticniBroj == '' ||
          this.unetPib == '' ||
          this.unetaAdresaSedista == ''))
    ) {
      this.errMsg = 'Greska! Niste uneli sve podatke.';
      return;
    }

    if (
      !/^[A-Za-z][A-Za-z0-9!@#$%^&*]{7,11}$/.test(this.noviKorisnik.lozinka) ||
      (this.noviKorisnik.lozinka.match(/[A-Z]/g) || []).length < 1 ||
      (this.noviKorisnik.lozinka.match(/[0-9]/g) || []).length < 1 ||
      (this.noviKorisnik.lozinka.match(/[!@#$%^&*]/g) || []).length < 1
    ) {
      this.errMsg = 'Greska! Lozinka nije u ispravnom formatu.';
      return;
    }

    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.noviKorisnik.email)) {
      this.errMsg = 'Greska! Email nije u ispravnom formatu.';
      return;
    }

    if (!/^(\+3816\d{8}|06\d{8})$/.test(this.noviKorisnik.kontakt_telefon)) {
      this.errMsg = 'Greska! Broj telefona nije u ispravnom formatu.';
      return;
    }

    if (this.noviKorisnik.tip == 'zaposleni' && !/^\d{8}$/.test(this.unetMaticniBroj)) {
      this.errMsg = 'Greska! Maticni broj nije u ispravnom formatu.';
      return;
    }

    if (this.noviKorisnik.tip == 'zaposleni' && !/^[1-9]\d{8}$/.test(this.unetPib)) {
      this.errMsg = 'Greska! PIB nije u ispravnom formatu.';
      return;
    }

    this.errMsg = '';

    this.korisnikService
      .register(
        this.noviKorisnik,
        this.unetMaticniBroj,
        this.unetPib,
        this.unetNazivObjekta,
        this.unetaAdresaSedista,
      )
      .subscribe({
        next: (m) => {
          this.errMsg = '';
          console.log(m);

          if (this.pfp) {
            this.korisnikService.uploadPfp(this.noviKorisnik.kor_ime, this.pfp).subscribe({
              next: (m) => {
                this.errMsg = '';
                console.log(m);

                this.pfp = null;

                this.router.navigate(['login']);
              },
              error: (err) => {
                console.log(err);
                this.errMsg = err.error.msg;
              },
            });
          } else if (this.avatarFile) {
            this.korisnikService.uploadPfp(this.noviKorisnik.kor_ime, this.avatarFile).subscribe({
              next: (m) => {
                this.errMsg = '';
                console.log(m);

                this.avatarFile = null;

                this.router.navigate(['login']);
              },
              error: (err) => {
                console.log(err);
                this.errMsg = err.error.msg;
              },
            });
          }

          this.router.navigate(['login']);
        },
        error: (err) => {
          console.log(err);
          this.errMsg = err.error.msg;
        },
      });
  }
}
