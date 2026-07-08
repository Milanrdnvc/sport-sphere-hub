import express from "express";
import { RezervacijaController } from "../controllers/rezervacija.controller";

const rezervacijaRouter = express.Router();

rezervacijaRouter
  .route("/dohvSveZaSportistu")
  .post((req, res) => new RezervacijaController().dohvSveZaSportistu(req, res));

rezervacijaRouter
  .route("/dohvSveZaZaposlenog")
  .post((req, res) =>
    new RezervacijaController().dohvSveZaZaposlenog(req, res),
  );

rezervacijaRouter
  .route("/otkazi")
  .post((req, res) => new RezervacijaController().otkazi(req, res));

rezervacijaRouter
  .route("/potvrdi")
  .post((req, res) => new RezervacijaController().potvrdi(req, res));

rezervacijaRouter
  .route("/odjavi")
  .post((req, res) => new RezervacijaController().odjavi(req, res));

rezervacijaRouter
  .route("/odobri")
  .post((req, res) => new RezervacijaController().odobri(req, res));

rezervacijaRouter
  .route("/dohvSveZaElement")
  .post((req, res) => new RezervacijaController().dohvSveZaElement(req, res));

rezervacijaRouter
  .route("/nova")
  .post((req, res) => new RezervacijaController().nova(req, res));

rezervacijaRouter
  .route("/generisiIzvestajPopunjenost")
  .post((req, res) =>
    new RezervacijaController().generisiIzvestajPopunjenost(req, res),
  );

rezervacijaRouter
  .route("/pomeriRezervaciju")
  .post((req, res) => new RezervacijaController().pomeriRezervaciju(req, res));

export default rezervacijaRouter;
