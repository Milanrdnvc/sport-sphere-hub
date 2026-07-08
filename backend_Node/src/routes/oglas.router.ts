import express from "express";
import { OglasController } from "../controllers/oglas.controller";

const oglasRouter = express.Router();

oglasRouter
  .route("/dohvSve")
  .get((req, res) => new OglasController().dohvSve(req, res));

oglasRouter
  .route("/dohvSveSaKorisnicima")
  .get((req, res) => new OglasController().dohvSveSaKorisnicima(req, res));

oglasRouter
  .route("/kreiraj")
  .post((req, res) => new OglasController().kreiraj(req, res));

oglasRouter
  .route("/pridruzi")
  .post((req, res) => new OglasController().pridruzi(req, res));

oglasRouter
  .route("/odobri")
  .post((req, res) => new OglasController().odobri(req, res));

oglasRouter
  .route("/odbij")
  .post((req, res) => new OglasController().odbij(req, res));

oglasRouter
  .route("/zatvori")
  .post((req, res) => new OglasController().zatvori(req, res));

export default oglasRouter;
