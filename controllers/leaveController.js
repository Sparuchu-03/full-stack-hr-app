const db = require("../config/db");

// GET all leave requests
const getAllLeaveRequests = (req, res) => {
  const sql = `
    SELECT
      lr.id,
      lr.employee_id,
      e.name AS employee_name,
      lr.leave_type,
      lr.start_date,
      lr.end_date,
      lr.reason,
      lr.status
    FROM leave_requests lr
    JOIN employees e ON lr.employee_id = e.id
    ORDER BY lr.id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch leave requests",
        error: err
      });
    }

    res.status(200).json(results);
  });
};

// POST apply leave
const applyLeave = (req, res) => {
  const {
    employee_id,
    leave_type,
    start_date,
    end_date,
    reason,
    status
  } = req.body;

  const sql = `
    INSERT INTO leave_requests
    (employee_id, leave_type, start_date, end_date, reason, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [employee_id, leave_type, start_date, end_date, reason, status],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to apply leave",
          error: err
        });
      }

      res.status(201).json({
        message: "Leave applied successfully",
        leaveId: result.insertId
      });
    }
  );
};

// PUT update leave status
const updateLeaveStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = `
    UPDATE leave_requests
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to update leave status",
        error: err
      });
    }

    res.status(200).json({
      message: "Leave status updated successfully"
    });
  });
};

module.exports = {
  getAllLeaveRequests,
  applyLeave,
  updateLeaveStatus
};