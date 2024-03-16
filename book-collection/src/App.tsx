import Home from "./views/Home";
import Profile from "./views/Profile";
import Upload from "./views/Upload";
import Single from "./views/Single";
import Layout from "./views/Layout";
import Login from "./views/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {UserProvider} from './contexts/UserContext';
import {UpdateProvider} from './contexts/UpdateContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';








const App = () => {

  return (
    <Router basename={import.meta.env.BASE_URL}>
    <UserProvider>
      <UpdateProvider>
        <ToastContainer />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route path="/single" element={<Single />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </UpdateProvider>
    </UserProvider>
  </Router>
  );
};

export default App;
