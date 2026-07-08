import express from "express";
import { PromocijaController } from "../controllers/promocija.controller";

const promocijaRouter = express.Router();

promocijaRouter
  .route("/dohvSveZaZaposlenog")
  .post((req, res) => new PromocijaController().dohvSveZaZaposlenog(req, res));

promocijaRouter
  .route("/kreirajNovu")
  .post((req, res) => new PromocijaController().kreirajNovu(req, res));

promocijaRouter
  .route("/azurirajPostojecu")
  .post((req, res) => new PromocijaController().azurirajPostojecu(req, res));

promocijaRouter
  .route("/dohvDo3Aktuelne")
  .get((req, res) => new PromocijaController().dohvDo3Aktuelne(req, res));

export default promocijaRouter;
