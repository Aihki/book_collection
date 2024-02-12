import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/apiHooks";
import { useForm } from "../hooks/formHooks";
import { Credentials } from '../types/LocalTypes';

const LoginForm = () => {
  const {postLogin} = useAuthentication();
  const navigate = useNavigate();
  const initValues: Credentials = {
    username: "",
    password: "",
  };
  const doLogin = async () => {
    try {
      const loginResult = await postLogin(inputs as Credentials);
      if (loginResult){
      localStorage.setItem('token', loginResult.token);
      navigate('/');
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  const {handleSubmit,handleInputChange, inputs} = useForm(doLogin, initValues);

    return (
      <>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="UserWithLevelname">Username</label>
            <input
              name="username"
              type="text"
              id="UserWithLevelname"
              onChange={handleInputChange}
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="loginpassword">Password</label>
            <input
              name="password"
              type="password"
              id="loginpassword"
              onChange={handleInputChange}
              autoComplete="current-password"
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </>
    );
  };

  export default LoginForm;
