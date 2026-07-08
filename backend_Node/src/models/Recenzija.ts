import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Recenzija = new Schema({
  sportista_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Korisnik",
  },
  objekat_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  reakcija: {
    type: String,
    required: true,
    enum: ["like", "dislike"],
  },
  komentar: {
    type: String,
  },
  datum_objave: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Recenzija", Recenzija, "recenzije");
