import {Token} from './../../../../upload-server/node_modules/acorn/dist/acorn.d';
import {MediaItem} from '@sharedTypes/DBTypes';
import {
  deleteMedia,
  fetchAllMedia,
  fetchMediaById,
  fetchMediaByTag,
  ownBookList,
  postMedia,
  postTagToMedia,
  putMedia,
} from '../models/mediaModel';
import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';

export default {
  Query: {
    mediaItems: async () => {
      return await fetchAllMedia();
    },
    /*   ownBookList: async (_parent: undefined, args: {}, contex: MyContext) => {
      if (!contex.user || !contex.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const id = contex.user.user_id;
      return await ownBookList(id);
    }, */
    ownBookList: async (_parent: undefined, args: {user_id: string}) => {
      const id = Number(args.user_id);
      return await ownBookList(id);
    },

    mediaitem: async (_parent: undefined, args: {book_id: string}) => {
      const id = Number(args.book_id);
      return await fetchMediaById(id);
    },
    mediaItemsByTag: async (_parent: undefined, args: {tag: string}) => {
      return await fetchMediaByTag(args.tag);
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

    addTagToMediaItem: async (
      _parent: undefined,
      args: {input: {book_id: string; tag_name: string}},
    ) => {
      return await postTagToMedia(
        args.input.tag_name,
        Number(args.input.book_id),
      );
    },
    updateMediaItem: async (
      _parent: undefined,
      args: {input: Pick<MediaItem, 'title' | 'description'>; book_id: string},
    ) => {
      return await putMedia(args.input, Number(args.book_id));
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

      return await deleteMedia(
        Number(args.book_id),
        context.user,
        context.user.token,
      );
    },
  },
};
