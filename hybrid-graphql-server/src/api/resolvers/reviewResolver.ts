import {bookReviews, postReview} from '../models/reviewModel';
import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';

export default {
  MediaItem: {
    review: async (parent: {book_id: string}) => {
      return await bookReviews(parent.book_id);
    },
  },
  Query: {
    review: async (_parent: undefined, arg: {book_id: string}) => {
      const id = arg.book_id;
      return await bookReviews(id);
    },
  },
  Mutation: {
    addReview: async (
      _parent: undefined,
      args: {book_id: string; review_text: string},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const user_id = context.user.user_id;
      return await postReview(
        args.book_id,
        user_id,
        args.review_text,
        context.user.level_name,
      );
    },
  },
};
