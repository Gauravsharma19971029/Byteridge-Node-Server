const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",

  },
  loginTime: { type: Date,  default: Date.now() },
  logoutTime: { type: Date },
  clientIP: { type: String, },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Audit", schema);
