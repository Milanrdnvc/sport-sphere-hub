import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Stavka = new Schema(
  {
    artikal_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Oprema",
    },
    naziv: {
      type: String,
      required: true,
    },
    cena_u_trenutku_kupovine: {
      type: Number,
      required: true,
    },
    kolicina: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const Narudzbina = new Schema(
  {
    sportista_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    objekat_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    stavke: {
      type: [Stavka],
      required: true,
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ["naruceno", "prihvaceno", "preuzeto", "otkazano"],
      default: "naruceno",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Narudzbina", Narudzbina, "narudzbine");
