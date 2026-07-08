import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Oprema = new Schema({
  naziv: {
    type: String,
    required: true,
    unique: true,
  },
  objekat_id: {
    type: mongoose.Types.ObjectId,
    ref: "SportskiObjekat",
    required: true,
  },
  vrsta_sporta: {
    type: String,
    required: true,
  },
  cena: {
    type: Number,
    required: true,
  },
  zalihe: {
    type: Number,
    required: true,
  },
  slika: {
    type: String,
  },
});

export default mongoose.model("Oprema", Oprema, "oprema");
