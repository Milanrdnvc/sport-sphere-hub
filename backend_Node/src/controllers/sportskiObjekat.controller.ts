import * as express from "express";
import SportskiObjekat from "../models/SportskiObjekat";
import Recenzija from "../models/Recenzija";
import Rezervacija from "../models/Rezervacija";
import Korisnik from "../models/Korisnik";

const validirajSportskiObjekat = (obj: any) => {
  if (
    !obj.grad ||
    !obj.duzi_opis ||
    !obj.vrste_sportova ||
    obj.vrste_sportova.length === 0
  ) {
    return "Greska! Sva polja moraju biti ispravno popunjena.";
  }

  const radnoOd = parseInt(obj.radno_vreme_od);
  const radnoDo = parseInt(obj.radno_vreme_do);
  const kazne = Number(obj.broj_dozvoljenih_kazni);
  const cena = Number(obj.cenovnik_po_satu);
  const latituda = Number(obj.lat);
  const longituda = Number(obj.lon);

  if (
    isNaN(radnoOd) ||
    isNaN(radnoDo) ||
    isNaN(kazne) ||
    isNaN(cena) ||
    isNaN(latituda) ||
    isNaN(longituda)
  ) {
    return "Greska! Sva polja moraju biti ispravno popunjena.";
  }

  if (radnoOd < 0 || radnoOd > 23 || radnoDo < 0 || radnoDo > 23)
    return "Greska! Vreme mora biti između 00 i 23 casa.";
  if (radnoOd >= radnoDo)
    return "Greska! Vreme zavrsetka mora biti vece od vremena pocetka.";
  if (kazne < 0) return "Greska! Broj dozvoljenih kazni ne sme biti negativan.";
  if (cena <= 0) return "Greska! Cena po satu mora biti veca od nule.";

  const lokalniNazivi = new Set();

  for (const el of obj.elementi) {
    if (el.kapacitet <= 0)
      return "Greska! Kapacitet elementa mora biti veci od 0.";

    const stdNaziv = el.naziv.trim().toLowerCase();
    if (lokalniNazivi.has(stdNaziv)) {
      return "Elementi moraju imati unikatne nazive.";
    }
    lokalniNazivi.add(stdNaziv);

    for (const sport of el.podrzani_sportovi) {
      if (!obj.vrste_sportova.includes(sport)) {
        return "Greska! Element sadrzi sport koji nije dodat na nivou objekta.";
      }
    }
  }

  const imaValidanTeren = obj.elementi.some(
    (el: any) => el.tip === "otvoreni_teren" && el.kapacitet >= 4,
  );
  if (!imaValidanTeren) {
    return "Greska! Mora postojati barem jedan otvoreni teren sa kapacitetom 4 ili vise.";
  }

  return null;
};

