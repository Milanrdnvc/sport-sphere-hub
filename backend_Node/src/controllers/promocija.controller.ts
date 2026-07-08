import * as express from "express";
import Promocija from "../models/Promocija";

const validirajPromociju = (promocija: any, proveraPocetnogDatuma: boolean) => {
  const formatDatumaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (
    !formatDatumaRegex.test(promocija.datum_od) ||
    !formatDatumaRegex.test(promocija.datum_do)
  ) {
    return "Greska! Datum mora biti u formatu YYYY-MM-DD (npr. 2026-06-20).";
  }

  const datumOd = new Date(promocija.datum_od);
  const datumDo = new Date(promocija.datum_do);
  const sada = new Date();
  sada.setHours(0, 0, 0, 0);

  if (datumDo < datumOd) {
    return "Greska! Datum zavrsetka ne moze biti pre datuma pocetka.";
  }

  if (proveraPocetnogDatuma && datumOd < sada) {
    return "Greska! Datum pocetka nove promocije ne moze biti u proslosti.";
  }

  const popustNum = Number(promocija.popust);
  if (promocija.vrsta_popusta === "procenat") {
    if (popustNum <= 0 || popustNum > 100) {
      return "Greska! Procentualni popust mora biti vrednost izmedju 1 i 100.";
    }
  } else if (promocija.vrsta_popusta === "fiksan") {
    if (popustNum <= 0) {
      return "Greska! Fiksni popust mora biti veci od nule.";
    }
  }

  return null;
};

export class PromocijaController {
  dohvSveZaZaposlenog = async (req: express.Request, res: express.Response) => {
    try {
      const zaposleniInfo = req.body.zaposleni_info;

      const svePromocije = await Promocija.find({
        objekat_id: { $in: zaposleniInfo.objekat_ids },
      });

      return res.json(svePromocije);
    } catch (error) {
      return res.status(500).json({ msg: "Greska! Interna serverska greska." });
    }
  };

  kreirajNovu = async (req: express.Request, res: express.Response) => {
    try {
      const {
        naziv,
        objekat_id,
        sport,
        datum_od,
        datum_do,
        popust,
        vrsta_popusta,
      } = req.body;

      const greska = validirajPromociju(req.body, true);
      if (greska) {
        return res.status(400).json({ msg: greska });
      }

      const novaPromocija = new Promocija({
        naziv,
        objekat_id,
        sport,
        datum_od,
        datum_do,
        popust,
        vrsta_popusta,
      });

      await novaPromocija.save();

      return res.json({ msg: "Promocija uspesno kreirana." });
    } catch (error) {
      return res.status(500).json({ msg: "Greska! Interna serverska greska." });
    }
  };

  azurirajPostojecu = async (req: express.Request, res: express.Response) => {
    try {
      const { _id, naziv, sport, datum_od, datum_do, popust, vrsta_popusta } =
        req.body;

      const greska = validirajPromociju(req.body, false);
      if (greska) {
        return res.status(400).json({ msg: greska });
      }

      const azuriranaPromocija = await Promocija.findOneAndUpdate(
        {
          _id,
        },
        {
          $set: {
            naziv,
            sport,
            datum_od,
            datum_do,
            popust,
            vrsta_popusta,
          },
        },
        { new: true },
      );

      if (!azuriranaPromocija) {
        return res.status(404).json({ msg: "Greska! Nepostojeca promocija." });
      }

      return res.json({ msg: "Promocija uspesno azurirana." });
    } catch (error) {
      return res.status(500).json({ msg: "Greska! Interna serverska greska." });
    }
  };

  dohvDo3Aktuelne = async (req: express.Request, res: express.Response) => {
    try {
      const danas = new Date().toISOString().split("T")[0];

      const aktuelnePromocije = await Promocija.find({
        datum_od: { $lte: danas },
        datum_do: { $gte: danas },
      })
        .populate("objekat_id")
        .limit(3);

      if (!aktuelnePromocije)
        return res
          .status(404)
          .json({ msg: "Greska! Nema aktuelnih promocija za ovaj period." });

      return res.json(aktuelnePromocije);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };
}
