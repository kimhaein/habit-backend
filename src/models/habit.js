const mongoose = require("mongoose");
const moment = require("moment");
const { Schema } = mongoose;

const Habit = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    color: { type: String, default: "#000" },
    start_at: { type: String, required: true },
    end_at: { type: String, required: true },
    push_time: String,
    reward_img: { type: String, default: "gift" },
    reward_text: String,
    memo: String,
    created_at: {
      type: Date,
      default: moment(new Date())
    },
    updated_at: Date
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  }
);

module.exports = mongoose.model("Habit", Habit);