export class SportskiObjekatController {
  dohvSveAktivne = async (req: express.Request, res: express.Response) => {
    try {
      let sportskiObjektiSaRecenzijama = await SportskiObjekat.aggregate([
        { $match: { status: "prihvacen" } },
        {
          $lookup: {
            from: "recenzije",
            localField: "_id",
            foreignField: "objekat_id",
            as: "sve_recenzije",
          },
        },
        {
          $addFields: {
            broj_lajkova: {
              $size: {
                $filter: {
                  input: "$sve_recenzije",
                  as: "r",
                  cond: { $eq: ["$$r.reakcija", "like"] },
                },
              },
            },
            broj_dislajkova: {
              $size: {
                $filter: {
                  input: "$sve_recenzije",
                  as: "r",
                  cond: { $eq: ["$$r.reakcija", "dislike"] },
                },
              },
            },
          },
        },
        { $sort: { broj_lajkova: -1 } },
        {
          $project: {
            broj_lajkova: 1,
            broj_dislajkova: 1,
            detalji_objekta: {
              _id: "$_id",
              naziv: "$naziv",
              grad: "$grad",
              adresa: "$adresa",
              vrste_sportova: "$vrste_sportova",
              radno_vreme_od: "$radno_vreme_od",
              radno_vreme_do: "$radno_vreme_do",
              broj_dozvoljenih_kazni: "$broj_dozvoljenih_kazni",
              galerija: "$galerija",
              status: "$status",
              cenovnik_po_satu: "$cenovnik_po_satu",
              elementi: "$elementi",
              duzi_opis: "$duzi_opis",
              lat: "$lat",
              lon: "$lon",
              maticni_broj: "$maticni_broj",
              pib: "$pib",
            },
          },
        },
      ]);

      const { slobodnoDanas } = req.body;

      if (slobodnoDanas) {
        const danas = new Date().toLocaleDateString("en-CA");

        const danasnjeRezervacije = await Rezervacija.find({
          datum: danas,
          status: { $in: ["na_cekanju", "dolazak", "nedolazak"] },
        });

        const zauzetiSatiPoElementu = new Map();

        danasnjeRezervacije.forEach((r) => {
          const elementId = r.element_id.toString();
          const odSat = r.termin_od;
          const doSat = r.termin_do;

          if (!zauzetiSatiPoElementu.has(elementId)) {
            zauzetiSatiPoElementu.set(elementId, new Set());
          }

          const satiSet = zauzetiSatiPoElementu.get(elementId);
          for (let h = odSat; h < doSat; h++) {
            satiSet.add(h);
          }
        });

        sportskiObjektiSaRecenzijama = sportskiObjektiSaRecenzijama.filter(
          (obj) => {
            const detalji = obj.detalji_objekta;

            if (detalji.radno_vreme_od === "" || detalji.radno_vreme_do === "")
              return false;

            const radnoOd = parseInt(detalji.radno_vreme_od.split(":")[0]);
            const radnoDo = parseInt(detalji.radno_vreme_do.split(":")[0]);

            const sada = new Date();
            let sledeciPunSat = new Date().getHours();

            if (sada.getMinutes() > 0) {
              sledeciPunSat += 1;
            }

            const stvarniPocetak = Math.max(radnoOd, sledeciPunSat);

            detalji.elementi = detalji.elementi.filter((el: any) => {
              const elId = el._id.toString();
              const zauzetiSati = zauzetiSatiPoElementu.get(elId) || new Set();

              for (let h = stvarniPocetak; h < radnoDo; h++) {
                if (!zauzetiSati.has(h)) {
                  return true;
                }
              }
              return false;
            });

            return detalji.elementi.length > 0;
          },
        );
      }

      return res.status(200).json(sportskiObjektiSaRecenzijama);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  uploadGalerija = async (req: express.Request, res: express.Response) => {
    try {
      const { objekat_id } = req.body;

      const fajlovi = req.files as Express.Multer.File[];
      const imenaSlika = fajlovi.map((f) => `/slike/${f.filename}`);

      const azuriranObjekat = await SportskiObjekat.findByIdAndUpdate(
        objekat_id,
        {
          $push: { galerija: { $each: imenaSlika } },
        },
        { new: true },
      );

      if (!azuriranObjekat) {
        return res
          .status(404)
          .json({ msg: "Greska! Sportski objekat ne postoji." });
      }

      return res.json({
        msg: "Galerija uspesno azurirana.",
      });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  kreirajNovi = async (req: express.Request, res: express.Response) => {
    try {
      let {
        naziv,
        grad,
        adresa,
        maticni_broj,
        pib,
        vrste_sportova,
        radno_vreme_od,
        radno_vreme_do,
        broj_dozvoljenih_kazni,
        cenovnik_po_satu,
        duzi_opis,
        elementi,
        zaposleniId,
        lat,
        lon,
      } = req.body;

      const greska = validirajSportskiObjekat(req.body);

      if (greska) {
        return res.status(400).json({ msg: greska });
      }

      elementi = elementi.map((el: any) => {
        delete el._id;

        return el;
      });

      const noviObjekat = new SportskiObjekat({
        naziv,
        grad,
        adresa,
        maticni_broj,
        pib,
        vrste_sportova,
        radno_vreme_od,
        radno_vreme_do,
        broj_dozvoljenih_kazni,
        cenovnik_po_satu,
        duzi_opis,
        elementi,
        lat,
        lon,
        status: "na_cekanju",
      });

      await noviObjekat.save();

      await Korisnik.findByIdAndUpdate(zaposleniId, {
        $push: { "zaposleni_info.objekat_ids": noviObjekat._id },
      });

      return res.json(noviObjekat);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  azurirajPostojeci = async (req: express.Request, res: express.Response) => {
    try {
      const id = req.body._id;

      let {
        naziv,
        grad,
        adresa,
        maticni_broj,
        pib,
        vrste_sportova,
        radno_vreme_od,
        radno_vreme_do,
        broj_dozvoljenih_kazni,
        cenovnik_po_satu,
        duzi_opis,
        elementi,
        galerija,
      } = req.body;

      const greska = validirajSportskiObjekat(req.body);

      if (greska) {
        return res.status(400).json({ msg: greska });
      }

      if (elementi && Array.isArray(elementi)) {
        elementi = elementi.map((el: any) => {
          if (el._id === "") {
            delete el._id;
          }
          return el;
        });
      }

      const azuriranObjekat = await SportskiObjekat.findByIdAndUpdate(
        id,
        {
          naziv,
          grad,
          adresa,
          maticni_broj,
          pib,
          vrste_sportova,
          radno_vreme_od,
          radno_vreme_do,
          broj_dozvoljenih_kazni,
          cenovnik_po_satu,
          duzi_opis,
          elementi,
          galerija,
        },
        { new: true },
      );

      if (!azuriranObjekat) {
        return res.status(404).json({ msg: "Greska! Objekat nije pronadjen." });
      }

      return res.json(azuriranObjekat);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  dohvSve = async (req: express.Request, res: express.Response) => {
    try {
      const sviObjekti = await SportskiObjekat.find();
      return res.json(sviObjekti);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  odobriObjekat = async (req: express.Request, res: express.Response) => {
    try {
      const _id = req.body._id;

      await SportskiObjekat.findOneAndUpdate(
        { _id },
        { $set: { status: "prihvacen" } },
      );

      res.json({ msg: "Objekat uspesno odobren." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  odbijObjekat = async (req: express.Request, res: express.Response) => {
    try {
      const _id = req.body._id;

      await SportskiObjekat.findOneAndUpdate(
        { _id },
        { $set: { status: "odbijen" } },
      );

      res.json({ msg: "Objekat uspesno odbijen." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };
}
