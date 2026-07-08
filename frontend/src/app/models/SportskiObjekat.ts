import { Element } from './Element';

export class SportskiObjekat {
  _id: string = '';
  naziv: string = '';
  grad: string = '';
  adresa: string = '';
  vrste_sportova: string[] = [];
  radno_vreme_od: string = '';
  radno_vreme_do: string = '';
  broj_dozvoljenih_kazni: number = -1;
  galerija: string[] = [];
  status: string = '';
  cenovnik_po_satu: number = -1;
  elementi: Element[] = [];
  duzi_opis: string = '';
  maticni_broj: string = '';
  pib: string = '';
  lat: number = -1;
  lon: number = -1;
}
