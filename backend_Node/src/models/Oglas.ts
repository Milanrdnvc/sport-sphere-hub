import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Oglas = new Schema({
  sportista_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Korisnik",
  },
  sport: {
    type: String,
    required: true,
  },
  grad: {
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
  potrebno_igraca: {
    type: Number,
    required: true,
  },
  prijavljeni_sportisti_ids: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Korisnik" }],
    required: true,
    default: [],
  },
  prihvaceni_sportisti_ids: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Korisnik" }],
    required: true,
    default: [],
  },
  status: {
    type: String,
    required: true,
    enum: ["aktivan", "zatvoren"],
    default: "aktivan",
  },
});

export default mongoose.model("Oglas", Oglas, "oglasi");
