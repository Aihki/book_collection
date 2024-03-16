import { Link } from "react-router-dom";
import { useUserContext } from "../hooks/contexHooks";

const Footer = () => {
  const {user} = useUserContext();

  return (
<footer className="bg-slate-800  text-white p-4">
  <div className="container mx-auto">
    <div className="flex flex-row justify-center items-center">

      <div className="w-2/5 px-2 sm:px-4">
        <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
        <ul className="block sm:inline-block">
         <li><Link to="/">Home</Link></li>
         {user ? (
          <>
        <li><Link to="/profile">Your book List</Link></li>
        <li><Link to="/upload">Upload</Link></li>
        </>
         ) : (
        <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>
      <div className="w-2/5 px-2 sm:px-4 order-last text-left">
        <h3 className="text-lg font-semibold mb-2">About App</h3>
        <p>BookCollection applikaation idea on että voit seruata mitkä tietyn sarjan kirjat olet jo hankkinut</p>
      </div>
    </div>
    <div className="mt-4 text-center">
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</footer>
  );
};

export default Footer;
