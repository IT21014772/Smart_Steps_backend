const express = require("express");
const { 
  savePeerPreference, 
  getPeerPreferences, 
  getPeerPreferenceByEmail 
} = require("../controllers/peerController");

const router = express.Router();

// POST route to save preferences
router.post("/save", savePeerPreference);

// GET route with a specific email parameter
router.get("/user/:email", getPeerPreferences);

// GET route for query parameter-based lookup
router.get("/", getPeerPreferenceByEmail);

module.exports = router;