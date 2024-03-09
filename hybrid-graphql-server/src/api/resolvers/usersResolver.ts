import {User, UserWithNoPassword} from '@sharedTypes/DBTypes';
import {fetchData} from '../../lib/functions';
import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';
import {LoginResponse, UserResponse} from '@sharedTypes/MessageTypes';

export default {
  MediaItem: {
    owner: async (parent: {user_id: string}) => {
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
      console.log('username', args.username);
      const user = await fetchData(
        process.env.AUTH_SERVER + `/users/username/${args.username}`,
      );
      console.log('user', user);
      return user;
    },
    checkEmail: async (_parent: undefined, args: {email: string}) => {
      console.log('email', args.email);
      const user = await fetchData(
        process.env.AUTH_SERVER + `/users/email/${args.email}`,
      );
      console.log('user', user);
      return user;
    },
    checkToken: async (_parent: undefined, args: {token: string}) => {
      const user = await fetchData(process.env.AUTH_SERVER + '/users/token/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${args.token}`,
        },
      });
    },
  },
  Mutation: {
    createUser: async (
      _parent: undefined,
      args: {input: Pick<User, 'username' | 'email' | 'password'>},
    ) => {
      const options: RequestInit = {
        method: 'POST',
        body: JSON.stringify(args.input),
        headers: {'Content-Type': 'application/json'},
      };
      const user = await fetchData<UserResponse>(
        process.env.AUTH_SERVER + '/users',
        options,
      );
      return user;
    },

    login: async (
      _parent: undefined,
      args: Pick<User, 'username' | 'password'>,
    ) => {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(args),
      };
      console.log(options);
      const user = await fetchData<LoginResponse>(
        process.env.AUTH_SERVER + '/auth/login',
        options,
      );
      console.log(user);
      return user;
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
        body: JSON.stringify(args.input),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.user.token}`,
        },
      };
      const user = await fetchData<UserResponse>(
        process.env.AUTH_SERVER + '/users',
        options,
      );
      return user;
    },

    deleteUser: async (_parent: undefined, args: {}, context: MyContext) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const options: RequestInit = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.user.token}`,
        },
      };
      const user = await fetchData<UserResponse>(
        process.env.AUTH_SERVER + '/users',
        options,
      );
      return user;
    },
  },
};
