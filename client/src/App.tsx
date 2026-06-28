import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import Dashboard from "./pages/Dashboard.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
