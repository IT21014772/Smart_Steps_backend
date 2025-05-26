const express = require("express");
const { savePeerPreference, getPeerPreferences, getContentPreference } = require("../controllers/contentController");

const router = express.Router();

router.post("/save", savePeerPreference);
router.get("/:email", getPeerPreferences);
router.get("/", getContentPreference);

module.exports = router;
