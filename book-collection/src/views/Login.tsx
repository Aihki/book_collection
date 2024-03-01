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
    <button onClick={handleToggle}>
  {!toggleReg ? 'No account yet? Register here!' : 'Back to login'}
</button>
    </>
  );

}

export default Login;
