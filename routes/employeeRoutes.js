const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  addEmployee
} = require("../controllers/employeeController");

router.get("/", getAllEmployees);
router.post("/", addEmployee);

module.exports = router;