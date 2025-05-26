const mongoose = require("mongoose");

const lessonPreferenceSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: false }, 
  preferences: [
    {
      lesson: { type: String, required: true },
      probability: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("LessonPreference", lessonPreferenceSchema);
