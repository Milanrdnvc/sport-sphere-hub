import { Stavka } from './Stavka';

export class Narudzbina {
  _id: string = '';
  sportista_id: string = '';
  objekat_id: string = '';
  stavke: Stavka[] = [];
  status: string = '';
}
