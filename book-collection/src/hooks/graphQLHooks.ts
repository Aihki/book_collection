import { useEffect, useState } from "react";
import { Like, MediaItem, MediaItemWithOwner, Rating, ReadingStatus, Review } from "@sharedTypes/DBTypes";
import {
  LoginResponse,
  MediaResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from "@sharedTypes/MessageTypes";
import { fetchData, makeQuery } from "../lib/utils";
import {Credentials, GraphQLResponse, RegCredentials} from '../types/LocalTypes';
import { useUpdateContext } from "./contexHooks";




const useBook = () => {

  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);
  const {update} = useUpdateContext();



const ownBookList = async (user_id: string) => {
  const query = `
  query OwnBookList($userId: ID!) {
    ownBookList(user_id: $userId) {
      book_id
      user_id
      owner {
        user_id
        username
        email
        level_name
        created_at
      }
      filename
      thumbnail
      book_genre
      filesize
      media_type
      title
      description
      created_at
      series_name
      status {
        status_name
      }
    }
  }
`;


  const variables = { userId: user_id };
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, variables}),
  };
  const result = await fetchData<{
    data: {ownBookList: MediaItemWithOwner[]};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);

   console.log(result.data.ownBookList)
    return result.data.ownBookList;
  };

const getBookById = async (book_id: string) => {
  const query = `
  query Query($bookId: ID!) {
    mediaItem(book_id: $bookId) {
      book_id
      user_id
      filename
      book_genre
      filesize
      thumbnail
      media_type
      title
      created_at
      series_name
      description
    }
  }
`;
 const variables = { bookId: book_id };
 const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, variables}),
  };
  const result = await fetchData<{
    data: {mediaItem: MediaItem};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  return result.data.mediaItem;
};




  const bookFeed = async (
  ) => {
    try {
      const query = `
      query MediaItems {
        mediaItems {
          book_id
          book_genre
          created_at
          description
          filename
          series_name
          thumbnail
          title
          owner {
            username
            user_id
          }
          rating {
            rating_value
          }
          review {
            review_text
          }
          status {
            status_name
          }
        }
      }
    `;
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query}),
      };
      const result = await fetchData<{
        data: {mediaItems: MediaItemWithOwner[]};
      }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
      setMediaArray(result.data.mediaItems);
    } catch (e) {
      console.log("getMedia", (e as Error).message);
    }
  };
  useEffect(() => {
    bookFeed();
  }, [update]);

  const postBook = async (
    file: UploadResponse,
    inputs: Record<string, string>,
    token: string,
  ) => {
    const book: Omit<
      MediaItem,
      'book_id' | 'thumbnail' | 'created_at'
    > = {
      title: inputs.title,
      description: inputs.description,
      book_genre: inputs.genre,
      filename: file.data.filename,
      filesize: file.data.filesize,
      media_type: file.data.media_type,
      series_name: inputs.series,
      user_id: file.data.user_id,
    };
    const query = `
    mutation Mutation($input: MediaItemInput!) {
      createMediaItem(input: $input) {
        book_id
        user_id
        owner {
          created_at
          level_name
          email
          username
          user_id
        }
        filename
        book_genre
        filesize
        media_type
        title
        description
        created_at
        series_name
      }
    }
  `;
  const variables = { input: book };
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({query, variables}),
  };
  const bookResult = await fetchData<{
    data: {createMediaItem: MediaItemWithOwner};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
    return bookResult;
  }



  return {mediaArray, ownBookList , bookFeed, getBookById, postBook};
};

