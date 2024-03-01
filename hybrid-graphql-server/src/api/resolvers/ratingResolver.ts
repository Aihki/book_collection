import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';
import { bookRatings, postRating } from '../models/ratingModel';

export default {
  MediaItem: {
    rating: async (parent: {book_id: string}) => {
      return await bookRatings(parent.book_id);
    },
  },
  Query: {
    rating: async (_parent: undefined, arg: {book_id: string}) => {
      const id = arg.book_id;
      return await bookRatings(id);
    },
  },
  Mutation: {
    addRating: async (
      _parent: undefined,
      args: {book_id: string;  rating_value: number; },
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const user_id = context.user.user_id;
      return await postRating(
        args.book_id,
        user_id,
        args.rating_value,
        context.user.level_name,
      );

    },
  },
};
