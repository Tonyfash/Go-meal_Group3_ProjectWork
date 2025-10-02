const mongoose = require("mongoose");

const kitchenSchema = new mongoose.Schema(
  {
    kitchenName: {
      type: String,
      required: true,
      unique: true,
    },
    kitchenLogo: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

const Kitchen = mongoose.model("Kitchen", kitchenSchema);

module.exports = Kitchen;
