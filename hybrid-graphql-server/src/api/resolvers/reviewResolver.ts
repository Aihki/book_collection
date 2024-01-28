import {Rating, Review} from '@sharedTypes/DBTypes';
import {
  bookRatings,
  bookReviews,
  postRating,
  postReview,
} from '../models/reviewModel';
import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';

export default {
  Query: {
    reviews: async (_parent: undefined, arg: {book_id: string}) => {
      const id = Number(arg.book_id);
      return await bookReviews(id);
    },
    ratings: async (_parent: undefined, arg: {book_id: string}) => {
      const id = Number(arg.book_id);
      return await bookRatings(id);
    },
  },
  Mutation: {
    createReview: async (
      _parent: undefined,
      args: {input: Omit<Review, 'review_id' | 'created_at' | 'user_id'>},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const userData = {
        ...args.input,
        user_id: context.user.user_id,
      };
      console.log(userData);
      return await postReview(userData);
    },
    createRating: async (
      _parent: undefined,
      args: {input: Omit<Rating, 'rating_id' | 'created_at' | 'user_id'>},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const userData = {
        ...args.input,
        user_id: context.user.user_id,
      };
      return await postRating(userData);
    },
  },
};
