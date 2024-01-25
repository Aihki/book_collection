import {TokenContent, UserWithLevel} from '@sharedTypes/DBTypes';

type UserFromToken = TokenContent & {
  token: string;
};

type MyContext = {
  user?: UserFromToken;
};

export {MyContext, UserFromToken};
