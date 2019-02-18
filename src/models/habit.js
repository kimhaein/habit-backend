const mongoose = require("mongoose");
const { Schema } = mongoose;

const Habit = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    color: { type: String, default: "#000" },
    start_at: { type: Date, required: true },
    end_at: { type: Date, required: true },
    push_time: String,
    reward_img: { type: String, default: "gift" },
    reward_text: String,
    memo: String,
    created_at: {
      type: Date,
      default: new Date()
    },
    updated_at: Date,
    achieve_rate: { type: String, default: "0" }
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  }
);

module.exports = mongoose.model("Habit", Habit);
