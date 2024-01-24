import {fetchAllTags, fetchTagsByMediaId} from '../models/tagModel';

export default {
  MediaItem: {
    tags: async (parent: {book_id: string}) => {
      console.log(parent);
      return await fetchTagsByMediaId(Number(parent.book_id));
    },
  },

  Query: {
    tags: async () => {
      return await fetchAllTags();
    },
  },
};
