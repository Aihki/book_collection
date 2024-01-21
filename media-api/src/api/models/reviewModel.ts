import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {reviewResult} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

//r = reviews
//rt = ratings
const bookReviews = async (id: number): Promise<reviewResult[] | null> => {
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

export {bookReviews};
