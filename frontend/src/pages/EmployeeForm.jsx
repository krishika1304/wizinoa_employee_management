import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud } from "lucide-react";
import api, { serverUrl } from "../api";

const initial = {
  employeeId: "", fullName: "", email: "", phone: "", department: "",
  designation: "", joiningDate: "", salary: "", address: ""
};
const departments = ["Engineering", "Human Resources", "Finance", "Sales", "Marketing", "Operations", "Support"];

export default function EmployeeForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.get(`/employees/${id}`).then(({ data }) => {
      const emp = data.employee;
      setForm({
        employeeId: emp.employeeId || "", fullName: emp.fullName || "", email: emp.email || "",
        phone: emp.phone || "", department: emp.department || "", designation: emp.designation || "",
        joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().slice(0,10) : "",
        salary: emp.salary ?? "", address: emp.address || ""
      });
      if (emp.photo) setPreview(`${serverUrl}/uploads/${emp.photo}`);
    }).catch(err => setError(err.response?.data?.message || "Could not load employee"));
  }, [id, editing]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const choosePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPG, PNG or WEBP image"); return;
    }
    if (file.size > 2 * 1024 * 1024) { setError("Photo must be 2 MB or smaller"); return; }
    setPhoto(file); setPreview(URL.createObjectURL(file)); setError("");
  };

  const submit = async (e) => {
    e.preventDefault(); setError(""); setBusy(true);
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (photo) payload.append("photo", photo);
    try {
      if (editing) await api.put(`/employees/${id}`, payload);
      else await api.post("/employees", payload);
      navigate("/employees");
    } catch (err) { setError(err.response?.data?.message || "Could not save employee"); }
    finally { setBusy(false); }
  };

  return <section className="form-page">
    <Link to="/employees" className="back-link"><ArrowLeft size={17}/> Back to employees</Link>
    <div className="page-heading compact"><div><p className="eyebrow">EMPLOYEE RECORD</p><h1>{editing ? "Edit employee" : "Add employee"}</h1><p className="muted">Enter the employee's details below.</p></div></div>
    <form className="panel employee-form" onSubmit={submit}>
      {error && <div className="alert error">{error}</div>}
      <div className="form-section-title"><h2>Personal information</h2><p className="muted small">Basic employee details and contact information.</p></div>
      <div className="photo-upload">
        {preview ? <img src={preview} className="photo-preview" alt="Employee preview"/> : <div className="photo-placeholder"><UploadCloud size={25}/></div>}
        <div><strong>Profile photo</strong><p className="muted small">JPG, PNG or WEBP. Maximum 2 MB.</p><label className="secondary upload-button">Choose photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto}/></label></div>
      </div>
      <div className="form-grid">
        <label>Employee ID *<input name="employeeId" value={form.employeeId} onChange={change} required placeholder="EMP-001"/></label>
        <label>Full name *<input name="fullName" value={form.fullName} onChange={change} required placeholder="Employee full name"/></label>
        <label>Email address *<input type="email" name="email" value={form.email} onChange={change} required placeholder="name@example.com"/></label>
        <label>Phone number *<input name="phone" value={form.phone} onChange={change} required placeholder="+91 9876543210"/></label>
        <label>Department *<select name="department" value={form.department} onChange={change} required><option value="">Select department</option>{departments.map(d => <option key={d}>{d}</option>)}</select></label>
        <label>Designation *<input name="designation" value={form.designation} onChange={change} required placeholder="e.g. Software Developer"/></label>
        <label>Joining date *<input type="date" name="joiningDate" value={form.joiningDate} onChange={change} required/></label>
        <label>Salary (INR) *<input type="number" min="0" name="salary" value={form.salary} onChange={change} required placeholder="30000"/></label>
        <label className="full-field">Address<textarea name="address" rows="3" value={form.address} onChange={change} placeholder="Employee address"/></label>
      </div>
      <div className="form-actions"><Link to="/employees" className="secondary link-button">Cancel</Link><button className="primary" disabled={busy}>{busy ? "Saving..." : editing ? "Save changes" : "Create employee"}</button></div>
    </form>
  </section>;
}
