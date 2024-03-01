import { useState } from 'react';
import { useUser } from '../hooks/graphQLHooks';
import {useForm} from '../hooks/formHooks';



const RegisterForm = ({handletoggle}: {handletoggle: () => void}) => {
  const {postUser} = useUser();
  const [usernameAvailable, setUsernameAvaileble] = useState<boolean | undefined>(true);
  const [emailAvailable, setEmailAvaileble] = useState<boolean | undefined>(true);



  const initValues = {
    username: '',
    password: '',
    email: '',
  };
  const {getUsernameAvailable, getEmailAvailable} = useUser();




  const handleUsernameBlur = async (event: React.SyntheticEvent<HTMLInputElement>) => {
    const result = await getUsernameAvailable(event.currentTarget.value);
    setUsernameAvaileble(result.available);
  };

  const handleEmailBlur = async (event: React.SyntheticEvent<HTMLInputElement>) => {
    const result = await getEmailAvailable(event.currentTarget.value);
    setEmailAvaileble(result.available);
  }


  const doRegister = async () => {
    try{
      if (usernameAvailable && emailAvailable) {
        console.log('registering')
     await postUser(inputs);
     handletoggle();
      }
    }
    catch (error) {
      console.error((error as Error).message);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doRegister,
    initValues,
  );
  return (
    <>
      <h3 className="text-3xl">Registration</h3>
      <form onSubmit={handleSubmit} className='flex flex-col text-center'>
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="username">Username</label>
          <input className="m-3 w-2/3 rounded-md border-slate-500 p3 text-slate-950"
            name="username"
            type="text"
            id="username"
            onChange={handleInputChange}
            onBlur={handleUsernameBlur}
            autoComplete="username"
          />
        </div>
       {!usernameAvailable && (<div className='flex w-4/5 justify-end pr-4'>
          <p className='text-red-500'>username not available</p>
        </div>)}
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="password">Password</label>
          <input className="m-3 w-2/3 rounded-md border-slate-500 p3 text-slate-950"
            name="password"
            type="password"
            id="password"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="email">Email</label>
          <input className="m-3 w-2/3 rounded-md border-slate-500 p3 text-slate-950"
            name="email"
            type="email"
            id="email"
            onChange={handleInputChange}
            onBlur={handleEmailBlur}
            autoComplete="email"
          />
        </div>
        {!emailAvailable && (<div className='flex w-4/5 justify-end pr-4'>
          <p className='text-red-500'>email not available</p>
        </div>)}
        <div className="flex w-4/5 justify-end">
        <button  className="m-3 w-1/3 rounded-md bg-slate-750 p3" type="submit" >Register</button>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
