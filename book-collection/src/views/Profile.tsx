/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import {UserResponse} from '@sharedTypes/MessageTypes';
import {useUser} from '../hooks/apiHooks';

const Profile = () => {
  const [user, setUser] = useState<UserResponse['user'] | null>(null);
  const {getUserByToken} = useUser();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('token');
      const usetResponse = await getUserByToken(token!);
      setUser(usetResponse.user);
    };
    getUser();
  }
  , []);


  return (
  <>
    <h1>Profile</h1>
    {user && (
      <>
        <p>Name:{user.username}</p>
        <p>Email:{user.email}</p>
        <p>Created: {new Date(user.created_at).toLocaleDateString('fi-FI')}</p>
      </>
    )}
  </>

  )
};

export default Profile;
