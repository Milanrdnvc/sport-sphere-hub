import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Trening = new Schema({
  sportista_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  trener_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  objekat_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  element_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  datum: {
    type: String,
    required: true,
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
    enum: ["zakazan", "odrzan", "otkazan"],
  },
});

export default mongoose.model("Trening", Trening, "treninzi");
