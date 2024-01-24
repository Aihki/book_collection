import {
  fetchAllMedia,
  fetchAllMediaByAppId,
  fetchMediaByTag,
} from '../models/mediaModel';
import {fetchTagsByMediaId} from '../models/tagModel';

export default {
  Query: {
    mediaItems: async () => {
      return await fetchAllMedia();
    },
    mediaitem: async (_parent: undefined, args: {book_id: string}) => {
      console.log('mediaItem args', args);
      const id = Number(args.book_id);
      return await fetchTagsByMediaId(id);
    },
    mediaItemsByTag: async (_parent: undefined, args: {tag: string}) => {
      console.log('tag parent', parent);
      return await fetchMediaByTag(args.tag);
    },
  },
};
