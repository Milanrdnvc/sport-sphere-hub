import { Component, inject } from '@angular/core';
import { Sport } from '../models/Sport';
import { SportService } from '../services/sport.service';
import { FormsModule } from '@angular/forms';
import { Element } from '../models/Element';
import { SportskiObjekat } from '../models/SportskiObjekat';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { Korisnik } from '../models/Korisnik';

@Component({
  selector: 'app-zaposleni-upravljanje-objektima',
  imports: [FormsModule],
  templateUrl: './zaposleni-upravljanje-objektima.html',
  styleUrl: './zaposleni-upravljanje-objektima.css',
})
export class ZaposleniUpravljanjeObjektima {
  ngOnInit(): void {
    this.ulogovanZaposleni = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.sportService.dohvSve().subscribe((s) => {
      if (s instanceof Array) {
        s.forEach((sp) => this.sviSportovi.push(sp.naziv));
      }
    });

    this.sportskiObjekatService.dohvSveAktivne(false).subscribe({
      next: (obj) => {
        this.sviAktivniObjekti = obj as SportskiObjekatSaRecenzijama[];
        this.sviAktivniObjektiZaposlenog = this.sviAktivniObjekti.filter((obj) => {
          return this.ulogovanZaposleni.zaposleni_info.objekat_ids.includes(
            obj.detalji_objekta._id,
          );
        });

        console.log(this.sviAktivniObjektiZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private sportService = inject(SportService);
  private sportskiObjekatService = inject(SportskiObjekatService);

  ulogovanZaposleni: Korisnik = new Korisnik();

  sviAktivniObjektiZaposlenog: SportskiObjekatSaRecenzijama[] = [];
  sviAktivniObjekti: SportskiObjekatSaRecenzijama[] = [];
  sviSportovi: string[] = [];
  errMsg: string = '';
  errMsgJson: string = '';
  errMsgAzuriranje: { [key: string]: string } = {};

  izabraneSlike: File[] = [];
  slikePrikaz: string[] = [];

  elementi: Element[] = [];
  noviObjekat: SportskiObjekat = new SportskiObjekat();
  noviObjekti: SportskiObjekat[] = [];

  noveSlikeAzuriranjeFajlovi: { [objekatId: string]: File[] } = {};
  noveSlikeAzuriranjePrikaz: { [objekatId: string]: string[] } = {};

  ukloniPrikaz(i: number) {
    this.izabraneSlike.splice(i, 1);
    this.slikePrikaz.splice(i, 1);
  }

  ukloniPrikazPriAzuriranju(obj: SportskiObjekat, i: number) {
    obj.galerija.splice(i, 1);
  }

  ukloniPrikazPriAzuriranjuNoveSlike(obj: SportskiObjekat, i: number) {
    this.noveSlikeAzuriranjePrikaz[obj._id].splice(i, 1);
    this.noveSlikeAzuriranjeFajlovi[obj._id].splice(i, 1);
  }

  dodajElement() {
    this.elementi.push(new Element());
  }

  dodajElementPriAzuriranju(obj: SportskiObjekat) {
    obj.elementi.push(new Element());
  }

  izaberiSlikeZaGaleriju(e: any) {
    const fajlovi: FileList = e.target.files;

    if (fajlovi && fajlovi.length > 0) {
      for (let i = 0; i < fajlovi.length; i++) {
        const fajl = fajlovi[i];

        const slika = new Image();
        slika.onload = () => {
          this.izabraneSlike.push(fajl);
          this.slikePrikaz.push(URL.createObjectURL(fajl));
        };
        slika.src = URL.createObjectURL(fajl);
      }
    }
  }

  izaberiSlikuZaGalerijuPriAzuriranju(e: any, obj: SportskiObjekat) {
    const fajlovi: FileList = e.target.files;
    const id = obj._id;

    if (fajlovi && fajlovi.length > 0) {
      if (!this.noveSlikeAzuriranjeFajlovi[id]) this.noveSlikeAzuriranjeFajlovi[id] = [];
      if (!this.noveSlikeAzuriranjePrikaz[id]) this.noveSlikeAzuriranjePrikaz[id] = [];

      for (let i = 0; i < fajlovi.length; i++) {
        const fajl = fajlovi[i];

        const slika = new Image();
        slika.onload = () => {
          this.noveSlikeAzuriranjeFajlovi[id].push(fajl);
          this.noveSlikeAzuriranjePrikaz[id].push(URL.createObjectURL(fajl));
        };
        slika.src = URL.createObjectURL(fajl);
      }
    }
  }

  ucitajObjekteIzJSONFajla(e: any) {
    const fajl = e.target.files[0];
    this.noviObjekti = [];

    if (fajl) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const tekstSadrzaj = e.target.result;
        const parsiraniPodaci = JSON.parse(tekstSadrzaj);

        if (Array.isArray(parsiraniPodaci)) {
          parsiraniPodaci.forEach((p) => {
            this.noviObjekti.push(p);
          });
        } else {
          this.noviObjekti.push(parsiraniPodaci);
        }
      };

      reader.readAsText(fajl);

      // e.target.value = '';
    }
  }

  kreirajNoviJSON() {
    for (const noviObjekat of this.noviObjekti) {
      if (!this.validirajObjekat(noviObjekat) || !this.validirajElemente(noviObjekat)) {
        this.errMsgJson = this.errMsg;
        this.errMsg = '';
        return;
      }
    }

    this.errMsgJson = '';

    for (const noviObjekat of this.noviObjekti) {
      this.sportskiObjekatService.kreirajNovi(this.ulogovanZaposleni._id, noviObjekat).subscribe({
        next: (obj) => {
          console.log(obj);
        },
        error: (err) => {
          console.log(err);
          this.errMsgJson = err.error.msg;
        },
      });
    }
  }

  validirajObjekat(obj: any): boolean {
    if (
      !obj.naziv ||
      !obj.grad ||
      !obj.adresa ||
      !obj.maticni_broj ||
      !obj.pib ||
      !obj.duzi_opis ||
      !obj.vrste_sportova ||
      obj.vrste_sportova.length === 0
    ) {
      this.errMsg = 'Greska! Sva polja moraju biti ispravno popunjena.';
      return false;
    }

    const radnoOd = parseInt(obj.radno_vreme_od);
    const radnoDo = parseInt(obj.radno_vreme_do);
    const kazne = Number(obj.broj_dozvoljenih_kazni);
    const cena = Number(obj.cenovnik_po_satu);
    const latituda = Number(obj.lat);
    const longituda = Number(obj.lon);

    if (
      isNaN(radnoOd) ||
      isNaN(radnoDo) ||
      isNaN(kazne) ||
      isNaN(cena) ||
      isNaN(latituda) ||
      isNaN(longituda)
    ) {
      this.errMsg = 'Greska! Sva polja moraju biti ispravno popunjena.';
      return false;
    }

    if (!/^\d{8}$/.test(obj.maticni_broj)) {
      this.errMsg = 'Greska! Maticni broj nije u ispravnom formatu.';
      return false;
    }

    if (!/^[1-9]\d{8}$/.test(obj.pib)) {
      this.errMsg = 'Greska! PIB nije u ispravnom formatu.';
      return false;
    }

    if (radnoOd < 0 || radnoOd > 23 || radnoDo < 0 || radnoDo > 23) {
      this.errMsg = 'Greska! Vreme mora biti u formatu od 00 do 23 casa.';
      return false;
    }

    if (radnoOd >= radnoDo) {
      this.errMsg = 'Greska! Vreme zavrsetka radnog vremena mora biti vece od vremena pocetka.';
      return false;
    }

    if (kazne < 0) {
      this.errMsg = 'Greska! Broj dozvoljenih kazni ne sme biti negativna vrednost.';
      return false;
    }

    if (cena <= 0) {
      this.errMsg = 'Greska! Cenovnik po satu mora biti pozitivna vrednost.';
      return false;
    }

    return true;
  }

  validirajElemente(objekat: SportskiObjekat) {
    const lokalniNaziviElemenata = new Set<string>();

    for (const element of objekat.elementi) {
      if (
        !element.naziv ||
        !element.tip ||
        element.podrzani_sportovi.length === 0 ||
        element.kapacitet === null ||
        isNaN(element.kapacitet)
      ) {
        this.errMsg = 'Greska! Sva polja moraju biti ispravno popunjena.';
        return false;
      }

      if (element.kapacitet <= 0) {
        this.errMsg = `Greska! Kapacitet elementa mora biti veci od 0.`;
        return false;
      }

      const standardizovanNaziv = element.naziv.trim().toLowerCase();
      if (lokalniNaziviElemenata.has(standardizovanNaziv)) {
        this.errMsg = `Greska! Svi elementi moraju imati jedinstvene nazive.`;
        return false;
      }
      lokalniNaziviElemenata.add(standardizovanNaziv);

      for (let sport of element.podrzani_sportovi) {
        if (!objekat.vrste_sportova.includes(sport)) {
          this.errMsg =
            'Greska! Element sadrzi sport koji nije izabran u vrstama sportova objekta.';
          return false;
        }
      }
    }

    const minimalanUslov = objekat.elementi.some((element) => {
      const tip = element.tip === 'otvoreni_teren';
      const kapacitet = element.kapacitet >= 4;
      return tip && kapacitet;
    });

    if (!minimalanUslov) {
      this.errMsg = 'Greska! Mora postojati baren jedan otvoreni teren sa kapacitetom 4 ili vise.';
      return false;
    }

    return true;
  }

  kreirajNovi() {
    this.noviObjekat.elementi = [...this.elementi];
    if (!this.validirajObjekat(this.noviObjekat) || !this.validirajElemente(this.noviObjekat))
      return;

    console.log(this.noviObjekat);

    this.errMsg = '';

    this.sportskiObjekatService
      .kreirajNovi(this.ulogovanZaposleni._id, this.noviObjekat)
      .subscribe({
        next: (obj) => {
          const noviObjekat = obj as SportskiObjekat;

          this.noviObjekat = new SportskiObjekat();
          this.elementi = [];

          if (this.izabraneSlike.length > 0) {
            this.sportskiObjekatService
              .uploadGalerija(noviObjekat._id, this.izabraneSlike)
              .subscribe({
                next: (m) => {
                  console.log(m);
                  this.izabraneSlike = [];
                  this.slikePrikaz = [];
                },
                error: (err) => {
                  console.log(err);
                },
              });
          }
        },
        error: (err) => {
          console.log(err);
          this.errMsg = err.error.msg;
        },
      });
  }

  azurirajPostojeci(obj: SportskiObjekat) {
    console.log('test');

    if (!this.validirajObjekat(obj) || !this.validirajElemente(obj)) {
      this.errMsgAzuriranje[obj._id] = this.errMsg;
      this.errMsg = '';
      return;
    }

    console.log('test1');

    this.errMsgAzuriranje[obj._id] = '';

    this.sportskiObjekatService.azurirajPostojeci(obj).subscribe({
      next: (o) => {
        console.log(o);

        const objekat = o as SportskiObjekat;

        if (
          this.noveSlikeAzuriranjeFajlovi[objekat._id] &&
          this.noveSlikeAzuriranjeFajlovi[objekat._id].length > 0
        ) {
          this.sportskiObjekatService
            .uploadGalerija(objekat._id, this.noveSlikeAzuriranjeFajlovi[objekat._id])
            .subscribe({
              next: (m) => {
                console.log(m);

                delete this.noveSlikeAzuriranjeFajlovi[objekat._id];
                delete this.noveSlikeAzuriranjePrikaz[objekat._id];
              },
              error: (err) => {
                console.log(err);
              },
            });
        }
      },
      error: (err) => {
        console.log(err);
        this.errMsgAzuriranje[obj._id] = err.error.msg;
      },
    });
  }
}
