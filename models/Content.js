const mongoose = require("mongoose");

const peerPreferenceSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: false }, 
  preferences: { type: String, required: true},
  stressLevel: { type: String, required: true},
  cognitive: { type: String, required: true},
}, { timestamps: true });

module.exports = mongoose.model("ContentPreference", peerPreferenceSchema);
