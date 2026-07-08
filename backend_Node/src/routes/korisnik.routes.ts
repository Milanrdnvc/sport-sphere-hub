import express from "express";
import { KorisnikController } from "../controllers/korisnik.controller";
import upload from "../config/upload";

const korisnikRouter = express.Router();

korisnikRouter
  .route("/register")
  .post((req, res) => new KorisnikController().register(req, res));

korisnikRouter
  .route("/login")
  .post((req, res) => new KorisnikController().login(req, res));

korisnikRouter
  .route("/adminLogin")
  .post((req, res) => new KorisnikController().adminLogin(req, res));

korisnikRouter.post("/uploadImg", upload.single("pfp"), (req, res) =>
  new KorisnikController().uploadImg(req, res),
);

korisnikRouter
  .route("/azurirajProfil")
  .post((req, res) => new KorisnikController().azurirajProfil(req, res));

korisnikRouter
  .route("/dohvSve")
  .get((req, res) => new KorisnikController().dohvSve(req, res));

korisnikRouter
  .route("/resetujPfp")
  .post((req, res) => new KorisnikController().resetujPfp(req, res));

korisnikRouter
  .route("/obrisiNalog")
  .post((req, res) => new KorisnikController().obrisiNalog(req, res));

korisnikRouter
  .route("/odobriNalog")
  .post((req, res) => new KorisnikController().odobriNalog(req, res));

korisnikRouter
  .route("/odbijNalog")
  .post((req, res) => new KorisnikController().odbijNalog(req, res));

korisnikRouter
  .route("/zaboravljenaLozinka")
  .post((req, res) => new KorisnikController().zaboravljenaLozinka(req, res));

korisnikRouter
  .route("/resetujLozinku")
  .post((req, res) => new KorisnikController().resetujLozinku(req, res));

export default korisnikRouter;
