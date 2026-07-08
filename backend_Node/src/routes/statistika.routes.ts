import express from "express";
import { TrenerController } from "../controllers/trener.controller";
import { StatistikaController } from "../controllers/statistika.controller";

const statistikaRouter = express.Router();

statistikaRouter
  .route("/dohvStatistiku")
  .get((req, res) => new StatistikaController().dohvStatistiku(req, res));

export default statistikaRouter;
