import {
  bookReviews,
  postReview,
} from '../models/reviewModel';
import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';

export default {
MediaItem: {
  reviews: async (parent: {book_id: string}) => {
    return await bookReviews(Number(parent.book_id));
  },
},

  Query: {
    reviews: async (_parent: undefined, arg: {book_id: string}) => {
      const id = Number(arg.book_id);
      return await bookReviews(id);
    },
  },
  Mutation: {
    addReview: async (
      _parent: undefined,
      args: {book_id: string;  review: string; },
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const user_id = context.user.user_id;
      return await postReview(
        Number(args.book_id),
        user_id,
        args.review,
        context.user.level_name,
      );

    },
  },
};
