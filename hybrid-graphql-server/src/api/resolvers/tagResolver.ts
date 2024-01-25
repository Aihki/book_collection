import {Tag} from '@sharedTypes/DBTypes';
import {
  deleteTag,
  fetchAllTags,
  fetchTagsByMediaId,
  postTag,
} from '../models/tagModel';

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
  Mutation: {
    createTag: async (
      _parent: undefined,
      args: {input: Omit<Tag, 'tag_id'>},
    ) => {
      return await postTag(args.input);
    },

    deleteTag: async (_parent: undefined, args: {input: string}) => {
      return await deleteTag(Number(args.input));
    },
  },
};
