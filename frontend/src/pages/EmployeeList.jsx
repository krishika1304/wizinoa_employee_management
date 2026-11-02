import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Users } from "lucide-react";
import api, { serverUrl } from "../api";
import { useAuth } from "../context/AuthContext";

export default function EmployeeList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (page = 1, term = query) => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/employees", { params: { page, limit: 6, search: term } });
      setItems(data.employees); setPagination(data.pagination);
    } catch (err) { setError(err.response?.data?.message || "Could not load employees"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(1, ""); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try { await api.delete(`/employees/${id}`); load(Math.max(1, pagination.page)); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };
  const photoSrc = (employee) => employee.photo ? `${serverUrl}/uploads/${employee.photo}` : "";

  return <section>
    <div className="page-heading">
      <div><p className="eyebrow">DIRECTORY</p><h1>Employees</h1><p className="muted">Manage your organisation's employee records.</p></div>
      {user?.role === "admin" && <Link className="primary link-button" to="/employees/new"><Plus size={18}/> Add employee</Link>}
    </div>
    <div className="stats-row"><div className="stat-card"><span className="stat-icon"><Users size={20}/></span><div><strong>{pagination.total}</strong><small>Total employees</small></div></div></div>
    <div className="panel">
      <div className="toolbar">
        <div><h2>All employees</h2><p className="muted small">Browse and manage employee information</p></div>
        <form className="search-box" onSubmit={e => {e.preventDefault(); setQuery(search); load(1, search);}}>
          <Search size={17}/><input placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)}/>
          <button type="submit" className="secondary">Search</button>
        </form>
      </div>
      {error && <div className="alert error">{error}</div>}
      {loading ? <div className="empty">Loading employees...</div> : items.length === 0 ? <div className="empty">No employees found. {user?.role === "admin" && <Link to="/employees/new">Add your first employee</Link>}</div> :
        <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Employee ID</th><th>Department</th><th>Designation</th><th>Contact</th><th>Joining date</th><th>Actions</th></tr></thead>
          <tbody>{items.map(emp => <tr key={emp._id}>
            <td><div className="employee-cell">{emp.photo ? <img src={photoSrc(emp)} alt="" className="avatar"/> : <span className="avatar initials">{emp.fullName?.[0]}</span>}<span><strong>{emp.fullName}</strong><small>{emp.email}</small></span></div></td>
            <td>{emp.employeeId}</td><td>{emp.department}</td><td>{emp.designation}</td><td>{emp.phone}</td><td>{new Date(emp.joiningDate).toLocaleDateString()}</td>
            <td><div className="actions"><Link className="icon-button" title="Edit" to={`/employees/${emp._id}/edit`}><Pencil size={17}/></Link><button className="icon-button danger-text" title="Delete" onClick={() => remove(emp._id)}><Trash2 size={17}/></button></div></td>
          </tr>)}</tbody></table></div>}
      <div className="pagination"><span>Showing {items.length ? (pagination.page - 1) * pagination.limit + 1 : 0}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
        <div><button className="secondary square" disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)}><ChevronLeft size={17}/></button><span className="page-count">Page {pagination.page} of {Math.max(1, pagination.totalPages)}</span><button className="secondary square" disabled={pagination.page >= pagination.totalPages} onClick={() => load(pagination.page + 1)}><ChevronRight size={17}/></button></div>
      </div>
    </div>
  </section>;
}
