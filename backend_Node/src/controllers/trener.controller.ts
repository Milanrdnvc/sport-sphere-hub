import * as express from "express";
import Trener from "../models/Trener";

export class TrenerController {
  dohvSve = async (req: express.Request, res: express.Response) => {
    try {
      const treneri = await Trener.find().populate("objekat_id");

      return res.json(treneri);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  deaktiviraj = async (req: express.Request, res: express.Response) => {
    try {
      const { _id } = req.body;

      await Trener.findOneAndUpdate(
        { _id },
        {
          $set: { aktivan: false },
        },
      );

      return res.json({ msg: "Trener uspesno deaktiviran." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  kreiraj = async (req: express.Request, res: express.Response) => {
    try {
      const {
        ime_prezime,
        specijalizacija,
        objekat_id,
        cena_po_satu,
        prosecna_ocena,
      } = req.body;

      if (cena_po_satu <= 0) {
        return res
          .status(400)
          .json({ msg: "Greska! Cena po satu mora biti veca od 0." });
      }

      if (prosecna_ocena < 1 || prosecna_ocena > 5) {
        return res
          .status(400)
          .json({ msg: "Greska! Prosecna ocena mora biti izmedju 1 i 5." });
      }

      const noviTrener = new Trener({
        ime_prezime,
        specijalizacija,
        objekat_id,
        cena_po_satu,
        prosecna_ocena,
      });

      await noviTrener.save();

      return res.json({ msg: "Trener uspeno kreiran." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };
}
