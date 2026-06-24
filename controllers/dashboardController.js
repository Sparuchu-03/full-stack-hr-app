const db = require("../config/db");

const getDashboardStats = (req, res) => {
  const totalEmployeesQuery = "SELECT COUNT(*) AS totalEmployees FROM employees";
  const activeEmployeesQuery = "SELECT COUNT(*) AS activeEmployees FROM employees WHERE status = 'Active'";
  const hrCountQuery = "SELECT COUNT(*) AS hrCount FROM employees WHERE role = 'HR'";

  db.query(totalEmployeesQuery, (err1, totalResult) => {
    if (err1) {
      return res.status(500).json({ message: "Error fetching total employees", error: err1 });
    }

    db.query(activeEmployeesQuery, (err2, activeResult) => {
      if (err2) {
        return res.status(500).json({ message: "Error fetching active employees", error: err2 });
      }

      db.query(hrCountQuery, (err3, hrResult) => {
        if (err3) {
          return res.status(500).json({ message: "Error fetching HR count", error: err3 });
        }

        res.status(200).json({
          totalEmployees: totalResult[0].totalEmployees,
          activeEmployees: activeResult[0].activeEmployees,
          hrCount: hrResult[0].hrCount
        });
      });
    });
  });
};

module.exports = { getDashboardStats };