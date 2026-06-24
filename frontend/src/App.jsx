import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";

function App() {
  const [route, setRoute] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [message, setMessage] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [stats, setStats] = useState({ totalEmployees: 0, activeEmployees: 0, hrCount: 0 });
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    salary: "",
    gender: "Male",
    profile_image: "",
    join_date: "",
    shift_time: "",
    role: "Employee",
    job_title: "",
    status: "Active",
    department_id: "",
    manager_id: ""
  });

  const [leaveForm, setLeaveForm] = useState({
    leave_type: "Casual",
    start_date: "",
    end_date: "",
    reason: "",
    status: "Pending"
  });

  useEffect(() => {
    if (route !== "login") {
      loadDashboard();
      loadEmployees();
      loadLeaves();
    }
  }, [route]);

  const requestOptions = (method, body) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return { method, headers, body: body ? JSON.stringify(body) : undefined };
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`,
        requestOptions("POST", loginData)
      );
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setRoute("dashboard");
      setLoginData({ email: "", password: "" });
      setMessage("Login successful.");
    } catch (error) {
      setMessage("Network error while logging in.");
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setRoute("login");
  };

  const loadDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/dashboard`, requestOptions("GET"));
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/employees`, requestOptions("GET"));
      const data = await response.json();
      if (response.ok) {
        setEmployees(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadLeaves = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/leaves`, requestOptions("GET"));
      const data = await response.json();
      if (response.ok) {
        setLeaves(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEmployee = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/employees`,
        requestOptions("POST", employeeForm)
      );
      const data = await response.json();
      if (response.ok) {
        setMessage("Employee added successfully.");
        setEmployeeForm({
          name: "",
          email: "",
          password: "",
          phone: "",
          salary: "",
          gender: "Male",
          profile_image: "",
          join_date: "",
          shift_time: "",
          role: "Employee",
          job_title: "",
          status: "Active",
          department_id: "",
          manager_id: ""
        });
        loadEmployees();
      } else {
        setMessage(data.message || "Add employee failed.");
      }
    } catch (error) {
      setMessage("Network error while adding employee.");
    }
  };

  const handleApplyLeave = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Please login before applying leave.");
      return;
    }

    try {
      const payload = { ...leaveForm, employee_id: user.id };
      const response = await fetch(`${API_BASE}/api/leaves`,
        requestOptions("POST", payload)
      );
      const data = await response.json();
      if (response.ok) {
        setMessage("Leave request submitted.");
        setLeaveForm({
          leave_type: "Casual",
          start_date: "",
          end_date: "",
          reason: "",
          status: "Pending"
        });
        loadLeaves();
      } else {
        setMessage(data.message || "Leave request failed.");
      }
    } catch (error) {
      setMessage("Network error while applying leave.");
    }
  };

  const handleUpdateLeave = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/api/leaves/${id}`,
        requestOptions("PUT", { status })
      );
      const data = await response.json();
      if (response.ok) {
        loadLeaves();
        setMessage(`Leave ${status.toLowerCase()} successfully.`);
      } else {
        setMessage(data.message || "Update failed.");
      }
    } catch (error) {
      setMessage("Network error while updating leave.");
    }
  };

  if (route === "login") {
    return (
      <div className="page-container">
        <div className="card login-card">
          <h1>HR Portal Login</h1>
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <button type="submit">Login</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <nav className="topbar">
        <div>
          <strong>HR Full Stack App</strong>
        </div>
        <div className="nav-links">
          <button onClick={() => setRoute("dashboard")}>Dashboard</button>
          <button onClick={() => setRoute("employees")}>Employees</button>
          <button onClick={() => setRoute("leave")}>Leaves</button>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main>
        <section className="section-header">
          <h2>Welcome, {user?.name || "User"}</h2>
          <p>Role: {user?.role || "N/A"}</p>
        </section>

        {route === "dashboard" && (
          <>
            <section className="stats-grid">
              <article className="stat-card">
                <h3>Total Employees</h3>
                <p>{stats.totalEmployees}</p>
              </article>
              <article className="stat-card">
                <h3>Active Employees</h3>
                <p>{stats.activeEmployees}</p>
              </article>
              <article className="stat-card">
                <h3>HR Count</h3>
                <p>{stats.hrCount}</p>
              </article>
            </section>
            <section className="content-card">
              <h3>Latest Employees</h3>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0, 5).map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.phone}</td>
                        <td>{employee.role}</td>
                        <td>{employee.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {route === "employees" && (
          <div className="two-column">
            <section className="content-card">
              <h3>Employee List</h3>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.phone}</td>
                        <td>{employee.role}</td>
                        <td>{employee.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="content-card">
              <h3>Add Employee</h3>
              <form onSubmit={handleAddEmployee} className="form-grid">
                <label>Name</label>
                <input
                  type="text"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  required
                />
                <label>Email</label>
                <input
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  required
                />
                <label>Password</label>
                <input
                  type="password"
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                  required
                />
                <label>Phone</label>
                <input
                  type="text"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                />
                <label>Salary</label>
                <input
                  type="number"
                  value={employeeForm.salary}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
                />
                <label>Gender</label>
                <select
                  value={employeeForm.gender}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, gender: e.target.value })}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <label>Job Title</label>
                <input
                  type="text"
                  value={employeeForm.job_title}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, job_title: e.target.value })}
                />
                <label>Department ID</label>
                <input
                  type="text"
                  value={employeeForm.department_id}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, department_id: e.target.value })}
                />
                <label>Manager ID</label>
                <input
                  type="text"
                  value={employeeForm.manager_id}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, manager_id: e.target.value })}
                />
                <label>Join Date</label>
                <input
                  type="date"
                  value={employeeForm.join_date}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, join_date: e.target.value })}
                />
                <label>Shift Time</label>
                <input
                  type="text"
                  value={employeeForm.shift_time}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, shift_time: e.target.value })}
                />
                <button type="submit" className="full-width-button">
                  Add Employee
                </button>
              </form>
            </section>
          </div>
        )}

        {route === "leave" && (
          <div className="two-column">
            <section className="content-card">
              <h3>Leave Requests</h3>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>{leave.id}</td>
                        <td>{leave.employee_name}</td>
                        <td>{leave.leave_type}</td>
                        <td>{leave.start_date}</td>
                        <td>{leave.end_date}</td>
                        <td>{leave.status}</td>
                        <td>
                          {leave.status === "Pending" ? (
                            <div className="action-buttons">
                              <button onClick={() => handleUpdateLeave(leave.id, "Approved")}>Approve</button>
                              <button onClick={() => handleUpdateLeave(leave.id, "Rejected")} className="danger-button">
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="content-card">
              <h3>Apply for Leave</h3>
              <form onSubmit={handleApplyLeave} className="form-grid">
                <label>Leave Type</label>
                <select
                  value={leaveForm.leave_type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                >
                  <option>Casual</option>
                  <option>Sick</option>
                  <option>Paid</option>
                  <option>Unpaid</option>
                </select>
                <label>Start Date</label>
                <input
                  type="date"
                  value={leaveForm.start_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                  required
                />
                <label>End Date</label>
                <input
                  type="date"
                  value={leaveForm.end_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                  required
                />
                <label>Reason</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  rows="4"
                  required
                />
                <button type="submit" className="full-width-button">
                  Submit Leave
                </button>
              </form>
            </section>
          </div>
        )}

        {message && <p className="message">{message}</p>}
      </main>
    </div>
  );
}

export default App;
