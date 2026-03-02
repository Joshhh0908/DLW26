  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  import Login from "./pages/login";
  import Notes from "./pages/notes";
  import CreateAccount from "./pages/createAccount";
  import PrivateRoute from "./components/privateRoute";
  import DashboardController from "./components/DashboardController";
  import MainLayout from "./components/MainLayout";
  import KnowledgeGraph from "./components/KnowledgeGraph";
  import StudyDashboard from "./components/StudyDashboard";

  function App() {
    return (
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />

          {/* Protected */}
          <Route element={<PrivateRoute />}>
            {/* ✅ Layout wrapper adds sidebar */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<DashboardController />} />
              <Route path="/study" element={<StudyDashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/knowledge" element={<KnowledgeGraph />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    );
  }

  export default App;