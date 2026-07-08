import { SportskiObjekat } from './SportskiObjekat';

export class PromocijaSaObjektom {
  _id: string = '';
  naziv: string = '';
  objekat_id: SportskiObjekat = new SportskiObjekat();
  sport: string = '';
  datum_od: string = '';
  datum_do: string = '';
  popust: number = 0;
  vrsta_popusta: string = '';
}
