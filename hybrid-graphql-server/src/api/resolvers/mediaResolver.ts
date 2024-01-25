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

export default {
  Query: {
    mediaItems: async () => {
      return await fetchAllMedia();
    },
    ownBookList: async (_parent: undefined, args: {user_id: string}) => {
      console.log('ownBookList args', args);
      const id = Number(args.user_id);
      return await ownBookList(id);
    },

    mediaitem: async (_parent: undefined, args: {book_id: string}) => {
      console.log('mediaItem args', args);
      const id = Number(args.book_id);
      return await fetchMediaById(id);
    },
    mediaItemsByTag: async (_parent: undefined, args: {tag: string}) => {
      console.log('tag parent', parent);
      return await fetchMediaByTag(args.tag);
    },
  },
  Mutation: {
    createMediaItem: async (
      _parent: undefined,
      args: {input: Omit<MediaItem, 'book_id'>},
    ) => {
      return await postMedia(args.input);
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

    /*deleteMediaItem: async (_parent: undefined, args: undefined) => {
      return await deleteMedia();
    }, */
  },
};
