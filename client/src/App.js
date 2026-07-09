import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChallengeList from "./pages/challenges/ChallengeList";
import ChallengeForm from "./pages/challenges/ChallengeForm";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <PrivateRoute>
                <ChallengeList />
              </PrivateRoute>
            }
          />
          <Route
            path="/challenges/new"
            element={
              <PrivateRoute roles={["organizer", "admin"]}>
                <ChallengeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/challenges/edit/:id"
            element={
              <PrivateRoute roles={["organizer", "admin"]}>
                <ChallengeForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
