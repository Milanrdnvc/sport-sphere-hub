import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Kazna = new Schema(
  {
    objekat_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    broj_nedolazaka: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false },
);

const SportistaInfo = new Schema(
  {
    kazne: {
      type: [Kazna],
      required: true,
      default: [],
    },
  },
  { _id: false },
);

const ZaposleniInfo = new Schema(
  {
    objekat_ids: {
      type: [Schema.Types.ObjectId],
      required: true,
      default: [],
    },
  },
  { _id: false },
);

const Korisnik = new Schema({
  kor_ime: {
    type: String,
    required: true,
    unique: true,
  },
  lozinka: {
    type: String,
    required: true,
  },
  tip: {
    type: String,
    required: true,
    enum: ["sportista", "zaposleni", "admin"],
  },
  ime: {
    type: String,
    required: true,
  },
  prezime: {
    type: String,
    required: true,
  },
  kontakt_telefon: {
    type: String,
    required: true,
    match: /^(\+3816\d{8}|06\d{8})$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  },
  pfp: {
    type: String,
    required: true,
    default: "/slike/1781873477962-default.png",
  },
  status: {
    type: String,
    required: true,
    default: "na_cekanju",
    enum: ["na_cekanju", "prihvacen", "odbijen"],
  },
  sportovi: {
    type: [String],
    required: true,
    default: [],
  },
  sportista_info: {
    type: SportistaInfo,
  },
  zaposleni_info: {
    type: ZaposleniInfo,
  },
  reset_token: {
    type: String,
  },
  reset_token_istice: {
    type: Date,
  },
});

export default mongoose.model("Korisnik", Korisnik, "korisnici");
