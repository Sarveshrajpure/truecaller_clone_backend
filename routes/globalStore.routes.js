const express = require("express");
const globalStoreController = require("../controllers/globalStore.controller");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

router.post("/importusercontacts", auth(), globalStoreController.importUserContacts);

module.exports = router;
