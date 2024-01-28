import {BookStatus} from '@sharedTypes/DBTypes';
import {allStatuses, putStatus} from '../models/statusModel';
import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';

export default {
  Query: {
    status: async () => {
      return await allStatuses();
    },
  },

  Mutation: {
    updateBookStatus: async (
      _parent: undefined,
      args: {input: Pick<BookStatus, 'status_id' | 'user_id'>; book_id: string},
      contex: MyContext,
    ) => {
      if (!contex.user || !contex.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const userData = {
        ...args.input,
        status_id: Number(args.input.status_id),
      };
      return await putStatus(userData, Number(args.book_id));
    },
  },
};
