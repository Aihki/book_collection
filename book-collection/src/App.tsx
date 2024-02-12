import Home from "./views/Home";
import Profile from "./views/Profile";
import Upload from "./views/Upload";
import Single from "./views/Single";
import Layout from "./views/Layout";
import Login from "./views/Login";
import Logout from "./views/Logout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";





const App = () => {

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/single" element={<Single />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
