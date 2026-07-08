export class TerminiPoSportu {
  _id: string = '';
  brojTermina: number = -1;
}

export class AktivnostiPoMesecima {
  _id: string = '';
  brojAktivnosti: number = -1;
}

export class PotrosnjaOpreme {
  _id: string = '';
  ukupnoPotroseno: number = -1;
}

export class Statistika {
  terminiPoSportu: TerminiPoSportu[] = [];
  aktivnostiPoMesecima: AktivnostiPoMesecima[] = [];
  potrosnjaOpreme: PotrosnjaOpreme[] = [];
}
