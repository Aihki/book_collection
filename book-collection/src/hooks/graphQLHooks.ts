import { useEffect, useState } from "react";
import { Like, MediaItem, MediaItemWithOwner, Rating, ReadingStatus, Review, User, UserWithNoPassword } from "@sharedTypes/DBTypes";
import {
  AvailableResponse,
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


  const result =
    await makeQuery<GraphQLResponse<{ ownBookList: MediaItemWithOwner[] }>, { userId: string; } >(
   query,
    {userId: user_id}
   );
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
  const result =
    await makeQuery<GraphQLResponse<{ mediaItem: MediaItem }>, { bookId: string }>(
      query,
      { bookId: book_id },
    );
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
      const result =
        await makeQuery<GraphQLResponse<{ mediaItems: MediaItemWithOwner[] }>, undefined>(
       query, );
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
  console.log(variables)
  const bookResult = await makeQuery<
  GraphQLResponse<{ createMedia: MediaResponse }>,
  { input: Omit<MediaItem, 'book_id' | 'thumbnail' | 'created_at'> }
>(query, variables, token);
    return bookResult;
  }



  return {mediaArray, ownBookList , bookFeed, getBookById, postBook};
};

const useUser = () => {
  const [userArray, setUserArray] = useState<UserWithNoPassword[]>([]);

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
      const query = `
    mutation CreateUser($input: InputUser) {
      createUser(input: $input) {
        username,
        email,
        level_name,
        created_at
      }
    }`;
const variables = {
  input: {
    username: user.username,
    password: user.password,
    email: user.email,
  }
};

const userResult = await makeQuery<GraphQLResponse<{ createUser: User }>, { input: RegCredentials
}>(query, variables);
    return userResult.data.createUser;
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

  const userCheckResult = await makeQuery<GraphQLResponse<{ checkUsername: AvailableResponse }>, {username:string} >(
    query,
    { username },
  );

  return userCheckResult.data.checkUsername;
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
    const emailCheckResult = await makeQuery<GraphQLResponse<{ checkEmail: AvailableResponse  }>, {email:string}>(
      query,
      {email}
    );

  return emailCheckResult.data.checkEmail;
}
  return {userArray, getUserByToken, postUser, getUsernameAvailable, getEmailAvailable};
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
  const loginResult = await makeQuery<GraphQLResponse<{login: LoginResponse}>, Credentials>(query, creds);
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
return await makeQuery<GraphQLResponse<{ createLike: MessageResponse }>, { bookId: string }>(
    query,
    variables,
    token,
  );
  };

  const deleteLike = async (like_id: string, token: string) => {
    const query = `
    mutation DeleteLike($likeId: ID!) {
      deleteLike(like_id: $likeId) {
        message
      }
    }
  `;
const variables = { likeId: like_id }
console.log(like_id, token)
return await makeQuery<GraphQLResponse<{ deleteLike: MessageResponse }>, { likeId: string }
>(query, variables, token);
  };

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
  const result = await makeQuery<GraphQLResponse<{ mediaItem: {likes: Like[]} }>, { bookId: string }>(
    query,
    { bookId: book_id },
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
  const result = await makeQuery<GraphQLResponse<{ mediaItem: { likes: { user: {user_id: string }, like_id: string}[]} }>,
  { bookId: string }
  >(query, {bookId: book_id}, token);
  const userLikes = result.data.mediaItem.likes.map(like => ({
    user_id: like.user.user_id,
    like_id: like.like_id
    }));
  return userLikes;
  };

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
  const result = await makeQuery<GraphQLResponse<{ addReview: MessageResponse }>, { bookId: string,reviewText: string }>(
    query,
    { bookId: book_id, reviewText:review_text },
    token,
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
  const result = await makeQuery<GraphQLResponse<{ review:  Review[] }>, { bookId: string }>(
    query,
    { bookId: book_id },
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
  return await makeQuery<GraphQLResponse<{ addRating: MessageResponse }>, { bookId: string, ratingValue: number }>(
    query,
    { bookId: book_id, ratingValue: rating_value },
    token,
  );
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

  const result = await makeQuery<GraphQLResponse<{rating: Rating[] }>, { bookId: string }>(
    query,
    { bookId: book_id },
  );

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
  const result = await makeQuery<GraphQLResponse<{ status: ReadingStatus[] }>, undefined>(
    query,
  );
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
  const result = await makeQuery<GraphQLResponse<{ mediaItem: {status:{status_name:string}} }>, { bookId: string }>(
    query,
    { bookId: book_id },
  );
    console.log(result.data.mediaItem.status.status_name)
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
  return await makeQuery<GraphQLResponse<{ updateBookStatus: MessageResponse }>, { input: { status_id: string }, bookId: string }>(
    query,
    variables,
    token,
  );
  }
  return {getAllStatus,changeStatus, getBookStatus};
}

export { useBook, useUser, useAuthentication, useFile, useLike, useReview, useRating, useBookStatus };
