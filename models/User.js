const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: String, required: true },
  phoneNum: { type: String, required: true },
  Gender: { type: String, required: true },
  preferredStudyMethod: { type: String, required: true },
  dislikedLesson: { type: String, required: true },
  password: { type: String, required: true },
  
  // FIXED: Added default value for cognitivePerformance
  cognitivePerformance: { type: String, default: "Average" },
  stressProbability: { type: Number, default: 0.0 },
  stressLevel: { type: String, default: "Medium" },

  // New fields for marks and time(s)
  numberSequencesMarks: { type: [Number], default: [] },
  numberSequencesTime: { type: String, default: "0" },
  perimeterMarks: { type: [Number], default: [] },
  perimeterTime: { type: String, default: "0" },
  ratioMarks: { type: [Number], default: [] },
  ratioTime: { type: String, default: "0" },
  fractionsDecimalsMarks: { type: [Number], default: [] },
  fractionsDecimalsTime: { type: String, default: "0" },
  indicesMarks: { type: [Number], default: [] },
  indicesTime: { type: String, default: "0" },
  algebraMarks: { type: [Number], default: [] },
  algebraTime: { type: String, default: "0" },
  anglesMarks: { type: [Number], default: [] },
  anglesTime: { type: String, default: "0" },
  volumeCapacityMarks: { type: [Number], default: [] },
  volumeCapacityTime: { type: String, default: "0" },
  areaMarks: { type: [Number], default: [] },
  areaTime: { type: String, default: "0" },
  probabilityMarks: { type: [Number], default: [] },
  probabilityTime: { type: String, default: "0" },
});

module.exports = mongoose.model("UserEduPlat", userSchema);