const useUser = () => {


  const getUserByToken = async (token: string) => {
    const query = `
    query CheckToken {
      checkToken {
        user_id
        username
        email
        level_name
        created_at
      }
    }
  `;
    const response = await makeQuery<GraphQLResponse<{ checkToken: UserResponse['user']}>, undefined>(
      query,
      undefined,
      token,
    );
    return response.data.checkToken;
  };

  const postUser = async (user: RegCredentials )=> {
    try {
      const query = `
    mutation CreateUser($input: InputUser) {
      createUser(input: $input) {
        username,
        email,
        level_name,
        created_at
      }
    }`
    ;
const variables = {
  input: {
    username: user.username,
    password: user.password,
    email: user.email,
  },
};
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({query, variables}),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const newUserData = await fetchData<{
    data: {createUser: UserResponse};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  const data = newUserData.data.createUser.user;
  return data;
} catch (error) {
  console.error('postUser failed', error);
}
};


const getUsernameAvailable = async (username: string) => {
    const query = `
    query CheckUsername($username: String!) {
      checkUsername(username: $username) {
        available
        message
      }
    }
  `;

  const userCheckResult = await makeQuery<GraphQLResponse<{ checkUsername: {available: boolean} }>, {username:string} >(
    query,
    {username} ,
  );

  return userCheckResult.data.checkUsername.available;
}

const getEmailAvailable = async (email: string) => {
    const query = `
    query CheckEmail($email: String!) {
      checkEmail(email: $email) {
        message
        available
      }
    }
  `;
    const emailCheckResult = await makeQuery<GraphQLResponse<{ checkEmail: {available: boolean}  }>, {email:string}>(
      query,
      {email}
    );

  return emailCheckResult.data.checkEmail.available;
}
  return {getUserByToken, postUser, getUsernameAvailable, getEmailAvailable};
};

const useAuthentication = () => {
  const postLogin = async (creds: Credentials) => {
    const query = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
        message
        user {
          user_id
          username
          email
          level_name
          created_at
        }
      }
    }
  `;
  const variables = {
    username: creds.username,
    password: creds.password,
  };
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({query, variables}),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const loginResult = await fetchData<{
    data: {login: LoginResponse};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  return loginResult.data.login;
  };
return {postLogin};

};
const useFile = () => {
  const postFile = async(file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };
    return await fetchData<UploadResponse>(import.meta.env.VITE_UPLOAD_SERVER +'/upload', options);
  }
  return {postFile};
};

const useLike = () => {
  const postLike = async (book_id: string, token: string) => {
    const query = `
    mutation CreateLike($bookId: ID!) {
      createLike(book_id: $bookId) {
        message
      }
    }
  `;
  const variables = { bookId: book_id }
const options: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  },
  body: JSON.stringify({query, variables}),
};
  const likeResult = await fetchData<{
    data: {createLike: MessageResponse};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  return likeResult.data.createLike;
  };


  const deleteLike = async (like_id: string, token: string) => {
    const query = `
    mutation DeleteLike($likeId: ID!) {
      deleteLike(like_id: $likeId) {
        message
      }
    }
  `;
const variables = { likeId: like_id };
const options: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  },
  body: JSON.stringify({query, variables}),
  };
  const likeResult = await fetchData<{
    data: {deleteLike: MessageResponse};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  return likeResult.data.deleteLike;
  }

  const getCountByMediaId = async (book_id: string) => {
    const query = `
    query Mediaitem($bookId: ID!) {
      mediaItem(book_id: $bookId) {
       likes {
         like_id
       }
      }
    }
  `;
const variables = { bookId: book_id };
const options: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({query, variables}),
  };
  const result = await fetchData<{
    data: {mediaItem: {likes: {like_id: string}[]}};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options
  );
return {count: result.data.mediaItem.likes.length}
  };

  const getUserLike = async (book_id: string, token: string) => {
    const query = `
    query Mediaitem($bookId: ID!) {
      mediaItem(book_id: $bookId) {
        likes {
          user {
            user_id
          }
          like_id
        }
      }
    }
  `;
const variables = { bookId: book_id };
const options: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  },
  body: JSON.stringify({query, variables}),
  };
  const result = await fetchData<{
    data: {mediaItem: {likes: Like[]}};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  return result.data.mediaItem.likes;
  }


  return {postLike, deleteLike, getCountByMediaId, getUserLike};
};

const useReview = () => {
  const postReview = async (
    review_text: string,
    book_id: string,
     token: string) => {
    const query = `
    mutation AddReview($bookId: ID!, $reviewText: String!) {
      addReview( book_id: $bookId, review_text: $reviewText) {
        message
      }
    }
  `;
const variables = {
  bookId: book_id,
  reviewText: review_text,
};
const options: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  },
  body: JSON.stringify({query, variables}),
  };
  const result = await fetchData<{
    data: {addReview: MessageResponse};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options
  );
  return result.data.addReview;
  };


  const getReviewByBookId = async (book_id: string) => {
      const query = `
      query Review($bookId: ID!) {
        review(book_id: $bookId) {
          review_id
          review_text
          created_at
          user {
            username
          }
        }
      }
  `;
const variables = { bookId: book_id };
const options: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({query, variables}),
  };
  const result = await fetchData<{
    data: {review: Review[]};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options
  );
  return result.data.review;
  };

  return { postReview, getReviewByBookId };
};

const useRating = () => {
  const postRating = async (
    rating_value: number,
    book_id: string,
    token: string,
  ) => {
    const query = `
    mutation AddRating($bookId: ID!, $ratingValue: Int!) {
      addRating(book_id: $bookId, rating_value: $ratingValue) {
        message
      }
    }
  `;
  const variables = {
    bookId: book_id,
    ratingValue: rating_value,
  };
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({query, variables}),
  };
  const result = await fetchData<{
    data: {addRating: MessageResponse};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  return result.data.addRating;
  };

const getRatingByBookId = async (book_id: string) => {
  const query = `
  query Rating($bookId: ID!) {
    rating(book_id: $bookId) {
      rating_id
      rating_value
    }
  }
`;

const variables = { bookId: book_id };
const options: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({query, variables}),
  };
  const result = await fetchData<{
    data: {rating: Rating};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  return result.data.rating;
}

  return {postRating, getRatingByBookId};
}

const useBookStatus = () => {
 const getAllStatus = async () => {
    const query = `
    query Status {
      status {
        status_name
        status_id
      }
    }
  `;

const options: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({query}),
  };
  const result = await fetchData<{
    data: {status: ReadingStatus[]};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);

  return result.data.status.map(status => ({
    status_name: status.status_name,
    status_id: status.status_id
  }));
  }

  const getBookStatus = async (book_id: string) => {
    const query = `
    query MediaItem($bookId: ID!) {
      mediaItem(book_id: $bookId) {
        status {
          status_name
        }
      }
    }
  `;
  const variables = { bookId: book_id };
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, variables}),
  };
  const result = await fetchData<{
    data: {mediaItem: {status: {status_name: string}}};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  return result.data.mediaItem.status.status_name;
  }

  const changeStatus = async (book_id: string, status_id: string, token: string) => {
    const query = `
    mutation UpdateBookStatus($input: BookStatusInput!, $bookId: ID!) {
      updateBookStatus(input: $input, book_id: $bookId) {
        message
      }
    }
  `;
  const variables = {
    input: {
      status_id,
    },
    bookId: book_id,
  };
const options: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  },
  body: JSON.stringify({query, variables}),
  };
  const result = await fetchData<{
    data: {updateBookStatus: MessageResponse};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  return result.data.updateBookStatus;
  }
  return {getAllStatus,changeStatus, getBookStatus};
}

export { useBook, useUser, useAuthentication, useFile, useLike, useReview, useRating, useBookStatus };
