import { Korisnik } from './Korisnik';

export class OglasSaSportistima {
  _id: string = '';
  sportista_id: Korisnik = new Korisnik();
  sport: string = '';
  grad: string = '';
  datum: string = '';
  termin_od: number = 0;
  termin_do: number = 0;
  potrebno_igraca: number = 0;
  prijavljeni_sportisti_ids: Korisnik[] = [];
  prihvaceni_sportisti_ids: Korisnik[] = [];
  status: string = '';
}
