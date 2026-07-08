import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Rezervacija = new Schema({
  sportista_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Korisnik",
  },
  objekat_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "SportskiObjekat",
  },
  element_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  tip: {
    type: String,
    required: true,
    enum: ["standardna", "trening"],
  },
  trener_id: {
    type: mongoose.Types.ObjectId,
  },
  sport: {
    type: String,
    required: true,
  },
  datum: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
  termin_od: {
    type: Number,
    required: true,
  },
  termin_do: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["na_cekanju", "odobren", "otkazan", "dolazak", "nedolazak"],
    default: "na_cekanju",
  },
});

export default mongoose.model("Rezervacija", Rezervacija, "rezervacije");
