import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";


const Login = () => {
  const [toggleReg, setToggleReg] = useState(false);
  const handleToggle = () => {
    setToggleReg(!toggleReg);
  }
  return (
    <>
     {!toggleReg ? (
      <LoginForm />
    ) : (
      <RegisterForm handletoggle={handleToggle} />
    )}
  <div className="flex items-center justify-center">
  <button className="text-center text-blue-400 underline hover:text-blue-600" onClick={handleToggle}>
    {!toggleReg ? 'No account yet? Register here!' : 'Back to login'}
  </button>
</div>
    </>
  );

}

export default Login;
