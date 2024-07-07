const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const spamRecordController = require("../controllers/spamRecords.controller");

router.post("/markspam", auth(), spamRecordController.addSpamRecord);

module.exports = router;
