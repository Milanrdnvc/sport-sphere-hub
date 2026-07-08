import * as express from "express";
import Oprema from "../models/Oprema";

const validirajOpremu = (oprema: any) => {
  if (oprema.Cena <= 0) {
    return "Greska! Cena opreme mora biti veca od nule.";
  }

  if (oprema.zalihe < 0) {
    return "Greska! Kolicina na zalihama ne moze biti negativna.";
  }

  return null;
};

export class OpremaController {
  dohvSve = async (req: express.Request, res: express.Response) => {
    try {
      const oprema = await Oprema.find();

      return res.json(oprema);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  uploadSlikaOpreme = async (req: express.Request, res: express.Response) => {
    try {
      const { _id } = req.body;

      const azuriranaOprema = await Oprema.findOneAndUpdate(
        { _id },
        { $set: { slika: `/slike/${req.file?.filename}` } },
      );

      if (!azuriranaOprema) {
        return res.status(404).json({ msg: "Greska! Oprema ne postoji." });
      }

      return res.json({
        msg: "Slika opreme uspesno azurirana.",
      });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  kreirajNovu = async (req: express.Request, res: express.Response) => {
    try {
      const { objekat_id, naziv, vrsta_sporta, cena, zalihe } = req.body;

      const greska = validirajOpremu(req.body);
      if (greska) {
        return res.status(400).json({ msg: greska });
      }

      const novaOprema = new Oprema({
        objekat_id,
        naziv,
        vrsta_sporta,
        cena,
        zalihe,
      });

      await novaOprema.save();

      return res.json(novaOprema);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  azurirajPostojecu = async (req: express.Request, res: express.Response) => {
    try {
      const { _id, cena, zalihe } = req.body;

      const greska = validirajOpremu(req.body);

      if (greska) {
        return res.status(400).json({ msg: greska });
      }

      const azuriranaOprema = await Oprema.findOneAndUpdate(
        {
          _id,
        },
        {
          $set: {
            cena,
            zalihe,
          },
        },
        { new: true },
      );

      if (!azuriranaOprema) {
        return res.status(404).json({ msg: "Greska! Nepostojeca oprema." });
      }

      return res.json({ msg: "Oprema uspesno azurirana." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };
}
