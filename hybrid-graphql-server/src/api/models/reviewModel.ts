import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Rating, Review, UserLevel, reviewResult} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const bookReviews = async (book_id: string): Promise<Review[] | null> => {
  try {
    const [results] = await promisePool.execute<RowDataPacket[] & Review[]>(
      `
      SELECT * FROM Reviews
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


const postReview = async (
  book_id: string,
  user_id: string,
  review_text: string,
  level_name: UserLevel['level_name'],
): Promise<MessageResponse | null> => {
  try {
    // Tarkista, onko samalla book_id:llä ja user_id:llä jo arvostelua
    const [existingResults] = await promisePool.execute<
      RowDataPacket[] & Review[]
    >(
      `
      SELECT * FROM Reviews WHERE book_id = ?;
      `,
      [book_id],
    );
    // Jos arvostelu löytyy, palauta null tai tee tarvittavat toimenpiteet
    if (existingResults.length > 0) {
      return null;
    }
    // Lisää uusi arvostelu tietokantaan
    console.log('postReview', book_id, user_id, review_text);
    const [results] = await promisePool.execute<ResultSetHeader>(
      `
      INSERT INTO Reviews (book_id, user_id, review_text)
      VALUES (?, ?, ?);
      `,
      [book_id, user_id, review_text],
    );
    if (results.affectedRows === 0) {
      return null;
    }

    return {message:'Review added'};
  } catch (e) {
    console.error('addReviewById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {bookReviews, postReview};
