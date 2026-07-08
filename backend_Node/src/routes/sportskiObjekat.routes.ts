import express from "express";
import { SportskiObjekatController } from "../controllers/sportskiObjekat.controller";
import upload from "../config/upload";

const sportskiObjekatRouter = express.Router();

sportskiObjekatRouter
  .route("/dohvSve")
  .get((req, res) => new SportskiObjekatController().dohvSve(req, res));

sportskiObjekatRouter
  .route("/dohvSveAktivne")
  .post((req, res) => new SportskiObjekatController().dohvSveAktivne(req, res));

sportskiObjekatRouter
  .route("/kreirajNovi")
  .post((req, res) => new SportskiObjekatController().kreirajNovi(req, res));

sportskiObjekatRouter
  .route("/azuriraj")
  .post((req, res) =>
    new SportskiObjekatController().azurirajPostojeci(req, res),
  );

sportskiObjekatRouter.post(
  "/uploadGalerija",
  upload.array("galerija", 10),
  (req, res) => new SportskiObjekatController().uploadGalerija(req, res),
);

sportskiObjekatRouter
  .route("/odobriObjekat")
  .post((req, res) => new SportskiObjekatController().odobriObjekat(req, res));

sportskiObjekatRouter
  .route("/odbijObjekat")
  .post((req, res) => new SportskiObjekatController().odbijObjekat(req, res));

export default sportskiObjekatRouter;
