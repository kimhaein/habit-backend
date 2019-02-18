const mongoose = require("mongoose");
const { Schema } = mongoose;

const HabitLog = new Schema(
  {
    habit_id: { type: Schema.Types.ObjectId, required: true },
    habit_date: { type: Date },
    habit_yn: { type: String, default: "N" }
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  }
);

module.exports = mongoose.model("HabitLog", HabitLog);
