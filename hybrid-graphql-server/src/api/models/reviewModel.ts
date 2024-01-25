import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Rating, Review, reviewResult} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const bookReviews = async (id: number): Promise<Review[] | null> => {
  try {
    const [results] = await promisePool.execute<RowDataPacket[] & Review[]>(
      `
      SELECT * FROM Reviews
      WHERE book_id = ?;
      `,
      [id],
    );
    if (results.length === 0) {
      return null;
    }
    return results;
  } catch (e) {
    console.error('bookReviews error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const bookRatings = async (id: number): Promise<Rating[] | null> => {
  try {
    const [results] = await promisePool.execute<RowDataPacket[] & Rating[]>(
      `
      SELECT * FROM Ratings
      WHERE book_id = ?;
      `,
      [id],
    );
    if (results.length === 0) {
      return null;
    }
    return results;
  } catch (e) {
    console.error('bookRatings error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const postRating = async (
  rating: Omit<Rating, 'rating_id' | 'created_at'>,
): Promise<Rating | null> => {
  const {book_id, user_id, rating_value} = rating;
  console.log(rating);
  try {
    const [results] = await promisePool.execute<RowDataPacket[] & Rating[]>(
      `
      INSERT INTO Ratings (book_id, user_id, rating_value)
      VALUES (?, ?, ?);
      `,
      [book_id, user_id, rating_value],
    );
    return results[0];
  } catch (e) {
    console.error('addRatingById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const postReview = async (
  review: Omit<Review, 'review_id' | 'created_at'>,
): Promise<Review | null> => {
  const {book_id, user_id, review_text} = review;
  console.log(review);
  try {
    const [results] = await promisePool.execute<RowDataPacket[] & Review[]>(
      `
      INSERT INTO Reviews (book_id, user_id, review_text)
      VALUES (?, ?, ?);
      `,
      [book_id, user_id, review_text],
    );
    console.log(results);
    return results[0];
  } catch (e) {
    console.error('addReviewById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {bookReviews, postRating, postReview, bookRatings};
