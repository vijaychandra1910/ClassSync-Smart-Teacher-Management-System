const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");
const {
  createNotification,
  sendLeaveStatusEmail,
} = require("../services/notificationService");

// Teacher applies leave
exports.applyLeave = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const schoolId = req.schoolId;
    const { fromDate, toDate, reason } = req.body;

    if (new Date(toDate) < new Date(fromDate)) {
      return res
        .status(400)
        .json({ message: "'toDate' must be after or equal to 'fromDate'" });
    }

    // Check overlapping leave
    const overlappingLeave = await LeaveRequest.findOne({
      teacherId,
      schoolId,
      status: { $in: ["pending", "approved"] },
      $or: [
        { fromDate: { $lte: new Date(toDate), $gte: new Date(fromDate) } },
        { toDate: { $gte: new Date(fromDate), $lte: new Date(toDate) } },
        {
          fromDate: { $lte: new Date(fromDate) },
          toDate: { $gte: new Date(toDate) },
        },
      ],
    });

    if (overlappingLeave) {
      return res.status(400).json({
        message: "You already have a leave request overlapping this period.",
      });
    }

    const leaveRequest = new LeaveRequest({
      teacherId,
      schoolId,
      fromDate,
      toDate,
      reason,
    });
    await leaveRequest.save();

    // Notify admin(s)
    const teacher = await User.findById(teacherId);
    const adminUsers = await User.find({ schoolId, role: "admin" });

    for (const admin of adminUsers) {
      await createNotification(admin._id, {
        type: "leave_request",
        title: "New Leave Request",
        message: `${teacher.name} has submitted a leave request from ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}. Reason: ${reason}`,
        data: { leaveId: leaveRequest._id },
      });
    }

    res
      .status(201)
      .json({ message: "Leave request submitted successfully.", leaveRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Teacher views own leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const leaves = await LeaveRequest.find({ teacherId }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin views all leaves
exports.getAllLeaves = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const leaves = await LeaveRequest.find({ schoolId })
      .populate("teacherId", "name email")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin views pending leaves
exports.getPendingLeaves = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const leaves = await LeaveRequest.find({ schoolId, status: "pending" })
      .populate("teacherId", "name email")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin updates leave status
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, adminComment } = req.body;
    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave not found." });
    if (leave.status !== "pending")
      return res.status(400).json({ message: "Leave already processed." });

    leave.status = status;
    if (adminComment) leave.adminComment = adminComment;
    await leave.save();

    const teacher = await User.findById(leave.teacherId);
    if (teacher) {
      await createNotification(teacher._id, {
        type: "leave_request",
        title: `Leave ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your leave from ${new Date(leave.fromDate).toLocaleDateString()} to ${new Date(leave.toDate).toLocaleDateString()} has been ${status}.${adminComment ? ` Comment: ${adminComment}` : ""}`,
        data: { leaveId: leave._id, status },
      });

      await sendLeaveStatusEmail(
        teacher.email,
        teacher.name,
        status,
        leave.fromDate,
        leave.toDate,
        adminComment || ""
      );
    }

    res.json({ message: `Leave ${status}.`, leaveRequest: leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin approves leave (convenience endpoint)
exports.approveLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { adminComment } = req.body;
    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave not found." });
    if (leave.status !== "pending")
      return res.status(400).json({ message: "Leave already processed." });

    leave.status = "approved";
    if (adminComment) leave.adminComment = adminComment;
    await leave.save();

    const teacher = await User.findById(leave.teacherId);
    if (teacher) {
      await createNotification(teacher._id, {
        type: "leave_request",
        title: "Leave Approved",
        message: `Your leave from ${new Date(leave.fromDate).toLocaleDateString()} to ${new Date(leave.toDate).toLocaleDateString()} has been approved.${adminComment ? ` Comment: ${adminComment}` : ""}`,
        data: { leaveId: leave._id, status: "approved" },
      });

      await sendLeaveStatusEmail(
        teacher.email,
        teacher.name,
        "approved",
        leave.fromDate,
        leave.toDate,
        adminComment || ""
      );
    }

    res.json({ message: "Leave approved.", leaveRequest: leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin rejects leave (convenience endpoint)
exports.rejectLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { adminComment } = req.body;
    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave not found." });
    if (leave.status !== "pending")
      return res.status(400).json({ message: "Leave already processed." });

    leave.status = "rejected";
    if (adminComment) leave.adminComment = adminComment;
    await leave.save();

    const teacher = await User.findById(leave.teacherId);
    if (teacher) {
      await createNotification(teacher._id, {
        type: "leave_request",
        title: "Leave Rejected",
        message: `Your leave from ${new Date(leave.fromDate).toLocaleDateString()} to ${new Date(leave.toDate).toLocaleDateString()} has been rejected.${adminComment ? ` Comment: ${adminComment}` : ""}`,
        data: { leaveId: leave._id, status: "rejected" },
      });

      await sendLeaveStatusEmail(
        teacher.email,
        teacher.name,
        "rejected",
        leave.fromDate,
        leave.toDate,
        adminComment || ""
      );
    }

    res.json({ message: "Leave rejected.", leaveRequest: leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
