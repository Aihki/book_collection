import {MediaItem} from '@sharedTypes/DBTypes';
import {
  deleteMedia,
  fetchAllMedia,
  fetchMediaById,
  ownBookList,
  postMedia,
  putMedia,
} from '../models/mediaModel';
import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';
import {bookReviews} from '../models/reviewModel';
import {bookRatings} from '../models/ratingModel';

export default {
  Rating: {
    book: async (parent: {book_id: string}) => {
      return await bookRatings(parent.book_id);
    },
  },
  Review: {
    book: async (parent: {book_id: string}) => {
      return await bookReviews(parent.book_id);
    },
  },

  Query: {
    mediaItems: async () => {
      return await fetchAllMedia();
    },
    ownBookList: async (_parent: undefined, args: {user_id: string}) => {
      const id = args.user_id;
      return await ownBookList(id);
    },

    mediaItem: async (_parent: undefined, args: {book_id: string}) => {
      const id = args.book_id;
      return await fetchMediaById(id);
    },
  },
  Mutation: {
    createMediaItem: async (
      _parent: undefined,
      args: {
        input: Omit<
          MediaItem,
          'book_id' | 'created_at' | 'thumbnail' | 'user_id'
        >;
      },
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const userdata = {
        ...args.input,
        user_id: context.user.user_id,
      };
      return await postMedia(userdata);
    },

    updateMediaItem: async (
      _parent: undefined,
      args: {input: Pick<MediaItem, 'title' | 'description'>; book_id: string},
    ) => {
      return await putMedia(args.input, args.book_id);
    },

    deleteMediaItem: async (
      _parent: undefined,
      args: {book_id: string},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      return await deleteMedia(args.book_id, context.user, context.user.token);
    },
  },
};
