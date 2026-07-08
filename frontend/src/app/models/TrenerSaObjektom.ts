import { SportskiObjekat } from './SportskiObjekat';

export class TrenerSaObjektom {
  _id: string = '';
  ime_prezime: string = '';
  specijalizacija: string = '';
  objekat_id: SportskiObjekat = new SportskiObjekat();
  cena_po_satu: string = '';
  prosecna_ocena: number = 0;
  aktivan: boolean = false;
}
