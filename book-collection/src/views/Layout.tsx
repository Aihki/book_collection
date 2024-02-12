import { Link, Outlet } from "react-router-dom";

const Layout = () => {
return (
<>
  <header>
  <h1>Book Collection</h1>
  <nav>
    <ul className="nav-menu">
      <li className="nav-link">
        <Link to="/">Home</Link>
      </li>
      <li className="nav-link">
        <Link to="/profile">Profile</Link>
      </li>
      <li className="nav-link">
        <Link to="/upload">Upload</Link>
      </li>
      <li className="nav-link">
        <Link to="/login">Login</Link>
      </li>
      <li className="nav-link">
        <Link to="/logout">Logout</Link>
      </li>
    </ul>
  </nav>
  </header>
  <main>
    <Outlet />
  </main>
  <footer>
    <p>copyright</p>
  </footer>
</>

 );

}

export default Layout;
