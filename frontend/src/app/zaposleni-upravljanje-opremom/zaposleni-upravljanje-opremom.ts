import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Korisnik } from '../models/Korisnik';
import { Oprema } from '../models/Oprema';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { SportService } from '../services/sport.service';
import { Sport } from '../models/Sport';
import { OpremaService } from '../services/oprema.service';
import { NarudzbinaService } from '../services/narudzbina.service';
import { Narudzbina } from '../models/Narudzbina';

@Component({
  selector: 'app-zaposleni-upravljanje-opremom',
  imports: [FormsModule],
  templateUrl: './zaposleni-upravljanje-opremom.html',
  styleUrl: './zaposleni-upravljanje-opremom.css',
})
export class ZaposleniUpravljanjeOpremom implements OnInit {
  ngOnInit(): void {
    this.ulogovanZaposleni = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.sportskiObjekatService.dohvSveAktivne(false).subscribe({
      next: (obj) => {
        this.sviAktivniObjektiZaposlenog = obj as SportskiObjekatSaRecenzijama[];
        this.sviAktivniObjektiZaposlenog = this.sviAktivniObjektiZaposlenog.filter((o) => {
          return this.ulogovanZaposleni.zaposleni_info.objekat_ids.includes(o.detalji_objekta._id);
        });

        console.log('svi aktivni objekti zaposlneog:', this.sviAktivniObjektiZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sportService.dohvSve().subscribe({
      next: (s) => {
        const sportovi = s as Sport[];
        sportovi.forEach((sport) => {
          this.sviSportovi.push(sport.naziv);
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.dohvSvuOpremu();

    this.dohvSveNarudzbine();
  }

  private narudzbinaService = inject(NarudzbinaService);
  private opremaService = inject(OpremaService);
  private sportskiObjekatService = inject(SportskiObjekatService);
  private sportService = inject(SportService);

  ulogovanZaposleni: Korisnik = new Korisnik();

  novaOprema: Oprema = new Oprema();

  sviAktivniObjektiZaposlenog: SportskiObjekatSaRecenzijama[] = [];
  sviSportovi: string[] = [];
  svaOpremaZaObjekteZaposlenog: Oprema[] = [];
  sveNarudzbineObjekataZaposlenog: Narudzbina[] = [];

  izabranaSlika: File | null = null;
  izabranaSlikaPrikaz: string = '';

  errMsg: string = '';
  errMsgAzuriranje: { [key: string]: string } = {};

  validirajOpremu(oprema: Oprema, isUpdate: boolean = false) {
    if (isUpdate) {
      if (
        oprema.cena === undefined ||
        oprema.cena === null ||
        oprema.zalihe === undefined ||
        oprema.zalihe === null
      ) {
        return 'Greska! Sva polja moraju biti ispravno popunjena.';
      }
    } else {
      if (
        !oprema.naziv ||
        !oprema.objekat_id ||
        !oprema.vrsta_sporta ||
        oprema.cena === undefined ||
        oprema.cena === null ||
        oprema.zalihe === undefined ||
        oprema.zalihe === null
      ) {
        return 'Greska! Sva polja moraju biti ispravno popunjena.';
      }
    }

    if (oprema.cena <= 0) {
      return 'Greska! Cena opreme mora biti veca od nule.';
    }

    if (oprema.zalihe < 0) {
      return 'Greska! Kolicina na zalihama ne moze biti negativna.';
    }

    return null;
  }

  dohvSveNarudzbine() {
    this.narudzbinaService.dohvSve().subscribe({
      next: (n) => {
        this.sveNarudzbineObjekataZaposlenog = [];
        const sveNarudzbine = n as Narudzbina[];

        this.sveNarudzbineObjekataZaposlenog = sveNarudzbine.filter((nar) => {
          return this.ulogovanZaposleni.zaposleni_info.objekat_ids.includes(nar.objekat_id);
        });

        // sveNarudzbine.forEach((nar) => {
        // const objId = nar.objekat_id;
        // if (this.ulogovanZaposleni.zaposleni_info.objekat_ids.includes(objId)) {
        // this.sveNarudzbineObjekataZaposlenog.push(nar);
        // }
        //

        console.log('sve narudzbine objekata zaposlenog', this.sveNarudzbineObjekataZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  dohvSvuOpremu() {
    this.opremaService.dohvSve().subscribe({
      next: (o) => {
        this.svaOpremaZaObjekteZaposlenog = (o as Oprema[]).filter((op) => {
          return this.ulogovanZaposleni.zaposleni_info.objekat_ids.includes(op.objekat_id);
        });

        console.log('Sva oprema za objekte zaposlenog:', this.svaOpremaZaObjekteZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  izaberiSliku(e: any) {
    const fajl: File = e.target.files[0];

    if (fajl) {
      const slika = new Image();

      slika.onload = () => {
        this.izabranaSlika = fajl;
        this.izabranaSlikaPrikaz = URL.createObjectURL(fajl);
      };

      slika.src = URL.createObjectURL(fajl);
    }
  }

  ukloniPrikaz() {
    this.izabranaSlika = null;
    this.izabranaSlikaPrikaz = '';
  }

  kreirajNovu() {
    const greska = this.validirajOpremu(this.novaOprema, false);
    if (greska) {
      this.errMsg = greska;
      return;
    }
    this.errMsg = '';

    this.opremaService.kreirajNovu(this.novaOprema).subscribe({
      next: (o) => {
        console.log(o);

        const oprema = o as Oprema;

        if (this.izabranaSlika) {
          this.opremaService.uploadSlikaOpreme(oprema._id, this.izabranaSlika).subscribe({
            next: (m) => {
              console.log(m);
              this.izabranaSlika = null;
              this.izabranaSlikaPrikaz = '';
              this.dohvSvuOpremu();
            },
            error: (err) => {
              console.log(err);
              this.errMsg = err.error.msg;
            },
          });
        }

        this.dohvSvuOpremu();

        this.novaOprema = new Oprema();
      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.error.msg;
      },
    });
  }

  azurirajPostojecu(o: Oprema) {
    const greska = this.validirajOpremu(o, true);
    if (greska) {
      this.errMsgAzuriranje[o._id] = greska;
      return;
    }
    this.errMsgAzuriranje[o._id] = '';

    this.opremaService.azurirajPostojecu(o).subscribe({
      next: (m) => {
        console.log(m);
      },
      error: (err) => {
        console.log(err);
        this.errMsgAzuriranje[o._id] = err.error.msg;
      },
    });
  }

  prihvati(n: Narudzbina) {
    this.narudzbinaService.prihvati(n).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveNarudzbine();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  preuzeto(n: Narudzbina) {
    this.narudzbinaService.preuzeto(n).subscribe({
      next: (m) => {
        console.log(m);
        this.dohvSveNarudzbine();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
