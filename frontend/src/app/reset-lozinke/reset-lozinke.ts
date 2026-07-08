import { Component, inject } from '@angular/core';
import { KorisnikService } from '../services/korisnik.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-lozinke',
  imports: [RouterLink, FormsModule],
  templateUrl: './reset-lozinke.html',
  styleUrl: './reset-lozinke.css',
})
export class ResetLozinke {
  private korisnikService = inject(KorisnikService);

  generisaniLink: string = '';
  kor_ime_ili_email: string = '';

  errMsg: string = '';

  generisiLink() {
    this.korisnikService
      .zaboravljenaLozinka(this.kor_ime_ili_email)

      .subscribe({
        next: (res: any) => {
          if (Object.hasOwn(res, 'link')) {
            this.generisaniLink = res.link;
          }

          console.log(res);

          this.errMsg = '';
        },
        error: (err) => {
          console.log(err);
          this.errMsg = err.error.msg;
        },
      });
  }
}
