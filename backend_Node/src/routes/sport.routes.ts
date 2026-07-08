import express from "express";
import { SportController } from "../controllers/sport.controller";

const sportRouter = express.Router();

sportRouter
  .route("/dohvSve")
  .get((req, res) => new SportController().dohvSve(req, res));

sportRouter
  .route("/kreiraj")
  .post((req, res) => new SportController().kreiraj(req, res));

sportRouter
  .route("/obrisi")
  .post((req, res) => new SportController().obrisi(req, res));

export default sportRouter;
