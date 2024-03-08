/* import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Rating, Review, reviewResult} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

//r = reviews
//rt = ratings
const bookReviews = async (id: string): Promise<reviewResult[] | null> => {
  try {
    const [results] = await promisePool.execute<
      RowDataPacket[] & reviewResult[]
    >(
      `
      SELECT r.*, rt.rating_value
      FROM Reviews r
      LEFT JOIN Ratings rt ON r.book_id = rt.book_id AND r.user_id = rt.user_id
      WHERE r.book_id = ?;
      `,
      [id]
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

const postRating = async (
  rating: Omit<Rating, 'rating_id' | 'created_at'>
): Promise<Rating | null> => {
  const {book_id, user_id, rating_value} = rating;
  try {
    const [results] = await promisePool.execute<ResultSetHeader>(
      `
      INSERT INTO Ratings (book_id, user_id, rating_value)
      VALUES (?, ?, ?);
      `,
      [book_id, user_id, rating_value]
    );

    const newRating = {
      rating_id: results.insertId,
      book_id,
      user_id,
      rating_value,
      created_at: new Date(),
    };

    return newRating;
  } catch (e) {
    console.error('addRatingById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const postReview = async (
  review: Omit<Review, 'review_id' | 'created_at'>
): Promise<Review | null> => {
  const {book_id, user_id, review_text} = review;
  try {
    const [results] = await promisePool.execute<ResultSetHeader>(
      `
      INSERT INTO Reviews (book_id, user_id, review_text)
      VALUES (?, ?, ?);
      `,
      [book_id, user_id, review_text]
    );

    const newReview = {
      review_id: results.insertId,
      book_id,
      user_id,
      review_text,
      created_at: new Date(),
    };
    console.log('newReview', newReview)

    return newReview;
  } catch (e) {
    console.error('addReviewById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {bookReviews, postRating, postReview};
 */
