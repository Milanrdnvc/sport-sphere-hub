import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Trener = new Schema({
  ime_prezime: {
    type: String,
    required: true,
  },
  specijalizacija: {
    type: String,
    required: true,
  },
  objekat_id: {
    type: mongoose.Types.ObjectId,
    ref: "SportskiObjekat",
    required: true,
  },
  cena_po_satu: {
    type: Number,
    required: true,
  },
  prosecna_ocena: {
    type: Number,
    required: true,
  },
  aktivan: {
    type: Boolean,
    required: true,
    default: true,
  },
});

export default mongoose.model("Trener", Trener, "treneri");
