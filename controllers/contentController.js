const PeerPreference = require("../models/Content");

// Save or update peer preferences
exports.savePeerPreference = async (req, res) => {
  try {
    const { email, preferences, stressLevel, cognitive } = req.body;

    // Validate input
    if (!email || !preferences) {
      return res.status(400).json({ message: "Email and preferences are required." });
    }

    // Check if a record with the email already exists
    const existingPreference = await PeerPreference.findOne({ email });

    if (existingPreference) {
      // Update the existing record
      existingPreference.preferences = preferences;
      existingPreference.stressLevel = stressLevel;
      existingPreference.cognitive = cognitive;
      await existingPreference.save();

      return res.status(200).json({ message: "Preferences updated successfully!" });
    } else {
      // Create a new preference entry
      const newPreference = new PeerPreference({ email, preferences, stressLevel, cognitive });
      await newPreference.save();

      return res.status(201).json({ message: "Preferences saved successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get peer preferences for a specific email
exports.getPeerPreferences = async (req, res) => {
  try {
    const { email } = req.params;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Find preferences for the given email
    const preferences = await PeerPreference.find({ email });

    if (!preferences.length) {
      return res.status(404).json({ message: "No preferences found for this email." });
    }

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get content preference by email
exports.getContentPreference = async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameter
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const contentPreference = await PeerPreference.findOne({ email });
    if (!contentPreference) {
      return res.status(404).json({ message: "Content preference not found" });
    }

    res.status(200).json(contentPreference);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch content preference", error: error.message });
  }
};