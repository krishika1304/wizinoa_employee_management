import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@example.com", password: "Admin@12345" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setBusy(true);
    try { await login(form.email, form.password); navigate("/employees"); }
    catch (err) { setError(err.response?.data?.message || "Unable to log in"); }
    finally { setBusy(false); }
  };

  return <div className="login-page">
    <form className="login-card" onSubmit={submit}>
      <div className="brand login-brand"><span className="brand-mark">W</span><span>Wizinoa <small>People</small></span></div>
      <h1>Welcome back</h1><p className="muted">Sign in to manage your employees.</p>
      {error && <div className="alert error">{error}</div>}
      <label>Email address<input type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})}/></label>
      <label>Password<input type="password" required value={form.password} onChange={e => setForm({...form, password:e.target.value})}/></label>
      <button className="primary full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
    </form>
  </div>;
}
