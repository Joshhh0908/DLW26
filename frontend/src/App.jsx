import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import CreateAccount from "./pages/createAccount";
import PrivateRoute from "./components/privateRoute";
import PopulatedDashboard from "./components/PopulatedDashboard";
import StudyDashboard from "./components/StudyDashboard";
import DashboardController from "./components/DashboardController";
import MainLayout from "./components/MainLayout";
import KnowledgeGraph from "./components/KnowledgeGraph";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (Anyone can see these) */}
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/penis" element={<h1>Penis</h1>} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          {/* Wrap protected routes in MainLayout to keep sidebar persistent */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<DashboardController />} />
            <Route path="/study" element={<StudyDashboard />} />
            <Route path="/knowledge" element={<KnowledgeGraph />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;