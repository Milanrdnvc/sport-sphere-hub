import * as express from "express";
import Sport from "../models/Sport";

export class SportController {
  dohvSve = async (req: express.Request, res: express.Response) => {
    try {
      const sportovi = await Sport.find();

      return res.json(sportovi);
    } catch (error) {
      return res.status(500).json({ msg: "Greska! Interna serverska greska." });
    }
  };

  obrisi = async (req: express.Request, res: express.Response) => {
    try {
      const { _id } = req.body;

      await Sport.findOneAndDelete({ _id });

      return res.json({ msg: "Sport uspesno obrisan." });
    } catch (error) {
      return res.status(500).json({ msg: "Greska! Interna serverska greska." });
    }
  };

  kreiraj = async (req: express.Request, res: express.Response) => {
    try {
      const { naziv } = req.body;

      const noviSport = new Sport({
        naziv,
      });

      await noviSport.save();

      return res.json({ msg: "Sport uspeno kreiran." });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ msg: "Greska! Interna serverska greska." });
    }
  };
}
