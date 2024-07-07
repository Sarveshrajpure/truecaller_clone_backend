const express = require("express");
const globalStoreController = require("../controllers/globalStore.controller");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

router.post("/importusercontacts", auth(), globalStoreController.importUserContacts);

router.get("/searchbyname", auth(), globalStoreController.searchByName);

router.get("/searchbyphonenumber", auth(), globalStoreController.searchByPhoneNumber);

router.get("/getsearchresultdetails", auth(), globalStoreController.getSearchResultDetails);

module.exports = router;
