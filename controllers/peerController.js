const PeerPreference = require("../models/Peer");

// Save or update peer preferences
exports.savePeerPreference = async (req, res) => {
  try {
    const { email, preferences } = req.body;

    // Better validation with error messages
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    if (preferences === undefined || preferences === null) {
      return res.status(400).json({ message: "Preferences are required." });
    }

    // Log the request for debugging
    console.log("Saving peer preference:", { email, preferences });

    // Check if a record with the email already exists
    let existingPreference;
    try {
      existingPreference = await PeerPreference.findOne({ email });
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return res.status(500).json({ 
        message: "Database error while checking for existing preferences",
        error: dbError.message 
      });
    }

    if (existingPreference) {
      // Update the existing record
      existingPreference.preferences = preferences;
      await existingPreference.save();
      console.log("Updated existing peer preference");
      return res.status(200).json({ message: "Preferences updated successfully!" });
    } else {
      // Create a new preference entry
      const newPreference = new PeerPreference({ email, preferences });
      await newPreference.save();
      console.log("Created new peer preference");
      return res.status(201).json({ message: "Preferences saved successfully!" });
    }
  } catch (error) {
    console.error("Error in savePeerPreference:", error);
    res.status(500).json({ 
      message: "Server error saving peer preferences", 
      error: error.message 
    });
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

    console.log("Getting peer preferences for:", email);

    // Find preferences for the given email
    const preference = await PeerPreference.findOne({ email });

    if (!preference) {
      console.log("No peer preferences found for:", email);
      return res.status(404).json({ message: "No preferences found for this email." });
    }

    console.log("Found peer preferences:", preference);
    res.json(preference);
  } catch (error) {
    console.error("Error in getPeerPreferences:", error);
    res.status(500).json({ 
      message: "Server error fetching peer preferences", 
      error: error.message 
    });
  }
};

// Get peer preference by email
exports.getPeerPreferenceByEmail = async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameter
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log("Getting peer preference by query param:", email);

    const contentPreference = await PeerPreference.findOne({ email });
    
    if (!contentPreference) {
      console.log("No peer preference found for query:", email);
      return res.status(404).json({ message: "Peer preference not found" });
    }

    console.log("Found peer preference by query:", contentPreference);
    res.status(200).json(contentPreference);
  } catch (error) {
    console.error("Error in getPeerPreferenceByEmail:", error);
    res.status(500).json({ 
      message: "Failed to fetch peer preference", 
      error: error.message 
    });
  }
};