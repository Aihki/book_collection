import {LoginResponse, UserDeleteResponse, UserResponse} from '@sharedTypes/MessageTypes';
import {User, UserWithNoPassword} from '@sharedTypes/DBTypes';
import {fetchData} from '../../lib/functions';
import {MyContext, UserFromToken} from '../../local-types';
import {GraphQLError} from 'graphql';
import jwt from 'jsonwebtoken';
import { token } from 'morgan';




export default {
  MediaItem: {
    owner: async (parent: {user_id: string}) => {
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/' + parent.user_id,
      );
      return user;
    },
  },
  Rating: {
    user: async (parent: {user_id: string}) => {
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/' + parent.user_id,
      );
      return user;
    },
  },
  Review: {
    user: async (parent: {user_id: string}) => {
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/' + parent.user_id,
      );
      return user;
    },
  },
  Like: {
    user: async (parent: {user_id: string}) => {
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/' + parent.user_id,
      );
      return user;
    },
  },
  Query: {
    users: async () => {
      const users = await fetchData<UserWithNoPassword[]>(
        process.env.AUTH_SERVER + '/users',
      );
      return users;
    },
    user: async (_parent: undefined, args: {user_id: string}) => {
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/' + args.user_id,
      );
      return user;
    },

    checkUsername: async (_parent: undefined, args: {username: string}) => {
      const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      };

      const user = await fetchData(
        process.env.AUTH_SERVER + '/users/username/'+ args.username,
        options,
      );

      return user;
    },
    getUser: async (_parent: undefined, args: undefined, context: MyContext) => {
        const options: RequestInit = {
          headers: {
            Authorization: `Bearer ${context.user?.token}`,
          },
        };

        const user = await fetchData<UserWithNoPassword>(
          process.env.AUTH_SERVER + '/users/token',
          options,
        );
        console.log('user', user)
        return user;
      },

    checkEmail: async (_parent: undefined, args: {email: string}) => {
      const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      };

      console.log('email', args.email);
      const user = await fetchData(
        process.env.AUTH_SERVER + '/users/email/' + args.email,
        options,
      );

      return user;
    },
    checkToken: async (_parent: undefined, args: undefined, context: MyContext) => {
      if (!context.user || !context.user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + context.user.token,
        },
      };
      const user = await fetchData<UserResponse>(
        process.env.AUTH_SERVER +  '/users/token',
        options,
      );

      return user.user;
    },
  },

  Mutation: {
    createUser: async (
      _parent: undefined,
      args: {input: Pick<User, 'username' | 'email' | 'password'>},
    ) => {
      const options: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(args.input),
      };
      const userResponse = await fetchData<UserResponse>(
        process.env.AUTH_SERVER + '/users',
        options,
      );
      return userResponse.user;
    },
    login: async (
      _parent: undefined,
      args: Pick<User, 'username' | 'password'>,
    ) => {
     const login = await fetchData<LoginResponse>(
        process.env.AUTH_SERVER + '/auth/login',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(args),
        },
      );
      const user = jwt.verify(login.token, process.env.JWT_SECRET as string) as UserFromToken
        return login;
    },

    updateUser: async (
      _parent: undefined,
      args: {input: Pick<User, 'username' | 'email' | 'password'>},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const options: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.user.token}`,
        },
        body: JSON.stringify(args.input),
      };
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users',
        options,
      );
      return user;
    },

    deleteUser: async (_parent: undefined, args: undefined, context: MyContext) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const options: RequestInit = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + context.user.token,
        },
      };
      const user = await fetchData<UserDeleteResponse>(
        process.env.AUTH_SERVER + '/users',
        options,
      );
      return user;
    },
  },
};
