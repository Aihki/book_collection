import {allStatuses} from '../models/statusModel';

export default {
  Query: {
    status: async () => {
      return await allStatuses();
    },
  },
};
