import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { SportskiObjekatSaRecenzijama } from '../models/SportskiObjekatSaRecenzijama';
import { SportskiObjekatService } from '../services/sportski-objekat.service';
import { RezervacijaService } from '../services/rezervacija.service';
import { Rezervacija } from '../models/Rezervacija';
import { FormsModule } from '@angular/forms';
import { Element } from '../models/Element';
import { SportskiObjekat } from '../models/SportskiObjekat';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventDropArg } from '@fullcalendar/core/index.js';
import timeGridPlugin from '@fullcalendar/timegrid';
import { RezervacijaObjekatElementSportista } from '../models/RezervacijaObjekatElementSportista';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-zaposleni-kalendar',
  imports: [FormsModule, FullCalendarModule],
  templateUrl: './zaposleni-kalendar.html',
  styleUrl: './zaposleni-kalendar.css',
})
export class ZaposleniKalendar implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    slotMinTime: '06:00:00',
    slotMaxTime: '24:00:00',
    allDaySlot: false,
    locale: 'sr',
    editable: true,
    eventDrop: this.pomeranjeTermina.bind(this),
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
    events: [],
  };

  ngOnInit(): void {
    this.ulogovanZaposleni = JSON.parse(
      localStorage.getItem('ulogovan') || JSON.stringify(new Korisnik()),
    );

    this.sportskiObjekatService.dohvSveAktivne(false).subscribe({
      next: (o) => {
        const objekti = o as SportskiObjekatSaRecenzijama[];
        objekti.forEach((obj) => {
          if (this.ulogovanZaposleni.zaposleni_info.objekat_ids.includes(obj.detalji_objekta._id)) {
            this.sviAktivniObjektiZaZaposlenog.push(obj);
          }
        });

        console.log(this.sviAktivniObjektiZaZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.rezervacijaService.dohvSveZaZaposlenog(this.ulogovanZaposleni.zaposleni_info).subscribe({
      next: (r) => {
        const rezervacije = r as RezervacijaObjekatElementSportista[];
        this.sveRezervacijeObjekataZaposlenog = rezervacije;

        console.log(this.sveRezervacijeObjekataZaposlenog);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private sportskiObjekatService = inject(SportskiObjekatService);
  private rezervacijaService = inject(RezervacijaService);

  ulogovanZaposleni: Korisnik = new Korisnik();
  sviAktivniObjektiZaZaposlenog: SportskiObjekatSaRecenzijama[] = [];
  sveRezervacijeObjekataZaposlenog: RezervacijaObjekatElementSportista[] = [];

  elementiIzabranogObjekta: Element[] = [];

  izabranObjekat: SportskiObjekat = new SportskiObjekat();
  izabranElementObjekta: Element = new Element();

  tekuceRezervacije: RezervacijaObjekatElementSportista[] = [];

  errMsg: string = '';

  pomeranjeTermina(info: EventDropArg) {
    const rezervacijaId = info.event.id;

    const noviDatum = info.event.startStr.split('T')[0];

    const noviTerminOd = info.event.start!.getHours();
    const noviTerminDo = info.event.end!.getHours();

    this.rezervacijaService
      .pomeriRezervaciju(rezervacijaId, noviDatum, noviTerminOd, noviTerminDo)
      .subscribe({
        next: (m) => {
          console.log(m);
          this.errMsg = '';
        },
        error: (err) => {
          this.errMsg = err.error.msg;
          console.log(this.errMsg);

          info.revert();
        },
      });
  }

  azurirajElemente() {
    this.elementiIzabranogObjekta = this.izabranObjekat.elementi;
  }

  generisiRezervacije() {
    console.log(this.izabranObjekat, this.izabranElementObjekta);

    this.tekuceRezervacije = [];

    this.sveRezervacijeObjekataZaposlenog.forEach((rez) => {
      if (
        rez.objekat_id._id === this.izabranObjekat._id &&
        rez.element_id._id === this.izabranElementObjekta._id
      ) {
        this.tekuceRezervacije.push(rez);
      }
    });

    console.log(this.tekuceRezervacije);

    this.calendarOptions.events = this.tekuceRezervacije
      .filter((r) => r.status !== 'otkazan')
      .map((r) => {
        const eventObj = {
          id: r._id,
          title: `Zauzeto (${r.sport})`,
          start: `${r.datum}T${r.termin_od < 10 ? '0' : ''}${r.termin_od}:00:00`,
          end: `${r.datum}T${r.termin_do < 10 ? '0' : ''}${r.termin_do}:00:00`,
          backgroundColor: '#f8d7da', // Crvena boja za zauzeto
          textColor: '#721c24',
          borderColor: '#f5c6cb',
        };

        return eventObj;
      });
  }

  //   azurirajKalendarZaSelektovaniTeren() {
  //   const aktivniEl = this.selektovanObjekat.detalji_objekta.elementi[this.trenutniIndeks];

  //   this.rezervacijaService.dohvSveZaElement(aktivniEl._id).subscribe({
  //     next: (r) => {
  //       this.rezervacijeZaElemente = r as Rezervacija[];
  //       // console.log(this.rezervacijeZaElemente);

  //       this.calendarOptions.events = this.rezervacijeZaElemente
  //         .filter((r) => r.status !== 'otkazan')
  //         .map((r) => {
  //           const eventObj = {
  //             title: `Zauzeto (${r.sport})`,
  //             start: `${r.datum}T${r.termin_od < 10 ? '0' : ''}${r.termin_od}:00:00`,
  //             end: `${r.datum}T${r.termin_do < 10 ? '0' : ''}${r.termin_do}:00:00`,
  //             backgroundColor: '#f8d7da',
  //             textColor: '#721c24',
  //             borderColor: '#f5c6cb',
  //           };

  //           // console.log(eventObj);

  //           return eventObj;
  //         });
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }
}
