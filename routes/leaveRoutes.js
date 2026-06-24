const express = require("express");
const router = express.Router();

const {
  getAllLeaveRequests,
  applyLeave,
  updateLeaveStatus
} = require("../controllers/leaveController");

router.get("/", getAllLeaveRequests);
router.post("/", applyLeave);
router.put("/:id", updateLeaveStatus);

module.exports = router;