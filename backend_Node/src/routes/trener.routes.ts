import express from "express";
import { TrenerController } from "../controllers/trener.controller";

const trenerRouter = express.Router();

trenerRouter
  .route("/dohvSve")
  .get((req, res) => new TrenerController().dohvSve(req, res));

trenerRouter
  .route("/deaktiviraj")
  .post((req, res) => new TrenerController().deaktiviraj(req, res));

trenerRouter
  .route("/kreiraj")
  .post((req, res) => new TrenerController().kreiraj(req, res));

export default trenerRouter;
