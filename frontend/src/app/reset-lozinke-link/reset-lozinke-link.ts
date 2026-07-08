import { Component, inject, OnInit } from '@angular/core';
import { KorisnikService } from '../services/korisnik.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-lozinke-link',
  imports: [FormsModule],
  templateUrl: './reset-lozinke-link.html',
  styleUrl: './reset-lozinke-link.css',
})
export class ResetLozinkeLink implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  private korisnikService = inject(KorisnikService);

  errMsg: string = '';

  novaLozinka: string = '';
  novaLozinkaPotvrda: string = '';
  token: string = '';

  postavi() {
    if (this.novaLozinka !== this.novaLozinkaPotvrda) {
      this.errMsg = 'Greska! Lozinke se ne poklapaju.';
      return;
    }

    if (
      !/^[A-Za-z][A-Za-z0-9!@#$%^&*]{7,11}$/.test(this.novaLozinka) ||
      (this.novaLozinka.match(/[A-Z]/g) || []).length < 1 ||
      (this.novaLozinka.match(/[0-9]/g) || []).length < 1 ||
      (this.novaLozinka.match(/[!@#$%^&*]/g) || []).length < 1
    ) {
      this.errMsg = 'Greska! Lozinka nije u ispravnom formatu.';
      return;
    }

    this.errMsg = '';

    this.korisnikService.resetujLozinku(this.novaLozinka, this.token).subscribe({
      next: (m) => {
        console.log(m);
        this.errMsg = '';
      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.error.msg;
      },
    });
  }
}
