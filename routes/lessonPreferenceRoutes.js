const express = require("express");
const { saveLessonPreference, getLessonPreferences, getContentPreference } = require("../controllers/lessonPreferenceController");

const router = express.Router();

router.get("/", getContentPreference);
router.post("/save", saveLessonPreference);
router.get("/:email", getLessonPreferences);

module.exports = router;
