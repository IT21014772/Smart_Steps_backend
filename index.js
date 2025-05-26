// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'https://research-project-theta.vercel.app',
    'http://localhost:5004',
    'https://smart-steps-be.vercel.app',
    'https://smartsteps.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173'    
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const User = require("./models/User");

app.post("/api/stress-predictions", async (req, res) => {
  try {
    const { email, stressLevel, probability, recommendations } = req.body;
    
    console.log(`Received stress prediction data for user: ${email}`);
    console.log(`Stress Level: ${stressLevel}, Probability: ${probability}`);
    
    // Validate required fields
    if (!email || !stressLevel || probability === undefined) {
      return res.status(400).json({ 
        message: "Email, stressLevel, and probability are required" 
      });
    }
    
    // Find and update the user
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { 
        stressLevel: stressLevel,
        stressProbability: probability 
      },
      { new: true, upsert: false } // Don't create new user if not found
    );
    
    if (!updatedUser) {
      return res.status(404).json({ 
        message: "User not found with the provided email" 
      });
    }
    
    console.log(`Successfully updated stress data for user: ${email}`);
    
    res.status(200).json({
      message: "Stress prediction data saved successfully",
      user: {
        email: updatedUser.email,
        stressLevel: updatedUser.stressLevel,
        stressProbability: updatedUser.stressProbability
      },
      recommendations: recommendations
    });
    
  } catch (error) {
    console.error("Error saving stress prediction:", error);
    res.status(500).json({ 
      message: "Failed to save stress prediction data", 
      error: error.message 
    });
  }
});

app.use("/api/auth", authRoutes);

const lessonPreferenceRoutes = require("./routes/lessonPreferenceRoutes");
app.use("/api/lesson", lessonPreferenceRoutes);

const PeerPreference = require("./routes/peerRoutes");
app.use("/api/peer", PeerPreference);

const ContentPreference = require("./routes/contentRoutes");
app.use("/api/content", ContentPreference);

const courseContentRoutes = require('./routes/lessonRoutes');
app.use('/api/course', courseContentRoutes);

const specializationRoutes = require('./routes/specialRoutes');
app.use('/api/specialize', specializationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));