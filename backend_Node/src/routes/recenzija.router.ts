import express from "express";
import { RezervacijaController } from "../controllers/rezervacija.controller";
import { RecenzijaController } from "../controllers/recenzija.controller";

const recenzijaRouter = express.Router();

recenzijaRouter
  .route("/ostaviRecenziju")
  .post((req, res) => new RecenzijaController().ostaviRecenziju(req, res));

recenzijaRouter
  .route("/dohvZaObjekat")
  .post((req, res) => new RecenzijaController().dohvZaObjekat(req, res));

export default recenzijaRouter;
