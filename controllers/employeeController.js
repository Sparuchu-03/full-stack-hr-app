const db = require("../config/db");

// GET all employees
const getAllEmployees = (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      email,
      phone,
      salary,
      gender,
      profile_image,
      join_date,
      shift_time,
      role,
      job_title,
      status,
      department_id,
      manager_id
    FROM employees
    ORDER BY id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch employees",
        error: err
      });
    }

    res.status(200).json(results);
  });
};

// POST add employee
const addEmployee = (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    salary,
    gender,
    profile_image,
    join_date,
    shift_time,
    role,
    job_title,
    status,
    department_id,
    manager_id
  } = req.body;

  const sql = `
    INSERT INTO employees
    (name, email, password, phone, salary, gender, profile_image, join_date, shift_time, role, job_title, status, department_id, manager_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      email,
      password,
      phone,
      salary,
      gender,
      profile_image,
      join_date,
      shift_time,
      role,
      job_title,
      status,
      department_id,
      manager_id
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to add employee",
          error: err
        });
      }

      res.status(201).json({
        message: "Employee added successfully",
        employeeId: result.insertId
      });
    }
  );
};

module.exports = {
  getAllEmployees,
  addEmployee
};