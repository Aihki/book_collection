import {bookReviews} from '../models/reviewModel';

export default {
  Query: {
    reviews: async (_parent: undefined, arg: {book_id: string}) => {
      const id = Number(arg.book_id);
      console.log(id);
      return await bookReviews(id);
    },
  },
};
