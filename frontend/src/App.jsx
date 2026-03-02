import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import CreateAccount from "./pages/createAccount";
import PrivateRoute from "./components/privateRoute";

// --- Import your new components here ---
import HomePage from "./components/HomePage";
import StudyDashboard from "./components/StudyDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (Anyone can see these) */}
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/penis" element={<h1>Penis</h1>} />

        {/* Protected Routes (Requires user to be logged in!) */}
        <Route element={<PrivateRoute />}>
          {/* We swapped out your teammate's placeholder for YOUR dashboard! */}
          <Route path="/home" element={<HomePage />} /> 
          
          {/* Your Knowledge Graph Page */}
          <Route path="/study" element={<StudyDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
