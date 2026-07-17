import Signup from "./Component/SignUp/SignupPage.jsx";
import Login from "./Component/Login/login.jsx";
import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Signup" />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}