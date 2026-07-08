import express from "express";
import { NarudzbinaController } from "../controllers/narudzbina.controller";

const narudzbinaRouter = express.Router();

narudzbinaRouter
  .route("/dohvSve")
  .get((req, res) => new NarudzbinaController().dohvSve(req, res));

narudzbinaRouter
  .route("/naruci")
  .post((req, res) => new NarudzbinaController().naruci(req, res));

narudzbinaRouter
  .route("/otkazi")
  .post((req, res) => new NarudzbinaController().otkazi(req, res));

narudzbinaRouter
  .route("/prihvati")
  .post((req, res) => new NarudzbinaController().prihvati(req, res));

narudzbinaRouter
  .route("/preuzeto")
  .post((req, res) => new NarudzbinaController().preuzeto(req, res));

narudzbinaRouter
  .route("/generisiIzvestajPrometOpreme")
  .post((req, res) =>
    new NarudzbinaController().generisiIzvestajPrometOpreme(req, res),
  );

export default narudzbinaRouter;
