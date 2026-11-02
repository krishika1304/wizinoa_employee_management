import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";

export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/employees" replace/> : <Login/>}/>
    <Route element={<ProtectedRoute/>}>
      <Route element={<Layout/>}>
        <Route path="/employees" element={<EmployeeList/>}/>
        <Route element={<ProtectedRoute adminOnly/>}>
          <Route path="/employees/new" element={<EmployeeForm/>}/>
        </Route>
        <Route path="/employees/:id/edit" element={<EmployeeForm/>}/>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to={user ? "/employees" : "/login"} replace/>}/>
  </Routes>;
}
