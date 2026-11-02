import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Users, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">W</span><span>Wizinoa <small>People</small></span></div>
        <nav>
          <NavLink to="/employees"><Users size={17}/> Employees</NavLink>
          {user?.role === "admin" && <NavLink to="/employees/new"><UserPlus size={17}/> Add employee</NavLink>}
        </nav>
        <div className="profile"><span>{user?.name} <small>{user?.role}</small></span><button className="icon-button" onClick={handleLogout} title="Logout"><LogOut size={18}/></button></div>
      </header>
      <main className="main-content"><Outlet /></main>
      <footer>Wizinoa Employee Management</footer>
    </div>
  );
}
