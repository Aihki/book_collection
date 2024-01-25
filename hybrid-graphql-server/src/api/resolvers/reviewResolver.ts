import {Rating, Review} from '@sharedTypes/DBTypes';
import {
  bookRatings,
  bookReviews,
  postRating,
  postReview,
} from '../models/reviewModel';

export default {
  Query: {
    reviews: async (_parent: undefined, arg: {book_id: string}) => {
      const id = Number(arg.book_id);
      console.log('review id', id);
      return await bookReviews(id);
    },
    ratings: async (_parent: undefined, arg: {book_id: string}) => {
      console.log('rating id', arg.book_id);
      const id = Number(arg.book_id);
      return await bookRatings(id);
    },
  },
  Mutation: {
    createReview: async (
      _parent: undefined,
      args: {input: Omit<Review, 'review_id' | 'created_at'>},
    ) => {
      return await postReview(args.input);
    },
    createRating: async (
      _parent: undefined,
      args: {input: Omit<Rating, 'rating_id' | 'created_at'>},
    ) => {
      return await postRating(args.input);
    },
  },
};
