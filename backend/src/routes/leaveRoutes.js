const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getPendingLeaves,
  updateLeaveStatus,
  approveLeave,
  rejectLeave,
} = require("../controllers/leaveController");
const auth = require("../middlewares/authMiddleware");
const permit = require("../middlewares/roleMiddleware");
const attachSchoolId = require("../middlewares/attachSchoolId");

// Teacher applies for leave
router.post("/apply", auth, attachSchoolId, permit("teacher"), applyLeave);

// Teacher views own leaves
router.get("/my-leaves", auth, permit("teacher"), getMyLeaves);

// Admin views pending leaves (specific route must come before root route)
router.get("/pending", auth, attachSchoolId, permit("admin"), getPendingLeaves);

// Admin views all leaves (root route - must come after specific routes)
router.get("/", auth, attachSchoolId, permit("admin"), getAllLeaves);

// Admin approves leave
router.put(
  "/:leaveId/approve",
  auth,
  attachSchoolId,
  permit("admin"),
  approveLeave
);

// Admin rejects leave
router.put(
  "/:leaveId/reject",
  auth,
  attachSchoolId,
  permit("admin"),
  rejectLeave
);

// Admin updates leave status (generic endpoint)
router.put(
  "/:leaveId/status",
  auth,
  attachSchoolId,
  permit("admin"),
  updateLeaveStatus
);

module.exports = router;
