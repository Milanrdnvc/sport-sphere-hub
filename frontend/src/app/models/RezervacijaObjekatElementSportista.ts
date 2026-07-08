import { Korisnik } from './Korisnik';
import { SportskiObjekat } from './SportskiObjekat';
import { Element } from './Element';

export class RezervacijaObjekatElementSportista {
  _id: string = '';
  sportista_id: Korisnik = new Korisnik();
  objekat_id: SportskiObjekat = new SportskiObjekat();
  element_id: Element = new Element();
  trener_id: string = '';
  sport: string = '';
  datum: string = '';
  status: string = '';
  termin_od: number = -1;
  termin_do: number = -1;
  tip: string = '';
}
