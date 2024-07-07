const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const globalStoreRoutes = require("./globalStore.routes");
const spamRecordRoutes = require("./spamRecord.routes");

router.use("/user", userRoutes);

router.use("/globalstore", globalStoreRoutes);

router.use("/spamrecord", spamRecordRoutes);

module.exports = router;
