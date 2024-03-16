
import { Link, Outlet } from "react-router-dom";
import { useUserContext } from "../hooks/contexHooks";
import Footer from "../components/Footer";

const Layout = () => {
  const {user, handleAutoLogin} = useUserContext();

  if (!user) {
    handleAutoLogin();
  }


return (
  <div className="bg-neutral-300 dark:bg-neutral-800 dark:text-white flex flex-col min-h-screen">
  <header>
  <nav className="flex items-center justify-between flex-wrap bg-slate-800 p-6">
    <div className="flex items-center flex-shrink-0 text-white mr-6">
      <span className="font-semibold text-xl tracking-tight">Book Collection</span>
    </div>
    <ul className="flex justify-end text-white">
      <li className="block mt-4 lg:inline-block lg:mt-0 text-grey-200  hover:text-white mr-4">
        <Link to="/">Home</Link>
      </li>
      {user ? (
        <>
      <li className="block mt-4 lg:inline-block lg:mt-0 text-grey-200 hover:text-white mr-4">
        <Link to="/profile">Your book List</Link>
      </li>
      <li className="block mt-4 lg:inline-block lg:mt-0 text-grey-200 hover:text-white mr-4">
        <Link to="/upload">Upload</Link>
      </li>
      </>
      ) : (
      <li className="block mt-4 lg:inline-block lg:mt-0 text-grey-200 hover:text-white mr-4">
        <Link to="/login">Login</Link>
      </li>
      )}
    </ul>
  </nav>
  </header>
  <main className="flex-grow">
    <Outlet />
  </main>
  <footer>
    <Footer />
  </footer>
</div>

 );

}

export default Layout;
