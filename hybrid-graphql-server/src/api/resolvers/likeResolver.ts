import {GraphQLError} from 'graphql';
import {
  deleteLike,
  fetchAllLikes,
  fetchLikesByMediaId,
  fetchLikesByUserId,
  fetchLikesCountByMediaId,
  postLike,
} from '../models/likeModel';
import {MyContext} from '../../local-types';

export default {
  MediaItem: {
    likes: async (parent: {book_id: string}) => {
      return await fetchLikesByMediaId(parent.book_id);
    },
    likes_count: async (parent: {book_id: string}) => {
      return await fetchLikesCountByMediaId(parent.book_id);
    },
  },
  Query: {
    likes: async () => {
      return await fetchAllLikes();
    },
    likesByBookID: async (
      _parent: undefined,
      args: {book_id: string},
    ) => {
      return await fetchLikesByMediaId(args.book_id);
    },
    myLikes: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await fetchLikesByUserId(context.user.user_id);
    },
  },
  Mutation: {
    deleteLike: async (
      _parent: undefined,
      args: {like_id: string},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      return await deleteLike(
        args.like_id,
        context.user.user_id,
        context.user.level_name,
      );
    },
    createLike: async (
      _parent: undefined,
      args: {book_id: string},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const user_id = context.user.user_id;
      return await postLike(args.book_id, user_id);
    },
  },
};
