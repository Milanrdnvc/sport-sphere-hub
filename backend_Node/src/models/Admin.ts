import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Admin = new Schema({
  kor_ime: {
    type: String,
    required: true,
    unique: true,
  },
  lozinka: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Admin", Admin, "admini");
