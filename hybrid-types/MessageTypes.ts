import { MediaItem, BookStatus, UserWithNoPassword } from "./DBTypes";

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type MediaResponse = MessageResponse & {
  media: MediaItem | MediaItem[];
};

type StatusResponse = MessageResponse & {
  status: BookStatus | BookStatus[];
};

// for auth server
type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: UserWithNoPassword;
};

type UserResponse = MessageResponse & {
  user: UserWithNoPassword;
};

type UserDeleteResponse = MessageResponse & {
  user: { user_id: number };
};

type AvailableResponse = Partial<MessageResponse> & {
  available?: boolean;
};

// for upload server
type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    media_type: string;
    filesize: number;
    user_id: string;
  };
};

export type {
  MessageResponse,
  ErrorResponse,
  MediaResponse,
  LoginResponse,
  UploadResponse,
  UserResponse,
  UserDeleteResponse,
  StatusResponse,
  AvailableResponse,
};
