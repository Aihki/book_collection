import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Rating, UserLevel} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const bookRatings = async (book_id: string): Promise<Rating[] | null> => {
  try {
    const [results] = await promisePool.execute<RowDataPacket[] & Rating[]>(
      `
      SELECT * FROM Ratings
      WHERE book_id = ?;
      `,
      [book_id],
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
  book_id: string,
  user_id: string,
  rating: number,
  level_name: UserLevel['level_name'],
): Promise<MessageResponse | null> => {
  try {

    const [existingResults] = await promisePool.execute<
      RowDataPacket[] & Rating[]
    >(
      `
      SELECT * FROM Ratings WHERE book_id = ?;
      `,
      [book_id],
    );
    // Jos arvostelu löytyy, palauta null tai tee tarvittavat toimenpiteet
    if (existingResults.length > 0) {
      return null;
    }
    // Lisää uusi arvostelu tietokantaan
    const [results] = await promisePool.execute<ResultSetHeader>(
      `
      INSERT INTO Ratings (book_id, user_id, rating_value)
      VALUES (?, ?, ?);
      `,
      [book_id, user_id, rating],
    );
    if (results.affectedRows === 0) {
      return null;
    }

    return {message:'Review added'};
  } catch (e) {
    console.error('addRatingById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {bookRatings, postRating};
