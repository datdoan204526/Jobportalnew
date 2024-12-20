const express = require("express");

const dashboardCtrl = require("../controller/dashboard");

const router = express.Router();

router.get("/summary", dashboardCtrl.getSummary);

module.exports = router;
