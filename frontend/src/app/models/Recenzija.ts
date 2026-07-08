import { Korisnik } from './Korisnik';

export class Recenzija {
  _id: string = '';
  sportista_id: Korisnik = new Korisnik();
  objekat_id: string = '';
  reakcija: string = '';
  komentar: string = '';
  datum_objave: string = '';
}
