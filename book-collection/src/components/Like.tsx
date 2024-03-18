import {useEffect, useReducer} from 'react';
import {Like, MediaItemWithOwner} from '@sharedTypes/DBTypes';
import {useLike} from '../hooks/graphQLHooks';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'setLikeCount' | 'like';
  like?: Like | null;
  count?: number;
};

const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

const likeReducer = (state: LikeState, action: LikeAction): LikeState => {
  switch (action.type) {
    case 'setLikeCount':
      return {...state, count: action.count ?? 0};
    case 'like':
      if (action.like !== undefined) {
        return {...state, userLike: action.like};
      }
      return state;
  }
};

const Likes = ({book}: {book: MediaItemWithOwner}) => {
  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);
  const {getUserLike, getCountByMediaId, postLike, deleteLike} = useLike();

  // get user like
  const getLikes = async () => {
    const token = localStorage.getItem('token');
    if (!book || !token) {
      return;
    }
    try {
      const response = await getUserLike(book.book_id, token);
      const userLike: Like | null = response.length > 0
      ? { ...response[0], book_id: '', created_at: new Date() }
      : null;
      likeDispatch({type: 'like', like: userLike});
    } catch (e) {
      likeDispatch({type: 'like', like: null});
      console.log('get user like error', (e as Error).message);
    }
  };


  const getLikeCount = async () => {
    try {
      const countResponse = await getCountByMediaId(book.book_id);
      likeDispatch({type: 'setLikeCount', count: countResponse.count});
    } catch (e) {
      likeDispatch({type: 'setLikeCount', count: 0});
      console.log('get user like error', (e as Error).message);
    }
  };

  useEffect(() => {
    getLikes();
    getLikeCount();
  }, [book]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!book || !token) {
        return;
      }
      if (likeState.userLike) {
        await deleteLike(likeState.userLike.like_id, token);
        likeDispatch({type: 'setLikeCount', count: likeState.count - 1});
        likeDispatch({type: 'like', like: null});
      } else {
        await postLike(book.book_id, token);
        getLikes();
        getLikeCount();
      }
    } catch (e) {
      console.log('like error', (e as Error).message);
    }
  };


  return (
    <>
    <div className="flex items-center">
      <span>{likeState.count}</span>
      <button onClick={handleLike} className='text-l p-1'>
        {likeState.userLike ? (<AiFillHeart className='text-red-500' /> ): ( <AiOutlineHeart />)}
      </button>
    </div>
  </>
  );
};

export default Likes;
