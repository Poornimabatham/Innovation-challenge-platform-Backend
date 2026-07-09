import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChallengeList from "./pages/challenges/ChallengeList";
import ChallengeForm from "./pages/challenges/ChallengeForm";
import TeamList from "./pages/teams/TeamList";
import TeamForm from "./pages/teams/TeamForm";
import SubmissionList from "./pages/submissions/SubmissionList";
import SubmissionForm from "./pages/submissions/SubmissionForm";
import JudgeDashboard from "./pages/judge/JudgeDashboard";
import Leaderboard from "./pages/Leaderboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

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
          <Route
            path="/teams"
            element={
              <PrivateRoute>
                <TeamList />
              </PrivateRoute>
            }
          />
          <Route
            path="/teams/new"
            element={
              <PrivateRoute>
                <TeamForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/submissions"
            element={
              <PrivateRoute>
                <SubmissionList />
              </PrivateRoute>
            }
          />
          <Route
            path="/submissions/new"
            element={
              <PrivateRoute>
                <SubmissionForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/submissions/edit/:id"
            element={
              <PrivateRoute>
                <SubmissionForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/judge"
            element={
              <PrivateRoute roles={["judge", "admin"]}>
                <JudgeDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
