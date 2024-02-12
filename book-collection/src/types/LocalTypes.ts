import { User, UserWithNoPassword } from '@sharedTypes/DBTypes';
export type Credentials = Pick<User, 'username' | 'password'>;


export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};

export type GraphQLResponse<T> = {
  data: T;
  errors?: { message: string }[];
};


