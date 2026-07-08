export class Oglas {
  _id: string = '';
  sportista_id: string = '';
  sport: string = '';
  grad: string = '';
  datum: string = '';
  termin_od: number = 0;
  termin_do: number = 0;
  potrebno_igraca: number = 0;
  prijavljeni_sportisti_ids: string[] = [];
  prihvaceni_sportisti_ids: string[] = [];
  status: string = '';
}
