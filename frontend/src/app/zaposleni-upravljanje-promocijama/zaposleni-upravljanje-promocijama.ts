import { Component, inject, OnInit } from '@angular/core';
import { Promocija } from '../models/Promocija';
import { Korisnik } from '../models/Korisnik';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { FormsModule } from '@angular/forms';
import { PromocijaService } from '../services/promocija.service';

@Component({
  selector: 'app-zaposleni-upravljanje-promocijama',
  imports: [FormsModule],
  templateUrl: './zaposleni-upravljanje-promocijama.html',
  styleUrl: './zaposleni-upravljanje-promocijama.css',
})
export class ZaposleniUpravljanjePromocijama implements OnInit {
  ngOnInit(): void {
    this.ulogovanZaposleni = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.sportskiObjekatService.dohvSveAktivne(false).subscribe({
      next: (o) => {
        (o as SportskiObjekatSaRecenzijama[]).forEach((obj) => {
          if (this.ulogovanZaposleni.zaposleni_info.objekat_ids.includes(obj.detalji_objekta._id)) {
            this.sviAktivniSportskiObjektiZaZaposlenog.push(obj);
          }
        });

        console.log(this.sviAktivniSportskiObjektiZaZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.promocijaService.dohvSveZaZaposlenog(this.ulogovanZaposleni.zaposleni_info).subscribe({
      next: (p) => {
        this.svePromocijeObjekataZaposlenog = p as Promocija[];

        console.log(this.svePromocijeObjekataZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  validanDatum(datumStr: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datumStr)) return false;

    const [godina, mesec, dan] = datumStr.split('-').map(Number);

    const d = new Date(godina, mesec - 1, dan);

    return d.getFullYear() === godina && d.getMonth() === mesec - 1 && d.getDate() === dan;
  }

  private sportskiObjekatService = inject(SportskiObjekatService);
  private promocijaService = inject(PromocijaService);

  ulogovanZaposleni: Korisnik = new Korisnik();

  novaPromocija: Promocija = new Promocija();

  sviAktivniSportskiObjektiZaZaposlenog: SportskiObjekatSaRecenzijama[] = [];

  dostupniSportoviZaObjekat: string[] = [];

  svePromocijeObjekataZaposlenog: Promocija[] = [];

  errMsg: string = '';
  errMsgAzuriranje: { [key: string]: string } = {};

  validirajPromociju(promocija: Promocija, proveraPocetnogDatuma: boolean) {
    if (
      !promocija.naziv ||
      !promocija.objekat_id ||
      !promocija.sport ||
      !promocija.datum_od ||
      !promocija.datum_do ||
      !promocija.popust ||
      !promocija.vrsta_popusta
    ) {
      return 'Greska! Sva polja moraju biti ispravno popunjena.';
    }

    // const formatDatumaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!this.validanDatum(promocija.datum_od) || !this.validanDatum(promocija.datum_do)) {
      this.errMsg = 'Greska! Datum mora vazeci i u formatu YYYY-MM-DD (npr. 2026-06-20).';
      return;
    }

    const datumOd = new Date(promocija.datum_od);
    const datumDo = new Date(promocija.datum_do);
    const sada = new Date();
    sada.setHours(0, 0, 0, 0);

    if (datumDo < datumOd) {
      return 'Greska! Datum zavrsetka ne moze biti pre datuma pocetka.';
    }

    if (proveraPocetnogDatuma && datumOd < sada) {
      return 'Greska! Datum pocetka nove promocije ne moze biti u proslosti.';
    }

    if (promocija.vrsta_popusta === 'procenat') {
      if (promocija.popust <= 0 || promocija.popust > 100) {
        return 'Greska! Procentualni popust mora biti vrednost izmedju 1 i 100.';
      }
    } else if (promocija.vrsta_popusta === 'fiksan') {
      if (promocija.popust <= 0) {
        return 'Greska! Fiksni popust mora biti veci od nule.';
      }
    }

    return null;
  }

  dohvatiSportoveZaObjekat(objekat_id: string) {
    const objekat = this.sviAktivniSportskiObjektiZaZaposlenog.find(
      (o) => o.detalji_objekta._id === objekat_id,
    );
    return objekat ? objekat.detalji_objekta.vrste_sportova : [];
  }

  azurirajDostupneSportove() {
    this.dostupniSportoviZaObjekat = [];

    this.sviAktivniSportskiObjektiZaZaposlenog.forEach((obj) => {
      if (obj.detalji_objekta._id === this.novaPromocija.objekat_id) {
        obj.detalji_objekta.vrste_sportova.forEach((s) => {
          this.dostupniSportoviZaObjekat.push(s);
        });
        return;
      }
    });
  }

  kreirajNovu() {
    const greska = this.validirajPromociju(this.novaPromocija, true);

    if (greska) {
      this.errMsg = greska;
      return;
    }

    this.errMsg = '';

    console.log(this.novaPromocija);

    this.promocijaService.kreirajNovu(this.novaPromocija).subscribe({
      next: (m) => {
        console.log(m);
        this.novaPromocija = new Promocija();

        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.error.message;
      },
    });
  }

  azurirajPostojecu(p: Promocija) {
    const greska = this.validirajPromociju(p, false);

    if (greska) {
      this.errMsgAzuriranje[p._id] = greska;
      return;
    }

    this.errMsgAzuriranje[p._id] = '';
    console.log(p);

    this.promocijaService.azurirajPostojecu(p).subscribe({
      next: (m) => {
        console.log(m);

        this.ngOnInit();
      },
      error: (err) => {
        this.errMsgAzuriranje[p._id] = err.error.msg;
        console.log(err);
      },
    });
  }
}
