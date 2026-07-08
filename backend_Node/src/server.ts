import express, { Router } from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import korisnikRouter from "./routes/korisnik.routes";
import sportRouter from "./routes/sport.routes";
import sportskiObjekatRouter from "./routes/sportskiObjekat.routes";
import rezervacijaRouter from "./routes/rezervacija.router";
import trenerRouter from "./routes/trener.routes";
import oglasRouter from "./routes/oglas.router";
import opremaRouter from "./routes/oprema.routes";
import narudzbinaRouter from "./routes/narudzbina.routes";
import promocijaRouter from "./routes/promocija.router";
import recenzijaRouter from "./routes/recenzija.router";
import statistikaRouter from "./routes/statistika.routes";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/SportSphereHub");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});

app.use(
  "/slike",
  express.static(path.join(__dirname, "../", "./src", "slike")),
);

const router = Router();
router.use("/korisnik", korisnikRouter);
router.use("/sport", sportRouter);
router.use("/sportskiObjekat", sportskiObjekatRouter);
router.use("/rezervacija", rezervacijaRouter);
router.use("/trener", trenerRouter);
router.use("/oglas", oglasRouter);
router.use("/oprema", opremaRouter);
router.use("/narudzbina", narudzbinaRouter);
router.use("/promocija", promocijaRouter);
router.use("/recenzija", recenzijaRouter);
router.use("/statistika", statistikaRouter);
app.use("/", router);

app.listen(4000, () => console.log("Express running on port 4000!"));
