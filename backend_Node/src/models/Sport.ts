import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Sport = new Schema({
  naziv: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("Sport", Sport, "sportovi");
