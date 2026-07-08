import { SportistaInfo } from './SportistaInfo';
import { ZaposleniInfo } from './ZaposleniInfo';

export class Korisnik {
  _id: string = '';
  kor_ime: string = '';
  lozinka: string = '';
  tip: string = '';
  ime: string = '';
  prezime: string = '';
  kontakt_telefon: string = '';
  email: string = '';
  pfp: string = '';
  status: string = '';
  sportovi: string[] = [];
  sportista_info: SportistaInfo = new SportistaInfo();
  zaposleni_info: ZaposleniInfo = new ZaposleniInfo();
}
