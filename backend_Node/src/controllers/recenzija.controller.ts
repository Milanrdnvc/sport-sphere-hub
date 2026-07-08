import * as express from "express";
import Rezervacija from "../models/Rezervacija";
import Recenzija from "../models/Recenzija";

export class RecenzijaController {
  dohvZaObjekat = async (req: express.Request, res: express.Response) => {
    try {
      const { objekat_id } = req.body;

      const sveRecenzijeZaObjekat = await Recenzija.find({
        objekat_id,
      }).populate("sportista_id");

      return res.json(sveRecenzijeZaObjekat);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  ostaviRecenziju = async (req: express.Request, res: express.Response) => {
    try {
      const { sportista_id, objekat_id, reakcija, komentar } = req.body;

      const brojPotvrdjenihRezervacija = await Rezervacija.countDocuments({
        sportista_id,
        objekat_id,
        status: "dolazak",
      });

      if (brojPotvrdjenihRezervacija === 0) {
        return res.status(400).json({
          msg: "Greska! Nemate pravo da ocenite objekat u kojem niste imali nijedan potvrdjen termin.",
        });
      }

      const brojPostojecihRecenzija = await Recenzija.countDocuments({
        sportista_id,
        objekat_id,
      });

      if (brojPostojecihRecenzija >= brojPotvrdjenihRezervacija) {
        return res.status(400).json({
          msg: "Greska! Iskoristili ste maksimalan broj recenzija za ovaj objekat na osnovu vasih poseta.",
        });
      }

      const novaRecenzija = new Recenzija({
        sportista_id,
        objekat_id,
        reakcija,
        komentar,
        datum_objave: new Date(),
      });

      await novaRecenzija.save();

      return res.json({
        msg: "Recenzija uspeno kreirana.",
      });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };
}
