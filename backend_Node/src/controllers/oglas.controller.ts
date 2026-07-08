import * as express from "express";
import Oglas from "../models/Oglas";

function validanDatum(datumStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datumStr)) return false;

  const [godina, mesec, dan] = datumStr.split("-").map(Number);

  const d = new Date(godina, mesec - 1, dan);

  return (
    d.getFullYear() === godina &&
    d.getMonth() === mesec - 1 &&
    d.getDate() === dan
  );
}

export class OglasController {
  dohvSve = async (req: express.Request, res: express.Response) => {
    try {
      const oglasi = await Oglas.find();

      return res.json(oglasi);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  dohvSveSaKorisnicima = async (
    req: express.Request,
    res: express.Response,
  ) => {
    try {
      const oglasi = await Oglas.find().populate(
        "sportista_id prijavljeni_sportisti_ids prihvaceni_sportisti_ids",
      );

      return res.json(oglasi);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  kreiraj = async (req: express.Request, res: express.Response) => {
    try {
      const {
        sportista_id,
        sport,
        grad,
        datum,
        termin_od,
        termin_do,
        potrebno_igraca,
      } = req.body;

      if (termin_od < 0 || termin_od > 23 || termin_do < 0 || termin_do > 23) {
        return res.status(400).json({
          msg: "Greska! Vreme mora biti u formatu od 00 do 23.",
        });
      }

      if (!validanDatum(datum)) {
        return res.status(400).json({
          msg: "Greska! Nevalidan datum.",
        });
      }

      if (Number(termin_od) >= Number(termin_do)) {
        return res.status(400).json({
          msg: "Greska! Vreme zavrsetka termina mora biti vece od vremena pocetka.",
        });
      }

      const selektovaniDatum = new Date(datum);
      selektovaniDatum.setHours(0, 0, 0, 0);
      const danas = new Date();
      danas.setHours(0, 0, 0, 0);

      if (selektovaniDatum < danas) {
        return res.status(400).json({
          msg: "Greska! Datum ne moze biti u proslosti.",
        });
      }

      if (potrebno_igraca <= 0) {
        return res.status(400).json({
          msg: "Greska! Broj nedostajucih igraca mora biti veci od 0.",
        });
      }

      const oglas = new Oglas({
        sportista_id,
        sport,
        grad,
        datum,
        termin_od,
        termin_do,
        potrebno_igraca,
      });

      await oglas.save();

      return res.json({ msg: "Oglas uspesno kreiran." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  pridruzi = async (req: express.Request, res: express.Response) => {
    try {
      const { oglas_id, sportista_id } = req.body;

      const azuriranOglas = await Oglas.findOneAndUpdate(
        { _id: oglas_id },
        {
          $addToSet: {
            prijavljeni_sportisti_ids: sportista_id,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!azuriranOglas) {
        return res.status(404).json({ msg: "Greska! Oglas ne postoji." });
      } else {
        return res.json({ msg: "Oglas uspesno azuriran." });
      }
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  odobri = async (req: express.Request, res: express.Response) => {
    try {
      const { oglas_id, vlasnik_id, sportista_id } = req.body;

      const azuriranOglas = await Oglas.findOneAndUpdate(
        {
          _id: oglas_id,
          sportista_id: vlasnik_id,
          prijavljeni_sportisti_ids: sportista_id,
        },
        {
          $pull: { prijavljeni_sportisti_ids: sportista_id },
          $addToSet: { prihvaceni_sportisti_ids: sportista_id },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!azuriranOglas) {
        return res.status(404).json({
          msg: "Greska! Oglas ne postoji ili nemate pravo da ga menjate.",
        });
      }

      if (
        azuriranOglas.prihvaceni_sportisti_ids.length >=
        azuriranOglas.potrebno_igraca
      ) {
        azuriranOglas.status = "zatvoren";
        await azuriranOglas.save();
      }

      return res.json({ msg: "Oglas uspesno azuriran." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  odbij = async (req: express.Request, res: express.Response) => {
    try {
      const { oglas_id, vlasnik_id, sportista_id } = req.body;

      const azuriranOglas = await Oglas.findOneAndUpdate(
        { _id: oglas_id, sportista_id: vlasnik_id },
        {
          $pull: { prijavljeni_sportisti_ids: sportista_id },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!azuriranOglas) {
        return res.status(404).json({ msg: "Greska! Oglas ne postoji." });
      }

      return res.json({ msg: "Oglas uspesno azuriran." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  zatvori = async (req: express.Request, res: express.Response) => {
    try {
      const { oglas_id, sportista_id } = req.body;

      const azuriranOglas = await Oglas.findOneAndUpdate(
        { _id: oglas_id, sportista_id },
        {
          $set: {
            status: "zatvoren",
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!azuriranOglas) {
        return res.status(404).json({
          msg: "Greska! Oglas ne postoji ili nemate pravo da ga menjate.",
        });
      }

      return res.json({ msg: "Oglas uspesno azuriran." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };
}
