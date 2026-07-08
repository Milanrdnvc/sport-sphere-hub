import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Promocija = new Schema({
  naziv: {
    type: String,
    required: true,
  },
  objekat_id: {
    type: Schema.Types.ObjectId,
    ref: "SportskiObjekat",
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  datum_od: {
    type: String,
    required: true,
  },
  datum_do: {
    type: String,
    required: true,
  },
  popust: {
    type: Number,
    required: true,
  },
  vrsta_popusta: {
    type: String,
    required: true,
    enum: ["fiksan", "procenat"],
  },
});

export default mongoose.model("Promocija", Promocija, "promocije");
