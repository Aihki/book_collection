import {BookStatus} from '@sharedTypes/DBTypes';
import {allStatuses, putStatus} from '../models/statusModel';
import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';
import { fetchBooksStatus } from '../models/mediaModel';

export default {
  MediaItem: {
    status: async (parent: {book_id: string}) => {
      return await fetchBooksStatus(parent.book_id);
  },
  },
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
        status_id: args.input.status_id,
      };
      return await putStatus(userData, args.book_id);
    },
  },
};
