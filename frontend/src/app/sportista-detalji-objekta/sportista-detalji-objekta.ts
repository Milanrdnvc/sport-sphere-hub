import { Component, inject, OnInit } from '@angular/core';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RezervacijaService } from '../services/rezervacija.service';
import { Rezervacija } from '../models/Rezervacija';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core/index.js';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FormsModule } from '@angular/forms';
import { Korisnik } from '../models/Korisnik';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import interactionPlugin from '@fullcalendar/interaction';
import { RouterLink } from '@angular/router';
import { Recenzija } from '../models/Recenzija';
import { RecenzijaService } from '../services/recenzija.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sportista-detalji-objekta',
  imports: [FullCalendarModule, FormsModule, RouterLink, NgClass],
  templateUrl: './sportista-detalji-objekta.html',
  styleUrl: './sportista-detalji-objekta.css',
})
export class SportistaDetaljiObjekta implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    slotMinTime: '06:00:00',
    slotMaxTime: '23:00:00',
    allDaySlot: false,
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    locale: 'sr',
    selectable: true,
    selectMirror: true,
    unselectAuto: false,
    select: this.handleOdabirDatuma.bind(this),
    events: [],
  };

  ngOnInit(): void {
    this.selektovanObjekat = JSON.parse(
      localStorage.getItem('selektovanObjekat') ||
        JSON.stringify(new SportskiObjekatSaRecenzijama()),
    );

    this.ulogovanSportista = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    console.log(this.selektovanObjekat);

    this.azurirajKalendarZaSelektovaniTeren();

    this.dohvMapaUrl();

    this.recenzijaService.dohvSveZaObjekat(this.selektovanObjekat.detalji_objekta._id).subscribe({
      next: (r) => {
        console.log('recenzija', r);
        this.sveRecenzijeZaObjekat = r as Recenzija[];

        this.sveRecenzijeZaObjekat = this.sveRecenzijeZaObjekat
          .sort((a: Recenzija, b: Recenzija) => {
            return new Date(b.datum_objave).getTime() - new Date(a.datum_objave).getTime();
          })
          .slice(0, 5);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  constructor(private sanitizer: DomSanitizer) {}

  private recenzijaService = inject(RecenzijaService);
  private rezervacijaService = inject(RezervacijaService);

  ulogovanSportista: Korisnik = new Korisnik();
  rezervacijeZaElemente: Rezervacija[] = [];
  selektovanObjekat: SportskiObjekatSaRecenzijama = new SportskiObjekatSaRecenzijama();
  sveRecenzijeZaObjekat: Recenzija[] = [];

  novaRezervacija: Rezervacija = new Rezervacija();

  trenutniIndeks: number = 0;

  aktivniEl = this.selektovanObjekat.detalji_objekta.elementi[this.trenutniIndeks];

  errMsg: string = '';

  trenutniKalendarApi: any;

  mapaUrl: SafeResourceUrl = '';

  validanDatum(datumStr: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datumStr)) return false;

    const [godina, mesec, dan] = datumStr.split('-').map(Number);

    const d = new Date(godina, mesec - 1, dan);

    return d.getFullYear() === godina && d.getMonth() === mesec - 1 && d.getDate() === dan;
  }

  handleOdabirDatuma(selectInfo: DateSelectArg) {
    const start = selectInfo.start;
    const end = selectInfo.end;

    const godina = start.getFullYear();
    const mesec = String(start.getMonth() + 1).padStart(2, '0');
    const dan = String(start.getDate()).padStart(2, '0');

    this.novaRezervacija.datum = `${godina}-${mesec}-${dan}`;

    this.novaRezervacija.termin_od = start.getHours();
    this.novaRezervacija.termin_do = end.getHours();

    this.novaRezervacija.sport = this.novaRezervacija.sport;

    const calendarApi = selectInfo.view.calendar;
    this.trenutniKalendarApi = calendarApi;
  }

  dohvMapaUrl() {
    const lat = this.selektovanObjekat?.detalji_objekta.lat;
    const lon = this.selektovanObjekat?.detalji_objekta.lon;

    const url = `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;

    this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  azurirajKalendarZaSelektovaniTeren() {
    this.aktivniEl = this.selektovanObjekat.detalji_objekta.elementi[this.trenutniIndeks];

    console.log(this.aktivniEl);

    this.rezervacijaService.dohvSveZaElement(this.aktivniEl._id).subscribe({
      next: (r) => {
        this.rezervacijeZaElemente = r as Rezervacija[];
        // console.log(this.rezervacijeZaElemente);

        this.calendarOptions.events = this.rezervacijeZaElemente
          .filter((r) => r.status !== 'otkazan')
          .map((r) => {
            const eventObj = {
              title: `Zauzeto (${r.sport})`,
              start: `${r.datum}T${r.termin_od < 10 ? '0' : ''}${r.termin_od}:00:00`,
              end: `${r.datum}T${r.termin_do < 10 ? '0' : ''}${r.termin_do}:00:00`,
              backgroundColor: '#f8d7da',
              textColor: '#721c24',
              borderColor: '#f5c6cb',
            };

            // console.log(eventObj);

            return eventObj;
          });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  prethodniElement() {
    if (this.trenutniIndeks > 0) {
      this.trenutniIndeks--;
    } else {
      this.trenutniIndeks = this.selektovanObjekat.detalji_objekta.elementi.length - 1;
    }
    this.azurirajKalendarZaSelektovaniTeren();
  }

  sledeciElement() {
    if (this.trenutniIndeks < this.selektovanObjekat.detalji_objekta.elementi.length - 1) {
      this.trenutniIndeks++;
    } else {
      this.trenutniIndeks = 0;
    }
    this.azurirajKalendarZaSelektovaniTeren();
  }

  rezervisi() {
    this.novaRezervacija.element_id = this.aktivniEl._id;
    this.novaRezervacija.objekat_id = this.selektovanObjekat.detalji_objekta._id;
    this.novaRezervacija.sportista_id = this.ulogovanSportista._id;
    this.novaRezervacija.tip = 'standardna';

    if (!this.novaRezervacija.datum || !this.novaRezervacija.sport) {
      this.errMsg = 'Greska! Sva polja moraju biti popunjena.';
      return;
    }

    // const formatDatumaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!this.validanDatum(this.novaRezervacija.datum)) {
      this.errMsg = 'Greska! Datum mora vazeci i u formatu YYYY-MM-DD (npr. 2026-06-20).';
      return;
    }

    const satPocetka = String(this.novaRezervacija.termin_od).padStart(2, '0');

    const izabraniDatumIVreme = new Date(`${this.novaRezervacija.datum}T${satPocetka}:00:00`);

    if (izabraniDatumIVreme < new Date()) {
      this.errMsg = 'Greska! Datum i vreme moraju biti u buducnosti.';
      return;
    }

    if (
      this.novaRezervacija.termin_od < 0 ||
      this.novaRezervacija.termin_od > 23 ||
      this.novaRezervacija.termin_do < 0 ||
      this.novaRezervacija.termin_do > 23
    ) {
      this.errMsg = 'Greska! Vreme mora biti u formatu od 00 do 23 casa.';
      return;
    }

    if (Number(this.novaRezervacija.termin_od) >= Number(this.novaRezervacija.termin_do)) {
      this.errMsg = 'Greska! Vreme zavrsetka termina mora biti vece od vremena pocetka.';
      return;
    }

    if (
      Number(this.novaRezervacija.termin_od) <
        Number(this.selektovanObjekat.detalji_objekta.radno_vreme_od) ||
      Number(this.novaRezervacija.termin_do) >
        Number(this.selektovanObjekat.detalji_objekta.radno_vreme_do)
    ) {
      this.errMsg = 'Greska! Rezervacija mora biti tokom radnog vremena objekta.';
      return;
    }

    this.errMsg = '';

    this.rezervacijaService.nova(this.novaRezervacija).subscribe({
      next: (m) => {
        console.log(m);
        this.trenutniKalendarApi && this.trenutniKalendarApi.unselect();

        this.ngOnInit();

        this.novaRezervacija = new Rezervacija();
      },
      error: (err) => {
        this.errMsg = err.error.msg;
        this.trenutniKalendarApi && this.trenutniKalendarApi.unselect();
        console.log('test', err);
      },
    });
  }
}
