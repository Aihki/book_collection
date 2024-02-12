
import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';
import { bookRatings, postRating } from '../models/ratingModel';

export default {

  MediaItem: {
    ratings: async (parent: {book_id: string}) => {
      return await bookRatings(Number(parent.book_id));
    },
  },
  Query: {
    ratings: async (_parent: undefined, arg: {book_id: string}) => {
      const id = Number(arg.book_id);
      return await bookRatings(id);
    },
  },
  Mutation: {
    addRating: async (
      _parent: undefined,
      args: {book_id: string;  rating: string; },
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const user_id = context.user.user_id;
      return await postRating(
        Number(args.book_id),
        user_id,
        Number(args.rating),
        context.user.level_name,
      );

    },
  },
};
