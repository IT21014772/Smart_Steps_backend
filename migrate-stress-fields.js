// migrate-stress-fields.js
require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

// Define the User schema (since we're running this separately)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: String, required: true },
  phoneNum: { type: String, required: true },
  Gender: { type: String, required: true },
  preferredStudyMethod: { type: String, required: true },
  dislikedLesson: { type: String, required: true },
  password: { type: String, required: true },
  cognitivePerformance: { type: String },
  
  // New stress fields
  stressProbability: { type: Number, default: 0.0 },
  stressLevel: { type: String, default: "Medium" },

  // Existing marks and time fields
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

const User = mongoose.model("UserEduPlat", userSchema);

async function migrate() {
  try {
    console.log('Starting migration...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/your-database-name');
    console.log('Connected to MongoDB');
    
    // Check current users without stress fields
    const usersWithoutStressFields = await User.countDocuments({
      $or: [
        { stressProbability: { $exists: false } },
        { stressLevel: { $exists: false } }
      ]
    });
    
    console.log(`Found ${usersWithoutStressFields} users without stress fields`);
    
    if (usersWithoutStressFields === 0) {
      console.log('No users need migration. All users already have stress fields.');
      process.exit(0);
    }
    
    // Update all existing users that don't have the new fields
    const result = await User.updateMany(
      {
        $or: [
          { stressProbability: { $exists: false } },
          { stressLevel: { $exists: false } }
        ]
      },
      {
        $set: {
          stressProbability: 0.0,
          stressLevel: "Medium"
        }
      }
    );
    
    console.log(`Migration completed successfully!`);
    console.log(`Updated ${result.modifiedCount} users`);
    console.log(`Matched ${result.matchedCount} users`);
    
    // Verify the migration
    const remainingUsers = await User.countDocuments({
      $or: [
        { stressProbability: { $exists: false } },
        { stressLevel: { $exists: false } }
      ]
    });
    
    console.log(`Users still without stress fields: ${remainingUsers}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the migration
migrate();