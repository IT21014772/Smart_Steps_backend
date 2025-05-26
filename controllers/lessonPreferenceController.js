const LessonPreference = require("../models/LessonPreference");

// Save or update peer preferences
exports.saveLessonPreference = async (req, res) => {
  try {
    const { email, preferences } = req.body;

    if (!email || !preferences) {
      return res.status(400).json({ message: "Email and preferences are required." });
    }

    // Use findOneAndUpdate with upsert to avoid version conflicts
    const updatedPreference = await LessonPreference.findOneAndUpdate(
      { email }, // Find by email
      { 
        email, 
        preferences,
        updatedAt: new Date() 
      },
      { 
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true // Run schema validations
      }
    );

    const isNew = !updatedPreference.createdAt || 
                  updatedPreference.createdAt.getTime() === updatedPreference.updatedAt.getTime();

    return res.status(isNew ? 201 : 200).json({ 
      message: isNew ? "Preferences saved successfully!" : "Preferences updated successfully!",
      data: updatedPreference
    });

  } catch (error) {
    console.error("Error in saveLessonPreference:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get lesson preferences for a specific email
exports.getLessonPreferences = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const preferences = await LessonPreference.find({ email });

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

    const contentPreference = await LessonPreference.findOne({ email });
    if (!contentPreference) {
      return res.status(404).json({ message: "Lesson preference not found" });
    }

    res.status(200).json(contentPreference);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lesson preference", error: error.message });
  }
};