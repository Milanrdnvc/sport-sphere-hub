import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Element = new Schema({
  naziv: {
    type: String,
    required: true,
  },
  tip: {
    type: String,
    required: true,
    enum: ["otvoreni_teren", "zatvorena_hala", "dvorana"],
  },
  podrzani_sportovi: {
    type: [String],
    required: true,
  },
  kapacitet: {
    type: Number,
    required: true,
  },
  opis_opreme: {
    type: String,
  },
});

const SportskiObjekat = new Schema({
  naziv: {
    type: String,
    required: true,
  },
  grad: {
    type: String,
  },
  adresa: {
    type: String,
    required: true,
  },
  maticni_broj: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{8}$/,
  },
  pib: {
    type: String,
    required: true,
    unique: true,
    match: /^[1-9]\d{8}$/,
  },
  vrste_sportova: {
    type: [String],
  },
  radno_vreme_od: {
    type: String,
  },
  radno_vreme_do: {
    type: String,
  },
  broj_dozvoljenih_kazni: {
    type: Number,
  },
  galerija: {
    type: [String],
    required: true,
    default: [],
  },
  lat: {
    type: Number,
    required: true,
    default: 44.7866,
  },
  lon: {
    type: Number,
    required: true,
    default: 20.4489,
  },
  duzi_opis: {
    type: String,
  },
  cenovnik_po_satu: {
    type: Number,
  },
  elementi: {
    type: [Element],
    required: true,
    default: [],
  },
  status: {
    type: String,
    required: true,
    enum: ["na_cekanju", "prihvacen", "odbijen"],
    default: "na_cekanju",
  },
});

export default mongoose.model(
  "SportskiObjekat",
  SportskiObjekat,
  "sportskiObjekti",
);
