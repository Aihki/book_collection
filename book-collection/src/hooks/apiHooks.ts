import { useState } from "react";
import { MediaItem, MediaItemWithOwner } from "@sharedTypes/DBTypes";
import { LoginResponse, MediaResponse, UploadResponse, UserResponse } from "@sharedTypes/MessageTypes";
import { makeQuery } from "../lib/functions";
import { fetchData } from "../lib/utils";


const useBook = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);

  const bookFeed = async () => {
    try {
      const query = `
    query MediaItems {
      mediaItems {
        book_genre
        description
        title
        owner {
          username
        }
    }
    `;
    const result =
            await makeQuery<GraphQLResponse<{mediaItems: MediaItemWithOwner[]}>>(
                query,
            );
        setMediaArray(result.data.mediaItems);
    } catch (e) {
        console.log('getMedia', (e as Error).message);
    }
};



const postBook = async (file: UploadResponse,
  inputs: Record<string, string>,
  token: string,) => {
    const book: Omit<MediaItem, 'book_id' | 'created_at' | 'thumbnail' | 'user_id' | "owner"> = {
      title: inputs.title,
      description: inputs.description,
      book_genre: inputs.book_genre,
      filename: file.data.filename,
      filesize: file.data.filesize,
      media_type: file.data.media_type,
      series_name: inputs.series_name,
    };

    const query = `
    mutation CreateMedia($input: InputMedia!) {
      createMedia(input: $input) {
        title
        description
        book_genre
        filename
        filesize
        media_type
        series_name
      }
    }
  `;
  const bookResult = await makeQuery<MediaResponse>(query, book, token);




    return  mediaArray ;

};

}

const useUser = () => {
  const getUserByToken = async (token: string) => {



};
const postUser = async (user:{
  username:string;
  email: string;
  password:string;}) => {

  const query = `
  mutation CreateUser($input: InputUser!) {
    createUser(input: $input) {
      username
      user_id
      level_name
      email
      created_at
    }
  }`;
  const userResult = await makeQuery<UserResponse>(query, user);
}
}

const useAuthentication = () => {
  const postLogin = async (inputs: Record<string, string>) => {
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
      const token = localStorage.getItem('token');
    const loginResult = await makeQuery<LoginResponse>(query, inputs, token as string);

};
};
const useFile = () => {
  // TODO: complete the postFile function
  const postFile = async (file: File, token: string) => {
      const formData = new FormData();
      formData.append('file', file);
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
 const fileResult = await makeQuery<UploadResponse>(query, formData, token);
}
return postFile;
}





export {useBook, useUser, useAuthentication, useFile};
