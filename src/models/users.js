const mongoose = require("mongoose");
const { Schema } = mongoose;

const Users = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, trim: true },
    user_name: String,
    push: { type: Boolean, default: true },
    user_thumnail: { type: String, default: "user" },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: null },
    end: { type: Boolean, default: false }
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  }
);

module.exports = mongoose.model("Users", Users);
