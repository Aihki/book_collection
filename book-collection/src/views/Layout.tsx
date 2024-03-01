
import { Link, Outlet } from "react-router-dom";
import { useUserContext } from "../hooks/contexHooks";

const Layout = () => {
  const {user, handleAutoLogin} = useUserContext();

  if (!user) {
    handleAutoLogin();
  }


return (
<>
  <header>
  <nav>
    <ul className="flex justify-end bg-slate-950">
      <li className="block p-4 text-center text-slate-50 hover:bg-slate-700">
        <Link to="/">Home</Link>
      </li>
      {user ? (
        <>
      <li className="block p-4 text-center text-slate-50 hover:bg-slate-700">
        <Link to="/profile">Profile</Link>
      </li>
      <li className="block p-4 text-center text-slate-50 hover:bg-slate-700">
        <Link to="/upload">Upload</Link>
      </li>
      <li className="block p-4 text-center text-slate-50 hover:bg-slate-700">
        <Link to="/logout">Logout</Link>
      </li>
      </>
      ) : (
      <li className="block p-4 text-center text-slate-50 hover:bg-slate-700">
        <Link to="/login">Login</Link>
      </li>
      )}
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
