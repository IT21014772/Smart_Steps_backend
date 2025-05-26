const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      // Default values for other fields
      age: "0",
      phoneNum: "0",
      Gender: "Other",
      preferredStudyMethod: "None",
      dislikedLesson: "None",
      stressProbability: 0.0,
      stressLevel: "Medium",
      cognitivePerformance: "Average", // Fixed: was "None", now "Average"
      // Initialize marks and time(s) fields
      numberSequencesMarks: [],
      numberSequencesTime: "0",
      perimeterMarks: [],
      perimeterTime: "0",
      ratioMarks: [],
      ratioTime: "0",
      fractionsDecimalsMarks: [],
      fractionsDecimalsTime: "0",
      indicesMarks: [],
      indicesTime: "0",
      algebraMarks: [],
      algebraTime: "0",
      anglesMarks: [],
      anglesTime: "0",
      volumeCapacityMarks: [],
      volumeCapacityTime: "0",
      areaMarks: [],
      areaTime: "0",
      probabilityMarks: [],
      probabilityTime: "0",
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        stressLevel: user.stressLevel,
        stressProbability: user.stressProbability,
        cognitivePerformance: user.cognitivePerformance // Added this
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// FIXED: Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // FIXED: Return the actual user data, not undefined profileData
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Profile and Marks
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // FIXED: Added cognitivePerformance to profile fields
    const profileFields = [
      "name", 
      "age", 
      "phoneNum", 
      "Gender", 
      "preferredStudyMethod", 
      "dislikedLesson", 
      "stressProbability", 
      "stressLevel",
      "cognitivePerformance" // Added this field
    ];
    
    profileFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    // Update time fields independently
    const timeFields = [
      "numberSequencesTime",
      "perimeterTime", 
      "ratioTime",
      "fractionsDecimalsTime",
      "indicesTime",
      "algebraTime",
      "anglesTime",
      "volumeCapacityTime",
      "areaTime",
      "probabilityTime"
    ];

    timeFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    // Update marks and cognitive performance (existing code)
    const marksFields = [
      "numberSequences",
      "perimeter", 
      "ratio",
      "fractionsDecimals",
      "indices",
      "algebra",
      "angles",
      "volumeCapacity",
      "area",
      "probability"
    ];

    let marksUpdated = false;
    
    marksFields.forEach((topic) => {
      const marksField = `${topic}Marks`;
      
      if (updateData[marksField] !== undefined) {
        user[marksField].push(updateData[marksField]);
        marksUpdated = true;
      }
    });

    // Only auto-calculate cognitive performance if marks were updated
    // and cognitivePerformance wasn't explicitly provided
    if (marksUpdated && updateData.cognitivePerformance === undefined) {
      const sumOfLatestMarks = marksFields.reduce((sum, topic) => {
        const marksArray = user[`${topic}Marks`];
        const lastMark = marksArray.length > 0 ? marksArray[marksArray.length - 1] : 0;
        return sum + lastMark;
      }, 0);

      if (sumOfLatestMarks > 750) {
        user.cognitivePerformance = "Very High";
      } else if (sumOfLatestMarks >= 500 && sumOfLatestMarks <= 750) {
        user.cognitivePerformance = "High";
      } else if (sumOfLatestMarks >= 250 && sumOfLatestMarks < 500) {
        user.cognitivePerformance = "Average";
      } else {
        user.cognitivePerformance = "Low";
      }
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};