import express from "express";
import { OpremaController } from "../controllers/oprema.controller";
import upload from "../config/upload";

const opremaRouter = express.Router();

opremaRouter
  .route("/dohvSve")
  .get((req, res) => new OpremaController().dohvSve(req, res));

opremaRouter.post(
  "/uploadSlikaOpreme",
  upload.single("slikaOpreme"),
  (req, res) => new OpremaController().uploadSlikaOpreme(req, res),
);

opremaRouter
  .route("/kreirajNovu")
  .post((req, res) => new OpremaController().kreirajNovu(req, res));

opremaRouter
  .route("/azurirajPostojecu")
  .post((req, res) => new OpremaController().azurirajPostojecu(req, res));

export default opremaRouter;
