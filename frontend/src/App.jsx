import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Notes from "./pages/notes";
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
          {/* We swapped out your teammate's placeholder for YOUR dashboard! */}
          <Route path="/home" element={<DashboardController />} />
          
          {/* Your Knowledge Graph Page */}
          <Route path="/study" element={<StudyDashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/knowledge" element={<KnowledgeGraph />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;